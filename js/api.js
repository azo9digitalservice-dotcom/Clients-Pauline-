/**
 * Couche unique d'accès au GAS Public (lecture seule du Catalogue).
 * Toutes les pages du site public passent par ici — aucun fetch()
 * direct ailleurs dans produits.js / produit.js.
 *
 * Ajout :
 * - cache local du catalogue ;
 * - affichage rapide des données déjà récupérées ;
 * - actualisation silencieuse en arrière-plan ;
 * - secours en cas d'indisponibilité du GAS.
 */
(function () {

  var GAS_PUBLIC_URL = 'https://script.google.com/macros/s/AKfycbxJ_t4uQ2f0x4D-jy5L9oHtA8m9VnjQebLY4s_8gQpSiQJSZ5dD4M-witLu0x2fOB2GNg/exec';

  var PRODUCTS_CACHE_KEY = 'tante_pauline_products_cache';
  var PRODUCT_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 heures

  function callGasPublic_(route, extraParams) {
    var url = new URL(GAS_PUBLIC_URL);
    url.searchParams.set('route', route);

    if (extraParams) {
      Object.keys(extraParams).forEach(function (key) {
        url.searchParams.set(key, extraParams[key]);
      });
    }

    return fetch(url.toString())
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        if (!json.success) {
          var err = new Error(
            (json.error && json.error.message) || 'Erreur inconnue.'
          );
          err.code = json.error && json.error.code;
          throw err;
        }

        return json.data;
      });
  }


  function normalizeProduct_(p) {
    var photos = (p.photos && p.photos.length)
      ? p.photos.slice()
      : [];

    if (p.photoPrincipale && photos.indexOf(p.photoPrincipale) === -1) {
      photos.unshift(p.photoPrincipale);
    }

    return {
      id: p.id,
      nom: p.nom,
      prix: p.prix,
      categorie: p.categorie,
      disponibilite: p.disponibilite,
      description: p.description || '',
      descriptionCourte: '',
      imagePrincipale: p.photoPrincipale || (photos[0] || ''),
      photos: photos
    };
  }


  function saveProductsCache_(products) {
    try {
      localStorage.setItem(
        PRODUCTS_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: products
        })
      );
    } catch (e) {
      console.warn('[PublicAPI] Cache impossible :', e);
    }
  }


  function getProductsCache_() {
    try {
      var cached = localStorage.getItem(PRODUCTS_CACHE_KEY);

      if (!cached) {
        return null;
      }

      var parsed = JSON.parse(cached);

      return {
        valid: (Date.now() - parsed.timestamp) < PRODUCT_CACHE_DURATION,
        data: parsed.data || []
      };

    } catch (e) {
      return null;
    }
  }


  function fetchProducts_() {
    return callGasPublic_('produits')
      .then(function (data) {

        var products = (data.products || [])
          .map(normalizeProduct_);

        saveProductsCache_(products);

        return products;
      });
  }


  window.PublicAPI = {

    loadProducts: function () {

      var cache = getProductsCache_();

      if (cache && cache.data.length) {

        // Mise à jour silencieuse
        fetchProducts_()
          .catch(function (err) {
            console.warn(
              '[PublicAPI] Actualisation arrière-plan échouée',
              err
            );
          });

        return Promise.resolve(cache.data);
      }


      return fetchProducts_();
    },


    loadProductById: function (id) {

      return callGasPublic_('produit', { id: id })
        .then(function (data) {
          return normalizeProduct_(data.product);
        });

    }

  };

})();
