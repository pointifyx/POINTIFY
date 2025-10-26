const CACHE_NAME = 'pointify-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './signup.html', 
  './app.html',
  './agent.html',
  './admin.html',
  './manifest.json',
  '../src/css/style.css',
  '../src/js/main.js',
  '../src/js/auth.js',
  '../src/js/db.js',
  '../src/js/pos.js',
  '../src/js/agent.js',
  '../src/js/admin.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});