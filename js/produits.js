(function () {

  /**
   * DONNÉES TEMPORAIRES — PLACEHOLDERS
   * Ce ne sont PAS les vrais produits de Tantie Pauline.
   * Seront remplacées par les données de Google Sheets via GAS
   * (fournies par api.js) dans une étape ultérieure.
   */
  var PLACEHOLDER_PRODUCTS = [
    { id: 'SAC-001', nom: 'Sac à main Pauline', prix: 25000, categorie: 'sacs', disponibilite: 'disponible', imagePrincipale: 'assets/produits/produit-01.jpg' },
    { id: 'SAC-002', nom: 'Sac cabas tissé', prix: 20000, categorie: 'sacs', disponibilite: 'peu_de_stock', imagePrincipale: 'assets/produits/produit-02.jpg' },
    { id: 'SAC-003', nom: 'Pochette de soirée', prix: 15000, categorie: 'sacs', disponibilite: 'disponible', imagePrincipale: 'assets/produits/produit-03.jpg' },
    { id: 'CHA-001', nom: 'Escarpins bleu nuit', prix: 18000, categorie: 'chaussures', disponibilite: 'disponible', imagePrincipale: 'assets/produits/produit-04.jpg' },
    { id: 'CHA-002', nom: 'Sandales tressées', prix: 12000, categorie: 'chaussures', disponibilite: 'rupture', imagePrincipale: 'assets/produits/produit-01.jpg' },
    { id: 'CHA-003', nom: 'Mocassins élégants', prix: 22000, categorie: 'chaussures', disponibilite: 'disponible', imagePrincipale: 'assets/produits/produit-02.jpg' }
  ];

  var STATUS_LABELS = {
    disponible: 'Disponible',
    peu_de_stock: 'Peu de stock',
    rupture: 'Rupture'
  };

  var grid = document.getElementById('productsGrid');
  var emptyState = document.getElementById('productsEmptyState');
  var errorState = document.getElementById('productsErrorState');
  var retryButton = document.getElementById('retryButton');
  var filterButtons = document.querySelectorAll('.filter-pill');

  var allProducts = [];
  var currentFilter = 'tous';

  function formatPrice(prix) {
    return prix.toLocaleString('fr-FR') + ' FCFA';
  }

  function renderSkeletons(count) {
    grid.hidden = false;
    emptyState.hidden = true;
    errorState.hidden = true;
    grid.classList.remove('prod-grid-visible');
    grid.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var skeleton = document.createElement('div');
      skeleton.className = 'prod-skeleton';
      grid.appendChild(skeleton);
    }
  }

  function renderProducts(products) {
    grid.innerHTML = '';

    if (!products.length) {
      grid.hidden = true;
      emptyState.hidden = false;
      errorState.hidden = true;
      return;
    }

    grid.hidden = false;
    emptyState.hidden = true;
    errorState.hidden = true;

    products.forEach(function (produit) {
      var card = document.createElement('a');
      card.className = 'prod-card';
      card.href = 'produit.html?id=' + encodeURIComponent(produit.id);
      if (produit.disponibilite === 'rupture') {
        card.classList.add('prod-card-out');
      }

      card.innerHTML =
        '<div class="prod-img-box">' +
          '<img src="' + produit.imagePrincipale + '" alt="' + produit.nom + '" loading="lazy">' +
        '</div>' +
        '<div class="prod-info">' +
          '<span class="prod-badge prod-badge-' + produit.disponibilite + '">' +
            '<span class="prod-badge-dot"></span>' + STATUS_LABELS[produit.disponibilite] +
          '</span>' +
          '<h3 class="prod-name">' + produit.nom + '</h3>' +
          '<p class="prod-price">' + formatPrice(produit.prix) + '</p>' +
        '</div>';

      grid.appendChild(card);
    });

    requestAnimationFrame(function () {
      grid.classList.add('prod-grid-visible');
    });
  }

  function applyFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    var filtered = filter === 'tous'
      ? allProducts
      : allProducts.filter(function (p) { return p.categorie === filter; });

    renderProducts(filtered);
  }

  function showError() {
    grid.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = false;
  }

  /**
   * Charge les produits. Pour l'instant : résout avec les données
   * temporaires ci-dessus après un court délai simulant un chargement réseau.
   * À REMPLACER plus tard par un appel réel via api.js une fois GAS branché,
   * en gardant la même signature (retourne une Promise d'un tableau de produits).
   */
  function loadProducts() {
    renderSkeletons(6);
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(PLACEHOLDER_PRODUCTS);
      }, 500);
    });
  }

  function init() {
    loadProducts()
      .then(function (products) {
        allProducts = products;
        applyFilter(currentFilter);
      })
      .catch(function (err) {
        console.error('[produits.js]', err);
        showError();
      });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.dataset.filter);
    });
  });

  if (retryButton) {
    retryButton.addEventListener('click', init);
  }

  document.addEventListener('DOMContentLoaded', init);

})();