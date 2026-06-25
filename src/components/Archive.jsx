import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from './ArticleCard';
import { ArchiveSkeleton } from './Skeletons';

// Asynchronously load the AdPlacement component
const AdPlacement = React.lazy(() => import('./AdPlacement'));

export default function Archive({ searchVal = '' }) {
  const [articlesData, setArticlesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch article data on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (response.ok) {
          const data = await response.json();
          setArticlesData(data);
        }
      } catch (err) {
        console.error('[Archive] Failed to fetch articles:', err);
      } finally {
        // Leave a slight delay so the user can enjoy the custom shimmer skeletons
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchArticles();
  }, []);

  // Stabilize the navigation callback using useCallback
  const handleArticleClick = useCallback((articleId, articleTitle) => {
    console.log(`[Analytics] article_view event triggered for ID: ${articleId}`);
    
    // Log article_view event to JSONPlaceholder mock comments
    fetch('https://jsonplaceholder.typicode.com/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'article_view',
        articleId,
        articleTitle,
        userId: 'user123',
        timestamp: new Date().toISOString()
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log('[Analytics] Event logged successfully:', result);
      })
      .catch(err => {
        console.error('[Analytics] Failed to log event:', err);
      });

    // Navigate to details page
    navigate(`/articles/${articleId}`);
  }, [navigate]);

  // Wrap the core search filtering algorithm in useMemo
  const filteredArticles = useMemo(() => {
    if (!searchVal.trim()) return articlesData;
    const query = searchVal.toLowerCase();
    
    const tags = ['tech', 'politics', 'finance', 'life', 'science', 'opinion'];
    
    return articlesData.filter((article) => {
      const tag = tags[article.id % tags.length];
      const matchTitle = article.title.toLowerCase().includes(query);
      const matchBody = article.body.toLowerCase().includes(query);
      const matchTag = tag.toLowerCase().includes(query);
      return matchTitle || matchBody || matchTag;
    });
  }, [searchVal, articlesData]);

  if (loading) {
    return <ArchiveSkeleton count={8} />;
  }

  return (
    <div>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing {filteredArticles.length} archive entries
        </span>
        {searchVal && (
          <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
            Filtered by: "{searchVal}"
          </span>
        )}
      </div>

      {filteredArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No articles match your search criteria.
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map((article, index) => {
            const authorNames = ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova'];
            const authorName = authorNames[article.id % authorNames.length];
            const authorId = (article.id % authorNames.length) + 1;

            return (
              <React.Fragment key={article.id}>
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  body={article.body}
                  userId="user123"
                  author={authorName}
                  authorId={authorId}
                  onClick={handleArticleClick}
                />
                
                {/* Dynamic Ad Injection: Injected after every 10th card */}
                {(index + 1) % 10 === 0 && (
                  <Suspense fallback={<div className="ad-wrapper shimmer">ADVERTISEMENT</div>}>
                    <AdPlacement type="banner" />
                  </Suspense>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
