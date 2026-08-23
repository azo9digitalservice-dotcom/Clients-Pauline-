const CACHE_VERSION = 'tantie-pauline-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './produits.html',
  './produit.html',

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

/**
 * INSTALLATION
 * Les ressources essentielles sont préparées pour une utilisation
 * rapide et partiellement hors ligne.
 */
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

/**
 * ACTIVATION
 * Supprime uniquement les anciennes versions de nos caches.
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return (
                cacheName.startsWith('tantie-pauline-') &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DATA_CACHE
              );
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

/**
 * REQUÊTES
 *
 * 1. Ressources statiques :
 *    cache d'abord pour une boutique rapide.
 *
 * 2. GAS Public :
 *    réseau d'abord afin de récupérer les données fraîches.
 *    Si le réseau échoue, utilisation de la dernière réponse connue.
 *
 * 3. Autres requêtes :
 *    comportement réseau normal.
 */
self.addEventListener('fetch', function (event) {
  var request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  var url = new URL(request.url);

  /*
   * GAS Public
   */
  if (
    url.hostname === 'script.google.com' &&
    url.pathname.indexOf('/macros/s/') !== -1
  ) {
    event.respondWith(networkFirstData_(request));
    return;
  }

  /*
   * Ressources du site
   */
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstStatic_(request));
    return;
  }
});

/**
 * CACHE FIRST
 *
 * Utilisé pour les fichiers statiques :
 * CSS, JS, HTML, logo, icônes, etc.
 */
function cacheFirstStatic_(request) {
  return caches.match(request)
    .then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(function (networkResponse) {
          if (
            networkResponse &&
            networkResponse.ok &&
            networkResponse.type === 'basic'
          ) {
            return caches.open(STATIC_CACHE)
              .then(function (cache) {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
          }

          return networkResponse;
        });
    });
}

/**
 * NETWORK FIRST
 *
 * Pour le GAS :
 * - on tente d'abord d'obtenir les données actuelles ;
 * - si ça fonctionne, on conserve une copie ;
 * - si le réseau échoue, on utilise la dernière copie disponible.
 */
function networkFirstData_(request) {
  return fetch(request)
    .then(function (networkResponse) {
      if (
        networkResponse &&
        networkResponse.ok
      ) {
        return caches.open(DATA_CACHE)
          .then(function (cache) {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
      }

      return getCachedData_(request);
    })
    .catch(function () {
      return getCachedData_(request);
    });
}

/**
 * Retourne la dernière réponse GAS disponible localement.
 */
function getCachedData_(request) {
  return caches.match(request)
    .then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'OFFLINE',
            message: 'La connexion Internet est indisponible.'
          }
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });
}