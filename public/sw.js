"use strict";

var urlsToCache = [
  '/',
  'static/css/main.css',
  'static/js/bundle.js'
];

var staticCacheName = 'headlines-static-v1';
var articleImgsCache = 'headlines-content-imgs';

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
            ((cacheName != staticCacheName) || (cacheName != articleImgsCache));
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
    var storageUrl = request.url;
    event.respondWith(
      caches.open(articleImgsCache).then(function(cache) {
        return cache.match(storageUrl).then(function(response) {
          if (response) return response;

          return fetch(event.request).then(function(serverResponse) {
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