"use strict";

var urlsToCache = [
  '/',
  'static/css/main.48cd5d13.css',
  'static/js/main.d2530f48.js'
];

var staticCacheName = 'headlines-static-v3';
var articleImgsCache = 'headlines-content-imgs';

var allCaches = [
  staticCacheName,
  articleImgsCache
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('headlines-') &&
            !allCaches.includes(cacheName);
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.endsWith('.jpg') || requestUrl.pathname.endsWith('.png')) {
    var storageUrl = event.request.url;
    event.respondWith(
      caches.open(articleImgsCache).then(function (cache) {
        return cache.match(storageUrl).then(function (response) {
          if (response) return response;

          return fetch(event.request).then(function (serverResponse) {
            cache.put(storageUrl, serverResponse.clone());
            return serverResponse;
          })
        })
      })
    )
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  )
})