var CACHE_NAME = 'my-app-cache';
var urlsToCache = [
  /*
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  */
];

self.addEventListener('install', function(event) {
  // Les étapes d'installation sont normalement utilisées pour mettre en cache les ressources
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // La réponse du cache est retournée si une correspondance est trouvée
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
