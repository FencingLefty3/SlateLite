self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
    caches.open('slatelite-cache-v1').then(function(cache) {
  cache.addAll([
    //general
    './',
    './index.html',
    './index.css',
    //'./write',
    //'./list',
    './manifest.json',
    //js
    './index.js',
    './database.js',
    './js/dexie.min.js',
    //icons
    './icons/square-pen.png',
    './icons/180.png',
    './icons/256.png',
    //--'./icons/512.png',--
    './icons/trash.svg',
    './icons/square-pen.svg',
    './icons/search.svg',
    './icons/funnel.svg', //not in use
    './icons/database-arrow-down.svg', //not in use
  ]);
});

});

