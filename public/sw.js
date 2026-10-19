/*
 * Coach Kit service worker.
 *
 * Purpose: the app must still open on a pitch with no signal, and after the phone has
 * been restarted. Strategy is *network-first with cache fallback* on purpose:
 *  - when there is signal, the coach always gets the current version (no stale app shells);
 *  - when there is no signal, or the site is down, the last thing they saw is served.
 * A cache-first shell would be marginally faster and could strand a coach on an old
 * version, which in a tool people trust with their training session is the worse trade.
 */
const CACHE = 'coachkit-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.svg', './apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'warm-cache' && self.registration) {
    event.waitUntil(
      caches.open(CACHE).then((cache) => Promise.allSettled(SHELL.map((u) => cache.add(u))))
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  // Never touch anything off-origin. This app makes no third-party calls by design.
  if (url.origin !== self.location.origin) return;
  // Don't intercept the dev server's HMR websocket-ish endpoints or file downloads.
  if (url.pathname.includes('/@') || url.pathname.startsWith('/node_modules/')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        })
      )
  );
});
