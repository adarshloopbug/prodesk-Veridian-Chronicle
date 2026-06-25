import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function TrendingArticlesSidebarComponent() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const navigate = useNavigate();
  const renderCount = useRef(0);

  renderCount.current += 1;
  console.log(`[TrendingArticlesSidebar] Rendered count: ${renderCount.current}`);

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=5&_sort=id&_order=desc'
      );
      if (response.ok) {
        const data = await response.json();
        // Map to simulate news-like categories and view counts
        const mappedData = data.map((item, idx) => ({
          id: item.id,
          title: item.title,
          views: Math.floor(15000 - idx * 2200 - Math.random() * 500),
          category: ['POLITICS', 'FINANCE', 'HEALTH', 'TECH', 'CULTURE'][idx % 5],
        }));

        setTrending(mappedData);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      }
    } catch (error) {
      console.error('[Trending] Failed to fetch trending articles:', error);
    }
  };

  useEffect(() => {
    fetchTrending();
    // Poll trending articles every 60 seconds
    const interval = setInterval(() => {
      console.log('[TrendingArticlesSidebar] 60s update cycle triggered. Fetching new data...');
      fetchTrending();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar-container glass-panel" style={{ padding: '24px', width: '100%' }}>
      <div className="pulse-header">
        <span className="pulse-dot" aria-hidden="true"></span>
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1.1rem' }}>
          Veridian Pulse
        </h3>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px' }}>
              <div className="shimmer" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="shimmer" style={{ width: '80%', height: '12px', borderRadius: '4px' }} />
                <div className="shimmer" style={{ width: '40%', height: '10px', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <ul 
            className="trending-list"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none' }}
            aria-label="Trending articles list"
          >
            {trending.map((article, idx) => (
              <li
                key={article.id}
                className="trending-item"
                role="button"
                tabIndex="0"
                onClick={() => navigate(`/articles/${article.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/articles/${article.id}`);
                  }
                }}
                aria-label={`Trending article ${idx + 1}: ${article.title}`}
              >
                <div className="trending-num" aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="trending-content">
                  <div className="trending-title" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    {article.title}
                  </div>
                  <div className="trending-meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{article.category}</span>
                    <span>{(article.views / 1000).toFixed(1)}k views</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div 
            style={{ 
              marginTop: '20px', 
              fontSize: '0.7rem', 
              color: 'var(--text-muted)', 
              textAlign: 'right' 
            }}
          >
            Last update: {lastUpdated} (every 60s)
          </div>
          <div 
            style={{ 
              fontSize: '0.65rem', 
              color: '#10b981', 
              textAlign: 'left',
              marginTop: '-10px'
            }}
          >
            Render Count: {renderCount.current}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap in React.memo() to prevent unnecessary re-renders from search changes
export const TrendingArticlesSidebar = React.memo(TrendingArticlesSidebarComponent);
