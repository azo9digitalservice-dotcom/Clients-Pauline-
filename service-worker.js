const CACHE_VERSION = 'tantie-pauline-v3'; // ⚠️ à incrémenter à CHAQUE déploiement
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const STATIC_ASSETS = [
  './css/style.css',
  './js/preloader.js',
  './js/components.js',
  './js/api.js',
  './js/produits.js',
  './js/produit.js',
  './manifest.json',
  './assets/logo/logo-pauline.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return cacheName.startsWith('tantie-pauline-') &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DATA_CACHE;
            })
            .map(function (cacheName) {
              return caches.delete(cacheName);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // Pages HTML : toujours le réseau en premier, jamais de version figée
  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(networkFirst_(request, STATIC_CACHE));
    return;
  }

  // GAS Public : toujours le réseau en premier
  if (url.hostname === 'script.google.com' && url.pathname.indexOf('/macros/s/') !== -1) {
    event.respondWith(networkFirst_(request, DATA_CACHE));
    return;
  }

  // Fichiers statiques (CSS, JS, images) : cache d'abord
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst_(request));
    return;
  }
});

function cacheFirst_(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      if (response && response.ok && response.type === 'basic') {
        return caches.open(STATIC_CACHE).then(function (cache) {
          cache.put(request, response.clone());
          return response;
        });
      }
      return response;
    });
  });
}

function networkFirst_(request, cacheName) {
  return fetch(request)
    .then(function (response) {
      if (response && response.ok) {
        return caches.open(cacheName).then(function (cache) {
          cache.put(request, response.clone());
          return response;
        });
      }
      return caches.match(request);
    })
    .catch(function () {
      return caches.match(request);
    });
}