import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useScrollDepthAndAnalytics } from '../hooks/useScrollDepthAndAnalytics';
import { RecommendedSkeleton } from '../components/Skeletons';

// Lazily load dynamic components
const AdPlacement = React.lazy(() => import('../components/AdPlacement'));
const RecommendedArticles = React.lazy(() => import('../components/RecommendedArticles'));

export default function ArticleDetail() {
  const { articleId = '1' } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(localStorage.getItem('veridian_has_history') === 'true');
  
  // Real-time analytics debugger state for UI validation
  const [analyticsLogs, setAnalyticsLogs] = useState([]);

  // Intersection Observer target for recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  const recommendationsRef = useRef(null);

  // Activate scroll depth and page time analytics tracking
  useScrollDepthAndAnalytics(articleId, 'user123');

  // Fetch article content and comments
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setShowRecommendations(false); // Reset observer state
      try {
        const articleRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${articleId}`);
        const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${articleId}`);

        if (articleRes.ok && commentsRes.ok) {
          const articleData = await articleRes.json();
          const commentsData = await commentsRes.json();

          setArticle(articleData);
          setComments(commentsData.slice(0, 3)); // show first 3 comments
        }
      } catch (err) {
        console.error('[ArticleDetail] Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  // Handle local analytics event visualizer
  useEffect(() => {
    const handleAnalyticsEvent = (e) => {
      const newEvents = e.detail;
      setAnalyticsLogs((prev) => [...newEvents, ...prev].slice(0, 5));
    };

    window.addEventListener('veridian_analytics_event', handleAnalyticsEvent);
    return () => window.removeEventListener('veridian_analytics_event', handleAnalyticsEvent);
  }, []);

  // Intersection Observer to load Recommendations when visible in viewport
  useEffect(() => {
    if (loading || !article) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('[ArticleDetail] Recommendations element scrolled into viewport! Loading module...');
          setShowRecommendations(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        root: null, // relative to document viewport
        rootMargin: '50px', // Load slightly before it gets fully in view
        threshold: 0.1,
      }
    );

    const currentRef = recommendationsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, article]);

  // Toggle reading history simulation
  const handleToggleHistory = () => {
    const newState = !hasHistory;
    localStorage.setItem('veridian_has_history', String(newState));
    setHasHistory(newState);
    // Reload recommendations if they are already visible
    if (showRecommendations) {
      setShowRecommendations(false);
      setTimeout(() => setShowRecommendations(true), 100);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 0' }}>
        <div className="shimmer" style={{ width: '100%', height: '350px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
        <div className="shimmer" style={{ width: '60%', height: '32px', borderRadius: '4px', marginBottom: '16px' }} />
        <div className="shimmer" style={{ width: '100%', height: '18px', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="shimmer" style={{ width: '90%', height: '18px', borderRadius: '4px', marginBottom: '8px' }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Article Not Found</h2>
        <p>Return to <Link to="/" style={{ color: 'var(--accent-primary)' }}>home page</Link>.</p>
      </div>
    );
  }

  // Split single text block into multiple descriptive paragraphs for ad injection layout
  const baseText = article.body;
  const paragraphs = [
    `Veridian Chronicle Investigative Unit — ${baseText.charAt(0).toUpperCase() + baseText.slice(1)}. The ramifications of these actions will be felt throughout the digital publishing ecosystem for quarters to come. Analysts predict significant shifts in market distribution.`,
    'In secondary coverage, industry leaders emphasize that strategic resource allocations must align with both operational efficiency and engineering bandwidth. Initial audits suggest legacy frameworks contributed to substantial latency overhead.',
    `Furthermore, experts emphasize that user retention remains the principal metric. "Without rapid content delivery pipelines, digital engagement numbers will naturally decay," warned Dr. Aris Thorne. Our primary data supports this hypothesis directly.`,
    'This brings us to the operational questions surrounding scalability. As databases grow, queries must be optimized, indices created, and search filtering operations cached or memoized. Debouncing user inputs remains a critical design pattern.',
    'In conclusion, addressing performance deficits is not merely a technical task, but a vital business requirement. Q3 revenue projections rely on minimizing layout shifts and maximizing ad viewability benchmarks across both desktop and mobile viewports.'
  ];

  // Map author names based on ID
  const authorNames = ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova'];
  const authorName = authorNames[article.id % authorNames.length];
  const authorId = (article.id % authorNames.length) + 1;

  return (
    <div className="article-detail-container">
      {/* Article Header & Hero */}
      <header className="article-hero">
        <img 
          src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&q=80`} 
          alt="" 
          className="article-hero-image"
          width="800"
          height="400"
        />
        <div className="article-hero-overlay">
          <span 
            style={{ 
              alignSelf: 'start', 
              background: '#10b981', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}
          >
            EXCLUSIVE REPORT
          </span>
          <h1 className="article-title-lg">{article.title}</h1>
          <div className="article-meta-row">
            <span>By <Link to={`/author/${authorId}`} className="article-meta-author-link">{authorName}</Link></span>
            <span>•</span>
            <span>June 25, 2026</span>
          </div>
        </div>
      </header>

      {/* Control Panel: Simulation Toggle */}
      <section 
        className="glass-panel" 
        style={{ 
          padding: '16px 20px', 
          marginBottom: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.85rem'
        }}
        aria-label="Simulation controls"
      >
        <span style={{ color: 'var(--text-secondary)' }}>
          Reading History: <strong>{hasHistory ? 'Enabled (Sarah\'s Profile)' : 'Empty / Disabled'}</strong>
        </span>
        <button 
          onClick={handleToggleHistory}
          aria-label="Toggle user reading history simulation state"
          style={{ 
            background: hasHistory ? '#10b981' : '#3b82f6', 
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Toggle Reading History
        </button>
      </section>

      {/* Article Body Content */}
      <div className="article-body">
        {paragraphs.slice(0, 3).map((p, idx) => (
          <p key={idx} className="article-paragraph">{p}</p>
        ))}

        {/* Ad Placement 1: After 3rd paragraph of content */}
        <Suspense fallback={<div className="ad-wrapper shimmer" style={{ height: '90px', margin: '16px auto' }} aria-hidden="true">ADVERTISEMENT LOADING...</div>}>
          <AdPlacement type="inline" />
        </Suspense>

        {paragraphs.slice(3).map((p, idx) => (
          <p key={idx + 3} className="article-paragraph">{p}</p>
        ))}
      </div>

      {/* Ad Placement 2: At the bottom of page, before the comments section */}
      <Suspense fallback={<div className="ad-wrapper shimmer" style={{ height: '90px', margin: '32px auto' }} aria-hidden="true">ADVERTISEMENT LOADING...</div>}>
        <AdPlacement type="banner" />
      </Suspense>

      {/* Recommended For You Section: Loaded via Intersection Observer */}
      <div 
        ref={recommendationsRef} 
        style={{ 
          marginTop: '40px', 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '32px',
          minHeight: '200px' // Spatial reservation to minimize CLS
        }}
      >
        {showRecommendations ? (
          <Suspense fallback={<RecommendedSkeleton />}>
            <RecommendedArticles articleId={articleId} />
          </Suspense>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ↓ Scroll further down to load recommendations...
          </div>
        )}
      </div>

      {/* Comments Section */}
      <section className="comments-section" aria-label="Comments section">
        <h3 className="comments-title">Discussion ({comments.length})</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none' }}>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-card glass-panel">
                <div className="comment-header">
                  <span className="comment-author">{comment.email}</span>
                  <span className="comment-date">2 hours ago</span>
                </div>
                <p className="comment-text">"{comment.body}"</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Back to Archive Link */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--accent-primary)', 
            textDecoration: 'none', 
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Chronicle Archive
        </Link>
      </div>

      {/* Live Analytics Dashboard Indicator for verification */}
      {analyticsLogs.length > 0 && (
        <div className="analytics-badge" aria-live="polite">
          Analytics Out: {analyticsLogs[0].event}
        </div>
      )}
    </div>
  );
}
