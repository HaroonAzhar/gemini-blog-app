export interface Article {
  id: string;
  title: string;
  summary: string;
  fullContent?: string; // Generated on demand or expanded from summary
  source: string;
  originalLink: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
}

export interface Comment {
  id: string;
  articleId: string;
  user: string;
  text: string;
  createdAt: number;
}

export interface StoredData {
  articles: Article[];
  lastFetch: number;
}