import { GoogleGenAI } from "@google/genai";
import { Article } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We use local storage to cache news to avoid hitting rate limits and improve UX
const CACHE_KEY = 'news_cache_v1';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const fetchNewsArticles = async (forceRefresh = false): Promise<Article[]> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached && !forceRefresh) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      console.log('Serving news from cache');
      return parsed.data;
    }
  }

  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      You are a news aggregator robot. 
      Perform a Google Search to find the top 10 most important and recent news stories from the last 24 hours across various categories (World, Tech, Business, Science, Sports).
      
      For each story, extract or generate:
      1. A catchy headline.
      2. A comprehensive summary (at least 3-4 sentences).
      3. The source name (e.g., CNN, BBC, TechCrunch).
      4. The original link/URL found in the search grounding.
      5. A category.
      6. A published time (approximate is fine, e.g., "2 hours ago").

      Return the data strictly as a valid JSON array of objects. 
      Do NOT use code blocks or markdown formatting like \`\`\`json. Just return the raw JSON string.
      
      The JSON object format:
      [
        {
          "title": "...",
          "summary": "...",
          "source": "...",
          "originalLink": "...",
          "category": "...",
          "publishedAt": "..."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We avoid strict responseSchema here because it sometimes conflicts with Search tool output in current preview models
        // Instead we rely on the prompt's instruction for JSON.
        temperature: 0.7,
      },
    });

    let rawText = response.text || '';
    
    // Cleanup markdown code blocks if present despite instructions
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let articles: Partial<Article>[] = [];
    try {
      articles = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse JSON directly, attempting fallback extraction", e);
      // Fallback: simpler extraction if the model chats instead of just JSON
      // This is a basic contingency
      const jsonMatch = rawText.match(/\[.*\]/s);
      if (jsonMatch) {
        articles = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse news data from AI response.");
      }
    }

    // Post-process to add IDs and images
    const processedArticles: Article[] = articles.map((art, index) => ({
      id: `art-${Date.now()}-${index}`,
      title: art.title || "Untitled News",
      summary: art.summary || "No summary available.",
      source: art.source || "Unknown Source",
      originalLink: art.originalLink || "#",
      publishedAt: art.publishedAt || "Recently",
      category: art.category || "General",
      // Use picsum for nice visuals since we can't easily scrape real og:images without a proxy
      imageUrl: `https://picsum.photos/seed/${index + Date.now()}/800/600` 
    }));

    // Check for grounding chunks to enhance links if needed (though prompt asks for links directly)
    // The prompt explicitly asks for links in the JSON, which the model usually extracts from grounding.

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: processedArticles
    }));

    return processedArticles;

  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};