import React from 'react';

/**
 * Single card skeleton placeholder.
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card glass-panel">
      <div className="skeleton-image shimmer" />
      <div className="skeleton-tag shimmer" />
      <div className="skeleton-title shimmer" />
      <div className="skeleton-text shimmer" />
      <div className="skeleton-text shimmer" />
      <div className="skeleton-text-short shimmer" />
      <div className="skeleton-footer">
        <div className="skeleton-footer-left shimmer" />
        <div className="skeleton-footer-right shimmer" />
      </div>
    </div>
  );
}

/**
 * Grid of card skeletons for the Archive.
 */
export function ArchiveSkeleton({ count = 6 }) {
  return (
    <div className="articles-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for the Author/Journalist Profile page.
 */
export function AuthorProfileSkeleton() {
  return (
    <div className="skeleton-profile-container glass-panel">
      <div className="skeleton-avatar shimmer" />
      <div className="skeleton-name shimmer" />
      <div className="skeleton-tag shimmer" style={{ width: '120px' }} />
      <div className="skeleton-bio-line shimmer" />
      <div className="skeleton-bio-line shimmer" />
      <div className="skeleton-bio-line-short shimmer" />
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <div className="skeleton-tag shimmer" style={{ width: '80px', height: '32px' }} />
        <div className="skeleton-tag shimmer" style={{ width: '80px', height: '32px' }} />
      </div>
    </div>
  );
}

/**
 * Horizontal row of card skeletons for the Recommended articles module.
 */
export function RecommendedSkeleton({ count = 3 }) {
  return (
    <div className="recommendations-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="skeleton-card glass-panel" 
          style={{ height: '300px' }}
        >
          <div className="skeleton-image shimmer" style={{ height: '120px' }} />
          <div className="skeleton-title shimmer" style={{ height: '20px' }} />
          <div className="skeleton-text shimmer" style={{ height: '12px' }} />
          <div className="skeleton-text-short shimmer" style={{ height: '12px' }} />
        </div>
      ))}
    </div>
  );
}
