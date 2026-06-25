import React, { useState, useEffect } from 'react';

export default function AdPlacement({ type = 'banner' }) {
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos/1');
        if (response.ok) {
          const data = await response.json();
          // Add a customized premium advertisement description
          setAdData({
            imageUrl: data.url,
            title: 'Veridian Pro - Unlock Full Access to Q3 Insights',
            link: 'https://veridianchronicle.com/pro',
          });
        }
      } catch (err) {
        console.error('[Ads] Failed to load ad content:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add a slight artificial delay (800ms) to demo the async load and Suspense fallback
    const timer = setTimeout(() => {
      fetchAd();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Determine container styling based on ad placement context
  const slotClass = type === 'inline' ? 'ad-slot-inline' : 'ad-slot-archive';

  return (
    <div className={slotClass}>
      <div className="ad-wrapper">
        {loading || !adData ? (
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            ADVERTISEMENT
          </div>
        ) : (
          <a 
            href={adData.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ width: '100%', height: '100%', display: 'block', position: 'relative' }}
          >
            {/* Standard banner layout with ad background */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%), url(${adData.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 20px',
              }}
            >
              <div 
                style={{ 
                  textAlign: 'center', 
                  color: '#fff', 
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{adData.title}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.9, letterSpacing: '0.05em' }}>SPONSORED BY VERIDIAN PARTNERS</div>
              </div>
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '4px', 
                  right: '8px', 
                  fontSize: '0.55rem', 
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}
              >
                Ad
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
