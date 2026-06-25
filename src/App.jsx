import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazily load top-level pages
const Home = lazy(() => import('./pages/Home'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const AuthorProfile = lazy(() => import('./components/AuthorProfile'));

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Core Layout Navigation Shell */}
        <Navbar />

        {/* Dynamic Page Router with Suspense Boundaries */}
        <main className="main-content">
          <Suspense 
            fallback={
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '60vh', 
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="pulse-dot" style={{ width: '12px', height: '12px' }}></div>
                  <span>Retrieving Chronicle Content...</span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles/:articleId" element={<ArticleDetail />} />
              <Route path="/author/:authorId" element={<AuthorProfile />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}
