
(function () {

  /**
   * DONNÉES TEMPORAIRES — PLACEHOLDERS ADMIN
   * Système séparé des données du site public (GAS Administration ≠ GAS Public).
   * Seront remplacées par les vraies données une fois le GAS Administration branché.
   */
  var ADMIN_PLACEHOLDER_PRODUCTS = [
    { id: 'SAC-001', nom: 'Sac à main Pauline', prix: 25000, categorie: 'sacs', disponibilite: 'disponible', visible: true, photos: ['../assets/produits/produit-01.jpg'], description: '' },
    { id: 'SAC-002', nom: 'Sac cabas tissé', prix: 20000, categorie: 'sacs', disponibilite: 'peu_de_stock', visible: true, photos: ['../assets/produits/produit-02.jpg'], description: '' },
    { id: 'CHA-001', nom: 'Escarpins bleu nuit', prix: 18000, categorie: 'chaussures', disponibilite: 'disponible', visible: true, photos: ['../assets/produits/produit-04.jpg'], description: '' },
    { id: 'CHA-002', nom: 'Sandales tressées', prix: 12000, categorie: 'chaussures', disponibilite: 'rupture', visible: false, photos: ['../assets/produits/produit-01.jpg'], description: '' }
  ];

  var STATUS_LABELS = { disponible: 'Disponible', peu_de_stock: 'Peu de stock', rupture: 'Rupture' };
  var CATEGORY_LABELS = { sacs: 'Sacs', chaussures: 'Chaussures' };

  function formatPrice(prix) {
    return Number(prix).toLocaleString('fr-FR') + ' FCFA';
  }

  /* ===================== NAVIGATION ADMIN (centralisée ici) ===================== */

  function renderAdminNav() {
    var mount = document.getElementById('admin-nav');
    if (!mount) return;

    var current = location.pathname.split('/').pop() || 'index.html';

    mount.innerHTML =
      '<nav class="admin-nav">' +
        '<div class="admin-nav-container">' +
          '<a href="index.html" class="admin-nav-brand">' +
            '<img src="../assets/logo/logo-pauline.png" alt="Chez Tantie Pauline" class="admin-nav-logo" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
            '<svg class="admin-nav-logo-fallback" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="29" fill="#163a5c"/><text x="30" y="37" font-family="Cormorant Garamond, serif" font-style="italic" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">TP</text></svg>' +
            '<span class="admin-nav-brand-text">Administration</span>' +
          '</a>' +
          '<div class="admin-nav-links">' +
            '<a href="index.html" class="admin-nav-link' + (current === 'index.html' ? ' active' : '') + '">Dashboard</a>' +
            '<a href="produits.html" class="admin-nav-link' + (current === 'produits.html' ? ' active' : '') + '">Produits</a>' +
            '<a href="produit.html" class="admin-nav-link' + (current === 'produit.html' ? ' active' : '') + '">Ajouter un produit</a>' +
            '<a href="../index.html" class="admin-nav-public-link" target="_blank" rel="noopener">Voir le site public &rarr;</a>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  /* ===================== PAGE : CONNEXION ===================== */

  function initLoginPage() {
    var form = document.getElementById('adminLoginForm');
    if (!form) return;

    var submitBtn = document.getElementById('adminLoginSubmit');
    var label = submitBtn.querySelector('.admin-btn-label');
    var spinner = submitBtn.querySelector('.admin-btn-spinner');
    var errorZone = document.getElementById('adminLoginError');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      errorZone.hidden = true;
      submitBtn.disabled = true;
      label.textContent = 'Connexion...';
      spinner.hidden = false;

      // Pas d'authentification réelle à cette étape — sera branchée au GAS Administration.
      setTimeout(function () {
        submitBtn.disabled = false;
        label.textContent = 'Se connecter';
        spinner.hidden = true;
        errorZone.textContent = 'L\'authentification n\'est pas encore activée. Elle sera branchée au GAS Administration.';
        errorZone.hidden = false;
      }, 700);
    });
  }

  /* ===================== PAGE : DASHBOARD ===================== */

  function initDashboardPage() {
    var statsGrid = document.getElementById('adminStatsGrid');
    if (!statsGrid) return;

    var total = ADMIN_PLACEHOLDER_PRODUCTS.length;
    var disponible = ADMIN_PLACEHOLDER_PRODUCTS.filter(function (p) { return p.disponibilite === 'disponible'; }).length;
    var peuDeStock = ADMIN_PLACEHOLDER_PRODUCTS.filter(function (p) { return p.disponibilite === 'peu_de_stock'; }).length;
    var rupture = ADMIN_PLACEHOLDER_PRODUCTS.filter(function (p) { return p.disponibilite === 'rupture'; }).length;

    var stats = [
      { label: 'Produits', value: total },
      { label: 'Disponibles', value: disponible },
      { label: 'Peu de stock', value: peuDeStock },
      { label: 'Rupture', value: rupture }
    ];

    statsGrid.innerHTML = '';
    stats.forEach(function (stat) {
      var card = document.createElement('div');
      card.className = 'admin-stat-card';
      var value = document.createElement('p');
      value.className = 'admin-stat-value';
      value.textContent = stat.value;
      var label = document.createElement('p');
      label.className = 'admin-stat-label';
      label.textContent = stat.label;
      card.appendChild(value);
      card.appendChild(label);
      statsGrid.appendChild(card);
    });
  }

  /* ===================== PAGE : MES PRODUITS ===================== */

  function initProductsListPage() {
    var list = document.getElementById('adminProductsList');
    if (!list) return;

    var emptyState = document.getElementById('adminProductsEmpty');
    var searchInput = document.getElementById('adminSearchInput');
    var filterButtons = document.querySelectorAll('.admin-filters-container .filter-pill');

    var currentFilter = 'tous';
    var currentSearch = '';

    function matchesFilter(produit) {
      if (currentFilter === 'tous') return true;
      if (['sacs', 'chaussures'].indexOf(currentFilter) !== -1) return produit.categorie === currentFilter;
      return produit.disponibilite === currentFilter;
    }

    function matchesSearch(produit) {
      if (!currentSearch) return true;
      return produit.nom.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1;
    }

    function render() {
      var filtered = ADMIN_PLACEHOLDER_PRODUCTS.filter(function (p) {
        return matchesFilter(p) && matchesSearch(p);
      });

      list.innerHTML = '';

      if (!filtered.length) {
        list.hidden = true;
        emptyState.hidden = false;
        return;
      }

      list.hidden = false;
      emptyState.hidden = true;

      filtered.forEach(function (produit) {
        var card = document.createElement('div');
        card.className = 'admin-product-card' + (produit.visible ? '' : ' is-masque');

        var thumb = document.createElement('div');
        thumb.className = 'admin-product-thumb';
        var img = document.createElement('img');
        img.src = produit.photos[0] || '';
        img.alt = produit.nom;
        thumb.appendChild(img);

        var info = document.createElement('div');
        info.className = 'admin-product-main-info';
        info.innerHTML =
          '<p class="admin-product-name"></p>' +
          '<p class="admin-product-meta"></p>' +
          '<p class="admin-product-price"></p>';
        info.querySelector('.admin-product-name').textContent = produit.nom;
        info.querySelector('.admin-product-meta').textContent =
          CATEGORY_LABELS[produit.categorie] + ' · ' + STATUS_LABELS[produit.disponibilite] + (produit.visible ? '' : ' · Masqué');
        info.querySelector('.admin-product-price').textContent = formatPrice(produit.prix);

        var actions = document.createElement('div');
        actions.className = 'admin-product-actions';

        var editLink = document.createElement('a');
        editLink.className = 'btn-mini btn-mini-primary';
        editLink.href = 'produit.html?id=' + encodeURIComponent(produit.id);
        editLink.textContent = 'Modifier';

        var toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn-mini btn-mini-secondary';
        toggleBtn.textContent = produit.visible ? 'Masquer' : 'Publier';
        toggleBtn.addEventListener('click', function () {
          produit.visible = !produit.visible;
          render();
        });

        var deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-mini btn-mini-danger';
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', function () {
          if (!window.confirm('Supprimer « ' + produit.nom + ' » ? Cette action est temporaire (données locales uniquement).')) return;
          var index = ADMIN_PLACEHOLDER_PRODUCTS.indexOf(produit);
          if (index !== -1) ADMIN_PLACEHOLDER_PRODUCTS.splice(index, 1);
          render();
        });

        actions.appendChild(editLink);
        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(thumb);
        card.appendChild(info);
        card.appendChild(actions);
        list.appendChild(card);
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        render();
      });
    });

    searchInput.addEventListener('input', function () {
      currentSearch = searchInput.value;
      render();
    });

    render();
  }

  /* ===================== PAGE : AJOUTER / MODIFIER UN PRODUIT ===================== */

  function initProductFormPage() {
    var form = document.getElementById('adminProductForm');
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    var editId = params.get('id');
    var existingProduct = editId ? ADMIN_PLACEHOLDER_PRODUCTS.filter(function (p) { return p.id === editId; })[0] : null;

    var photos = existingProduct ? existingProduct.photos.slice() : [];

    var titleEl = document.getElementById('adminProductFormTitle');
    var submitBtn = document.getElementById('adminProductSubmit');
    var feedback = document.getElementById('adminFormFeedback');
    var thumbsContainer = document.getElementById('photoThumbs');
    var photoInput = document.getElementById('photoInput');

    if (existingProduct) {
      titleEl.textContent = 'Modifier « ' + existingProduct.nom + ' »';
      submitBtn.textContent = 'Enregistrer les modifications';
      document.getElementById('productNom').value = existingProduct.nom;
      document.getElementById('productCategorie').value = existingProduct.categorie;
      document.getElementById('productPrix').value = existingProduct.prix;
      document.getElementById('productDisponibilite').value = existingProduct.disponibilite;
      document.getElementById('productDescription').value = existingProduct.description || '';
    }

    function renderThumbs() {
      thumbsContainer.innerHTML = '';
      photos.forEach(function (src, index) {
        var thumb = document.createElement('div');
        thumb.className = 'photo-thumb';

        var img = document.createElement('img');
        img.src = src;
        img.alt = '';

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'photo-thumb-remove';
        removeBtn.setAttribute('aria-label', 'Supprimer cette photo');
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function () {
          photos.splice(index, 1);
          renderThumbs();
        });

        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        thumbsContainer.appendChild(thumb);
      });
    }

    photoInput.addEventListener('change', function () {
      var file = photoInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        photos.push(e.target.result);
        renderThumbs();
      };
      reader.readAsDataURL(file);
      photoInput.value = '';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Pas d'enregistrement réel à cette étape — sera branché au GAS Administration.
      feedback.hidden = false;
      feedback.textContent = existingProduct
        ? 'Les modifications seront enregistrées une fois le GAS Administration branché.'
        : 'Le produit sera publié une fois le GAS Administration branché.';
    });

    renderThumbs();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAdminNav();
    initLoginPage();
    initDashboardPage();
    initProductsListPage();
    initProductFormPage();
  });

})();