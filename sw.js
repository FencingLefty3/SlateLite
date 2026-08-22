const CACHE_NAME = 'slatelite-cache-v2';
const APP_SHELL = [
  './index.html',
  './index.css',
  './manifest.json',
  './index.js',
  './database.js',
  './js/dexie.min.js',
  './icons/square-pen.png',
  './icons/arrow-up.svg',
  './icons/180.png',
  './icons/256.png',
  './icons/trash.svg',
  './icons/square-pen.svg',
  './icons/search.svg',
  './icons/funnel.svg',
  './icons/database-arrow-down.svg',
  './icons/tags/all.svg',
  './icons/tags/info.svg',
  './icons/tags/star.svg',
  './icons/tags/tally-2.svg',
  './icons/tags/tally-3.svg',
  './icons/tags/tally-4.svg'
];

self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET' || !['http:', 'https:'].includes(new URL(event.request.url).protocol)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (cachedResponse) {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});

