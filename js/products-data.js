/**
 * DONNÉES TEMPORAIRES — PLACEHOLDERS
 * Source UNIQUE des produits pour produits.html ET produit.html.
 * Ce ne sont PAS les vrais produits de Tantie Pauline.
 * Seront remplacées plus tard par les données de Google Sheets via GAS
 * (fournies par api.js), sans changer la structure des objets ci-dessous.
 */
window.PLACEHOLDER_PRODUCTS = [
  {
    id: 'SAC-001',
    nom: 'Sac à main Pauline',
    prix: 25000,
    categorie: 'sacs',
    disponibilite: 'disponible',
    imagePrincipale: 'assets/produits/produit-01.jpg',
    photos: [
      'assets/produits/produit-01.jpg',
      'assets/produits/produit-02.jpg',
      'assets/produits/produit-03.jpg'
    ],
    descriptionCourte: 'Un modèle élégant et pratique, pensé pour accompagner vos journées.',
    description: 'Un sac pensé pour allier praticité et élégance au quotidien.\n\nSon format compact permet de l\'emporter facilement, tout en offrant suffisamment d\'espace pour l\'essentiel.\n\nCeci est une description temporaire, à remplacer par le vrai texte de Tantie Pauline.'
  },
  {
    id: 'SAC-002',
    nom: 'Sac cabas tissé',
    prix: 20000,
    categorie: 'sacs',
    disponibilite: 'peu_de_stock',
    imagePrincipale: 'assets/produits/produit-02.jpg',
    photos: [
      'assets/produits/produit-02.jpg',
      'assets/produits/produit-04.jpg'
    ],
    descriptionCourte: 'Un cabas spacieux et coloré, idéal pour vos sorties de la semaine.',
    description: 'Description temporaire : ce cabas tissé combine style et grande capacité.\n\nÀ remplacer par la vraie description de Tantie Pauline.'
  },
  {
    id: 'SAC-003',
    nom: 'Pochette de soirée',
    prix: 15000,
    categorie: 'sacs',
    disponibilite: 'disponible',
    imagePrincipale: 'assets/produits/produit-03.jpg',
    photos: [
      'assets/produits/produit-03.jpg'
    ],
    descriptionCourte: 'Une pochette raffinée pour vos occasions spéciales.',
    description: 'Description temporaire pour la pochette de soirée.\n\nÀ remplacer plus tard.'
  },
  {
    id: 'CHA-001',
    nom: 'Escarpins bleu nuit',
    prix: 18000,
    categorie: 'chaussures',
    disponibilite: 'disponible',
    imagePrincipale: 'assets/produits/produit-04.jpg',
    photos: [
      'assets/produits/produit-04.jpg',
      'assets/produits/produit-01.jpg'
    ],
    descriptionCourte: 'Des escarpins élégants pour apporter une touche raffinée à votre tenue.',
    description: 'Description temporaire pour les escarpins bleu nuit.\n\nÀ remplacer par le vrai texte.'
  },
  {
    id: 'CHA-002',
    nom: 'Sandales tressées',
    prix: 12000,
    categorie: 'chaussures',
    disponibilite: 'rupture',
    imagePrincipale: 'assets/produits/produit-01.jpg',
    photos: [
      'assets/produits/produit-01.jpg'
    ],
    descriptionCourte: 'Des sandales légères et confortables pour la saison chaude.',
    description: 'Description temporaire pour les sandales tressées.\n\nActuellement en rupture, disponible à nouveau prochainement.'
  },
  {
    id: 'CHA-003',
    nom: 'Mocassins élégants',
    prix: 22000,
    categorie: 'chaussures',
    disponibilite: 'disponible',
    imagePrincipale: 'assets/produits/produit-02.jpg',
    photos: [
      'assets/produits/produit-02.jpg',
      'assets/produits/produit-03.jpg',
      'assets/produits/produit-04.jpg'
    ],
    descriptionCourte: 'Des mocassins polyvalents, parfaits pour un usage quotidien.',
    description: 'Description temporaire pour les mocassins élégants.\n\nÀ remplacer par le vrai texte de Tantie Pauline.'
  }
];