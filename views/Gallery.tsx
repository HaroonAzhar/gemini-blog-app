import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { fetchNewsArticles } from '../services/gemini';
import ArticleCard from '../components/ArticleCard';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';

interface GalleryProps {
  onNavigate: (page: string, articleId?: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsArticles(force);
      setArticles(data);
    } catch (err) {
      setError("Failed to fetch the latest news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleCardClick = (id: string) => {
    onNavigate('article', id);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Curating today's top stories...</h2>
        <p className="text-slate-500 mt-2">Powered by Gemini AI Search</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 serif mb-2">Top Headlines</h2>
          <p className="text-slate-600">The most important stories from around the globe, curated just for you.</p>
        </div>
        <button 
          onClick={() => loadNews(true)}
          className="flex items-center justify-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm text-sm font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh News
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start">
           <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
           <div>
             <h3 className="text-red-800 font-medium">Error Loading News</h3>
             <p className="text-red-700 text-sm mt-1">{error}</p>
             <button onClick={() => loadNews(true)} className="text-red-800 underline text-sm mt-2">Try Again</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onClick={handleCardClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;