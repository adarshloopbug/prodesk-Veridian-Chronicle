import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendedArticles({ articleId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Check if user has reading history (simulated by reading localStorage flag)
      const hasHistory = localStorage.getItem('veridian_has_history') === 'true';
      
      let url = 'https://jsonplaceholder.typicode.com/users/1/posts'; // Personalised recommendations
      let apiSource = 'Personalized Reading History';

      if (!hasHistory) {
        // Fallback: popular articles in this category
        url = 'https://jsonplaceholder.typicode.com/posts?_limit=3&_start=15';
        apiSource = 'Popular Articles in Category';
      }

      console.log(`[Recommendations] Fetching from ${url} (Source: ${apiSource})...`);

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Slice to 3-5 items
          const items = data.slice(0, 3).map((item, idx) => ({
            id: item.id,
            title: item.title,
            author: ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova'][idx % 3],
            category: ['TECH', 'FINANCE', 'HEALTH'][idx % 3],
            readTime: `${idx + 3} min read`
          }));
          setArticles(items);
          setSource(apiSource);
        }
      } catch (err) {
        console.error('[Recommendations] Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay (600ms) to allow the skeleton shimmer to be visible to the user
    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 600);

    return () => clearTimeout(timer);
  }, [articleId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Loading Recommendations...</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="skeleton-card shimmer" style={{ flex: 1, height: '140px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>Recommended For You</h3>
        <span 
          style={{ 
            fontSize: '0.7rem', 
            color: 'var(--accent-primary)', 
            background: 'rgba(16,185,129,0.1)', 
            padding: '3px 8px', 
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          {source}
        </span>
      </div>
      <div className="recommendations-grid">
        {articles.map((item) => (
          <div 
            key={item.id} 
            className="glass-panel" 
            style={{ 
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              minHeight: '160px',
              transition: 'var(--transition-smooth)'
            }}
            onClick={() => navigate(`/articles/${item.id}`)}
          >
            <div>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  color: 'var(--text-muted)', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}
              >
                {item.category} • {item.readTime}
              </span>
              <h4 
                style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.3', 
                  fontFamily: 'Outfit, sans-serif',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}
              >
                {item.title}
              </h4>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
              By {item.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
