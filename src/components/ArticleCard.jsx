import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

function ArticleCardComponent({ id, title, body, userId, author, authorId, onClick }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  // Extract a brief summary of the article body
  const excerpt = body 
    ? (body.length > 100 ? body.substring(0, 97) + '...' : body)
    : 'No summary available.';

  // Simulate a tag based on the article's id or title length
  const tags = ['Tech', 'Politics', 'Finance', 'Life', 'Science', 'Opinion'];
  const tag = tags[id % tags.length];

  // Pick a mock image from a pool of premium news photos to avoid placeholders
  // Sized and formatted to WebP to eliminate image delivery blockages
  const images = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=350&q=75', // Newspaper
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=350&q=75', // Tech/Globe (Preloaded LCP)
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=350&q=75', // Finance/Bldg
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=350&q=75', // Journalism
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=350&q=75', // Cyber/Code
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=350&q=75'  // Laptop
  ];
  const imageSrc = images[id % images.length];

  const handleCardClick = (e) => {
    // If the click is on the author link, don't trigger article click
    if (e.target.closest('.article-card-author')) {
      return;
    }
    if (onClick) {
      onClick(id, title);
    }
  };

  return (
    <article 
      className="article-card glass-panel" 
      onClick={handleCardClick}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (onClick) onClick(id, title);
        }
      }}
      aria-label={`Article: ${title} by ${author}`}
    >
      {/* Set loading="lazy" on images that are likely below the fold to boost performance */}
      <img 
        src={imageSrc} 
        alt="" 
        className="article-card-image"
        loading="lazy" 
        width="400"
        height="180"
      />
      <div className="article-card-body">
        <span className="article-card-tag">{tag}</span>
        <h3 className="article-card-title">{title}</h3>
        <p className="article-card-excerpt">{excerpt}</p>
        
        <div className="article-card-meta">
          <span>
            By{' '}
            <Link 
              to={`/author/${authorId}`} 
              className="article-card-author"
              aria-label={`View author profile of ${author}`}
            >
              {author}
            </Link>
          </span>
          <span style={{ fontSize: '0.65rem', color: '#10b981' }}>Renders: {renderCount.current}</span>
        </div>
      </div>
    </article>
  );
}

// Wrap in React.memo() to prevent re-renders when parent's state changes
export const ArticleCard = React.memo(ArticleCardComponent);
