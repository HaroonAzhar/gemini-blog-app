import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { fetchNewsArticles } from '../services/gemini';
import CommentSection from '../components/CommentSection';
import { ArrowLeft, Calendar, Globe, Share2, Check, ExternalLink } from 'lucide-react';

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In a real app we might fetch individual article by ID, 
    // but here we just grab from our cached list since it's an SPA
    const loadArticle = async () => {
      setLoading(true);
      try {
        const articles = await fetchNewsArticles();
        const found = articles.find(a => a.id === articleId);
        setArticle(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.summary,
      url: window.location.href, // In a real routing scenario this would be specific
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      // Fallback
      await navigator.clipboard.writeText(`${article?.title} - Read more: ${article?.originalLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading article...</div>;
  if (!article) return <div className="h-screen flex items-center justify-center">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button 
        onClick={onBack}
        className="group flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to Headlines
      </button>

      <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-64 md:h-96 w-full relative">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
             <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide w-fit mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white serif leading-tight shadow-sm">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-slate-500 text-sm">
                <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="font-semibold text-slate-700">{article.source}</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                <span>{article.publishedAt}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <a 
                href={article.originalLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
              >
                Visit Source <ExternalLink className="h-3 w-3 ml-2" />
              </a>
              <button 
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>

          <div className="prose prose-lg prose-indigo max-w-none text-slate-700 leading-relaxed">
            <p className="text-xl text-slate-900 font-medium mb-8 leading-8 serif">
              {article.summary}
            </p>
            {/* 
              Since we rely on the summary for now (AI scraping limit), 
              we display a note or simulate longer content if we had a full scraper.
              For this demo, we can just show the summary with a prompt to read more at source.
            */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 my-8">
               <h4 className="text-lg font-bold text-slate-900 mb-2">Key Takeaways</h4>
               <ul className="list-disc pl-5 space-y-2 text-slate-700">
                 <li>This article was sourced from <strong>{article.source}</strong> via Gemini AI.</li>
                 <li>The events described occurred around <strong>{article.publishedAt}</strong>.</li>
                 <li>For the complete in-depth coverage and live updates, please visit the original source link above.</li>
               </ul>
            </div>
          </div>
        </div>
      </article>

      <CommentSection articleId={article.id} />
    </div>
  );
};

export default ArticleDetail;