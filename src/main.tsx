import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Service worker: registered only when actually served over http(s). Opening the shared
 * single-file build straight from WhatsApp gives us a file:// origin, where SW and
 * IndexedDB are blocked — so everything in that mode is memory/session-only and the code
 * must simply not crash. That is the whole offline-sharing story in one guard.
 */
if ('serviceWorker' in navigator) {
  const here = window.location.protocol;
  if (here === 'https:' || here === 'http:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(new URL('sw.js', window.location.href).href)
        .catch(() => {
          /* no install, app still works exactly the same */
        });
    });
  }
}
