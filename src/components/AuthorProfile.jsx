import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleCard } from './ArticleCard';
import { AuthorProfileSkeleton } from './Skeletons';

export default function AuthorProfile() {
  const { authorId = '1' } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [publications, setPublications] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Fetch posts to filter publications
        const postsRes = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await postsRes.json();
        
        // Fetch user data from jsonplaceholder to map profile info
        const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${authorId}`);
        const userData = await userRes.json();

        // Custom bios and avatars
        const bios = {
          1: 'Sarah Jenkins is a Senior Investigative Journalist at Veridian Chronicle, specializing in tech policy, privacy legislation, and cybersecurity trends globally. Formerly an editor at Wired.',
          2: 'Marcus Vance is an award-winning Financial Columnist. He covers global macroeconomic trends, fiscal policies, and corporate governance for Veridian Chronicle, with a focus on fintech and decentralized finance.',
          3: 'Elena Rostova is a Foreign Correspondent and Investigative Journalist covering human rights, health policy, and environmental crises. She has reported from over fifteen countries.'
        };

        const roles = {
          1: 'Technology Editor & Columnist',
          2: 'Chief Financial Correspondent',
          3: 'International Relations Reporter'
        };

        const avatars = {
          1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
          2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
          3: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80'
        };

        setAuthor({
          id: authorId,
          name: userData.name || `Journalist #${authorId}`,
          role: roles[authorId] || 'Contributing Writer',
          bio: bios[authorId] || 'Journalist for Veridian Chronicle covering global breaking news.',
          avatar: avatars[authorId] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
          twitter: `@${userData.username?.toLowerCase() || 'veridian'}`,
          linkedin: userData.website || 'linkedin.com/veridian',
          email: userData.email || 'contact@veridian.com'
        });

        // Filter publications: simulate that posts belong to different authors
        const filteredPosts = posts.filter(post => (post.id % 3) + 1 === Number(authorId));
        setPublications(filteredPosts);
      } catch (err) {
        console.error('[AuthorProfile] Failed to fetch author:', err);
      } finally {
        // Delay to allow shimmer to show
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  // Stable callback for clicking articles
  const handleArticleClick = useCallback((articleId) => {
    navigate(`/articles/${articleId}`);
  }, [navigate]);

  // Memoized search filtering for the author's publications
  const filteredPublications = useMemo(() => {
    if (!searchVal.trim()) return publications;
    const query = searchVal.toLowerCase();
    
    return publications.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.body.toLowerCase().includes(query)
    );
  }, [searchVal, publications]);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 0' }} aria-hidden="true">
        <AuthorProfileSkeleton />
      </div>
    );
  }

  if (!author) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Author Not Found</h2>
        <p>We could not retrieve the details for this journalist.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Author Bio Card */}
      <section className="author-profile-card glass-panel" aria-label={`Journalist Bio: ${author.name}`}>
        <img 
          src={author.avatar} 
          alt={author.name} 
          className="author-avatar"
          width="120"
          height="120"
        />
        <h2 className="author-name">{author.name}</h2>
        <div className="author-role">{author.role}</div>
        <p className="author-bio">{author.bio}</p>
        
        <div className="author-socials">
          <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer" className="author-social-btn" aria-label={`Follow ${author.name} on Twitter`}>
            Twitter ({author.twitter})
          </a>
          <a href={`https://${author.linkedin}`} target="_blank" rel="noopener noreferrer" className="author-social-btn" aria-label={`Visit ${author.name}'s Website`}>
            Website
          </a>
          <a href={`mailto:${author.email}`} className="author-social-btn" aria-label={`Email ${author.name}`}>
            Email
          </a>
        </div>
      </section>

      {/* Publications Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0 20px 0' }}>
        <h3 className="author-publications-title" style={{ margin: 0 }}>
          Publications ({filteredPublications.length})
        </h3>
        
        {/* Search within author publications */}
        <div style={{ width: '260px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search publications..."
            className="search-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            aria-label="Search journalist publications"
            style={{ 
              padding: '10px 12px 10px 32px', 
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-sm)'
            }}
          />
          <span 
            className="search-icon" 
            aria-hidden="true"
            style={{ 
              left: '12px', 
              fontSize: '0.95rem' 
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {filteredPublications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          No publications match your search filter.
        </div>
      ) : (
        <section aria-label="Journalist publication cards grid">
          <ul className="articles-grid" style={{ listStyle: 'none' }}>
            {filteredPublications.map(post => (
              <li key={post.id}>
                <ArticleCard
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  userId="user123"
                  author={author.name}
                  authorId={author.id}
                  onClick={handleArticleClick}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
