import React from 'react';
import { Article } from '../types';
import { Clock, ExternalLink, MessageSquare, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(article.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center font-medium text-indigo-600">
            {article.source}
          </span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {article.publishedAt}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-700 transition-colors serif">
          {article.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
          {article.summary}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center text-slate-500 text-sm group-hover:text-indigo-600 transition-colors font-medium">
            Read Full Story <ChevronRight className="h-4 w-4 ml-1" />
          </div>
          {/* Decorative icon, actual comment count would require DB query */}
          <MessageSquare className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;