import React, { useState, Suspense } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { TrendingArticlesSidebar } from '../components/TrendingArticlesSidebar';
import { ArchiveSkeleton } from '../components/Skeletons';

// Lazily load the Archive component
const Archive = React.lazy(() => import('../components/Archive'));

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 300);

  const handleClearSearch = () => {
    setInputValue('');
  };

  return (
    <div className="home-layout">
      {/* Main Stream Area */}
      <div>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            The Chronicle Archive
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Search historical reporting, interviews, and deep-dives from Veridian's award-winning journalists.
          </p>
        </div>

        {/* Global Content Search */}
        <section className="search-container" aria-label="Archive search filter">
          <input
            type="text"
            className="search-input"
            placeholder="Search articles by title, content, or tag (e.g. tech, politics, finance)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Search articles by title, content, or tag"
          />
          <span className="search-icon" aria-hidden="true">🔍</span>
          {inputValue && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search input content"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </section>

        {/* Lazy Archive List */}
        <Suspense fallback={<ArchiveSkeleton count={6} />}>
          <Archive searchVal={debouncedSearch} />
        </Suspense>
      </div>

      {/* Sidebar Area */}
      <div>
        <TrendingArticlesSidebar />
        
        {/* Additional helpful information block */}
        <div 
          className="glass-panel" 
          style={{ 
            marginTop: '24px', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.85rem' 
          }}
        >
          <h4 style={{ fontFamily: 'Outfit, sans-serif', color: '#10b981', marginBottom: '8px' }}>
            Subscriber Edition
          </h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            You are currently viewing the Q3 Veridian Digital release. Ad block and high-performance modules are auto-optimized.
          </p>
        </div>
      </div>
    </div>
  );
}
