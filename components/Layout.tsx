import React from 'react';
import { Newspaper, Github, ExternalLink } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.hash = ''}>
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">NewsGenie</h1>
                <p className="text-xs text-slate-500 font-medium">AI Powered Aggregator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block">Technology</a>
              <a href="#" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block">Business</a>
              <a href="#" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block">Science</a>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Github className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
               <span className="text-slate-400 text-sm flex items-center">
                 Powered by Gemini <ExternalLink className="ml-1 h-3 w-3"/>
               </span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-slate-400">
                &copy; {new Date().getFullYear()} NewsGenie AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;