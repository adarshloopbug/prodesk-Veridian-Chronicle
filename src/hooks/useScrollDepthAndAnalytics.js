import { useEffect, useRef } from 'react';

/**
 * Custom hook to monitor scroll depth and time spent on article pages,
 * batching and debouncing analytics dispatches to the server.
 * 
 * @param {string} articleId - The current article ID.
 * @param {string} userId - The user ID from global context.
 */
export function useScrollDepthAndAnalytics(articleId, userId = 'user123') {
  const eventQueue = useRef([]);
  const dispatchTimeout = useRef(null);
  const sentScrollMilestones = useRef(new Set());
  const sentTimeMilestones = useRef(new Set());

  // Helper to queue events and trigger debounced dispatch
  const queueEvent = (eventName) => {
    // Prevent duplicates in the current session for this article
    if (eventName.startsWith('scroll_depth_')) {
      const milestone = parseInt(eventName.split('_')[2], 10);
      if (sentScrollMilestones.current.has(milestone)) return;
      sentScrollMilestones.current.add(milestone);
    }
    if (eventName.startsWith('time_on_page_')) {
      const sec = eventName.split('_')[3];
      if (sentTimeMilestones.current.has(sec)) return;
      sentTimeMilestones.current.add(sec);
    }

    eventQueue.current.push({
      event: eventName,
      articleId,
      userId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Analytics] Queued: ${eventName} for Article ${articleId}`);

    // Debounce batch dispatch by 1000ms
    if (dispatchTimeout.current) {
      clearTimeout(dispatchTimeout.current);
    }

    dispatchTimeout.current = setTimeout(() => {
      dispatchBatch();
    }, 1000);
  };

  const dispatchBatch = async () => {
    if (eventQueue.current.length === 0) return;

    const batch = [...eventQueue.current];
    eventQueue.current = [];
    dispatchTimeout.current = null;

    console.log(`[Analytics] Dispatching batch of ${batch.length} event(s)...`);

    try {
      // Simulate POST request
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: batch,
          batchTimestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log('[Analytics] Batch upload successful:', batch);
        // Trigger a custom event for local visual feedback
        window.dispatchEvent(new CustomEvent('veridian_analytics_event', {
          detail: batch
        }));
      }
    } catch (error) {
      console.error('[Analytics] Failed to dispatch events:', error);
    }
  };

  useEffect(() => {
    // Reset milestones when articleId changes
    sentScrollMilestones.current.clear();
    sentTimeMilestones.current.clear();
    eventQueue.current = [];
    if (dispatchTimeout.current) {
      clearTimeout(dispatchTimeout.current);
    }

    // Scroll listener
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPct >= milestone) {
          queueEvent(`scroll_depth_${milestone}`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Time on page thresholds
    const timer30 = setTimeout(() => {
      queueEvent('time_on_page_30s');
    }, 30000);

    const timer60 = setTimeout(() => {
      queueEvent('time_on_page_60s');
    }, 60000);

    // Fast-testing simulated logs (fires also at 5s/10s for interactive proof)
    const testTimer5 = setTimeout(() => {
      queueEvent('time_on_page_5s_demo');
    }, 5000);

    const testTimer10 = setTimeout(() => {
      queueEvent('time_on_page_10s_demo');
    }, 10000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer30);
      clearTimeout(timer60);
      clearTimeout(testTimer5);
      clearTimeout(testTimer10);
      if (dispatchTimeout.current) {
        clearTimeout(dispatchTimeout.current);
      }
      // Dispatch any remaining events on unmount
      if (eventQueue.current.length > 0) {
        dispatchBatch();
      }
    };
  }, [articleId, userId]);
}
