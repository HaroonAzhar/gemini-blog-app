import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import * as db from '../store/db';
import { MessageSquare, Send, User } from 'lucide-react';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(db.getComments(articleId));
  }, [articleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    // Simulate network delay for realism
    setTimeout(() => {
      const added = db.addComment(articleId, newComment, username || "NewsReader");
      setComments(prev => [added, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mt-10 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
          />
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this story..."
              className="w-full px-4 py-3 pb-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32 bg-white"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-md"
            >
              {isSubmitting ? 'Posting...' : (
                <>
                  Post Comment <Send className="h-3 w-3 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{comment.user}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed pl-11">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;