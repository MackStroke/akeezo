import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { buildStructuredData } from './lib/structuredData.js';
import './styles/index.css';

/**
 * JSON-LD is injected once at boot rather than rendered into the tree: React
 * would otherwise re-serialise a large static object on every render, and the
 * graph is derived from the same content constants the page renders, so it
 * cannot drift out of sync.
 *
 * Crawlers execute JS and will see this. If organic search becomes a priority,
 * the right fix is to prerender or SSR the page (see docs/PHASES.md) rather
 * than to move the markup around.
 */
function injectStructuredData() {
  const id = 'akeezo-jsonld';
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(buildStructuredData());
  document.head.appendChild(script);
}

injectStructuredData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
