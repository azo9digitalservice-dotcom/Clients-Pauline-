/**
 * Couche unique d'accès au GAS Public (lecture seule du Catalogue).
 * Toutes les pages du site public passent par ici — aucun fetch()
 * direct ailleurs dans produits.js / produit.js.
 */
(function () {

  var GAS_PUBLIC_URL = 'https://script.google.com/macros/s/AKfycbxJ_t4uQ2f0x4D-jy5L9oHtA8m9VnjQebLY4s_8gQpSiQJSZ5dD4M-witLu0x2fOB2GNg/exec';

  function callGasPublic_(route, extraParams) {
    var url = new URL(GAS_PUBLIC_URL);
    url.searchParams.set('route', route);
    if (extraParams) {
      Object.keys(extraParams).forEach(function (key) {
        url.searchParams.set(key, extraParams[key]);
      });
    }

    return fetch(url.toString())
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) {
          var err = new Error((json.error && json.error.message) || 'Erreur inconnue.');
          err.code = json.error && json.error.code;
          throw err;
        }
        return json.data;
      });
  }

  /**
   * Normalise les champs renvoyés par le GAS Public vers les noms déjà
   * utilisés par produits.js / produit.js (imagePrincipale, photos non vide).
   */
  function normalizeProduct_(p) {
    var photos = (p.photos && p.photos.length) ? p.photos.slice() : [];
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
      descriptionCourte: '', // non fourni par le Catalogue, laissé vide volontairement
      imagePrincipale: p.photoPrincipale || (photos[0] || ''),
      photos: photos
    };
  }

  window.PublicAPI = {
    loadProducts: function () {
      return callGasPublic_('produits').then(function (data) {
        return (data.products || []).map(normalizeProduct_);
      });
    },

    loadProductById: function (id) {
      return callGasPublic_('produit', { id: id }).then(function (data) {
        return normalizeProduct_(data.product);
      });
    }
  };

})();