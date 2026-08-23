/**
 * Service Worker minimal — sert UNIQUEMENT à satisfaire les critères
 * d'installabilité de Chrome (manifest + service worker enregistré).
 * Il ne met RIEN en cache et n'intercepte aucune requête : chaque
 * page continue de venir intégralement du réseau, exactement comme
 * un site classique. Aucun risque de contenu figé ou obsolète.
 */

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Volontairement vide : ne répond à aucune requête lui-même.
self.addEventListener('fetch', function () {});