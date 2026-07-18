self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Network passthrough for now — Metro serves content-hashed bundles in dev,
// so caching them here would risk serving stale JS. A fetch handler is kept
// so Chrome/Android will still consider the app installable.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
