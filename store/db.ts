import { Comment } from '../types';

const COMMENTS_KEY = 'news_comments_db';

export const getComments = (articleId: string): Comment[] => {
  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return [];
    const allComments: Comment[] = JSON.parse(stored);
    return allComments.filter(c => c.articleId === articleId).sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error("DB Read Error", e);
    return [];
  }
};

export const addComment = (articleId: string, text: string, user: string = "Anonymous"): Comment => {
  const newComment: Comment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    articleId,
    text,
    user,
    createdAt: Date.now(),
  };

  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];
    allComments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    return newComment;
  } catch (e) {
    console.error("DB Write Error", e);
    throw e;
  }
};