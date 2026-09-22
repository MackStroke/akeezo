import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function getVisitorId() {
  let id = localStorage.getItem('akeezo_visitor_id');
  if (!id) {
    id = generateId();
    localStorage.setItem('akeezo_visitor_id', id);
  }
  return id;
}

export function trackEvent(type, path, section = '', details = {}) {
  // Don't track admin routes
  if (path.startsWith('/admin')) return;

  const visitorId = getVisitorId();

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      type,
      path,
      section,
      details
    }),
  }).catch(() => {
    // Ignore errors to prevent noisy console if blocked by adblockers
  });
}

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page views automatically on route change
    trackEvent('page_view', location.pathname);
  }, [location.pathname]);

  return null;
}
