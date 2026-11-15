/* PIXTION · service worker — offline support (generated). */
const CACHE = 'pixtion-6d477f0452';
const CORE = [
 "./",
 "./assets/fonts/space-mono-latin-400-normal.woff2",
 "./assets/fonts/space-mono-latin-700-normal.woff2",
 "./assets/fonts/work-sans-latin-400-normal.woff2",
 "./assets/fonts/work-sans-latin-500-normal.woff2",
 "./assets/fonts/work-sans-latin-600-normal.woff2",
 "./assets/fonts/work-sans-latin-700-normal.woff2",
 "./assets/fonts/work-sans-latin-800-normal.woff2",
 "./assets/icons/apple-touch-icon.png",
 "./assets/icons/favicon-32.png",
 "./assets/icons/icon-192.png",
 "./assets/icons/icon-512.png",
 "./index.html",
 "./js/97590a1a24cc.js",
 "./js/aa3fb22c3407.js",
 "./site.webmanifest"
];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('pixtion-') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); return r; }).catch(() => caches.match('./'))); return; }
  e.respondWith(caches.match(req).then(h => h || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
});
