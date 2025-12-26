import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Gallery from './views/Gallery';
import ArticleDetail from './views/ArticleDetail';

type View = 'gallery' | 'article';

const App: React.FC = () => {
  // Simple state-based routing since we don't need complex URLs for this single-page demo
  // In a larger app, we would use react-router-dom with HashRouter as requested
  const [currentView, setCurrentView] = useState<View>('gallery');
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);

  // Handle hash changes to support back button somewhat
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const id = hash.split('/')[1];
        if (id) {
          setSelectedArticleId(id);
          setCurrentView('article');
        }
      } else {
        setCurrentView('gallery');
        setSelectedArticleId(undefined);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger once on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: View, id?: string) => {
    if (view === 'article' && id) {
      window.location.hash = `article/${id}`;
    } else {
      window.location.hash = '';
    }
  };

  return (
    <Layout>
      {currentView === 'gallery' && (
        <Gallery onNavigate={navigate} />
      )}
      {currentView === 'article' && selectedArticleId && (
        <ArticleDetail 
          articleId={selectedArticleId} 
          onBack={() => navigate('gallery')} 
        />
      )}
    </Layout>
  );
};

export default App;