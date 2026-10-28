// ═══════════════════════════════════════════════
// ReWaste BSF — Application Data
// ═══════════════════════════════════════════════

export const CONTACT = {
  cyrille: {
    name: 'Cyrille',
    phone: '+225 07 04 76 31 32',
    phoneClean: '2250704763132',
    email: 'hi.cyril@gmail.com',
  },
  emile: {
    name: 'Kouessi Émile Hognikou',
    phone: '+225 01 03 36 79 93',
    phoneClean: '2250103367993',
    email: 'puissancedamour@yahoo.fr',
  },
  address: 'Le Vallon, Cocody 2 Plateaux, rue des Jardins (en face pharmacie Saint-Gilles), Abidjan, Côte d\'Ivoire',
  socials: {
    tiktok: 'https://www.tiktok.com/@plantzilla4',
    youtube: 'https://www.youtube.com/@KouessiÉmileHognikou',
    facebook: 'https://www.facebook.com/profile.php?id=61574938571935',
  },
};

export const WAVE_BASE_URL = 'https://pay.wave.com/m/M_ci_hsvjN_ywTw2K/c/ci/?amount=';

export const FORMATIONS = [
  {
    id: 'initiation',
    level: 1,
    title: 'Initiation BSF',
    subtitle: 'Les fondamentaux',
    duration: '1 jour',
    price: 50000,
    priceFCFA: '50 000 FCFA',
    badge: 'Découverte',
    color: 'leaf',
    features: [
      'Biologie de Hermetia illucens',
      'Visite de la pépinière centrale',
      'Démonstration des 3 unités de production',
      'Introduction au cycle de bioconversion',
      'Support de cours PDF offert',
    ],
    maxParticipants: 12,
    icon: '🌱',
  },
  {
    id: 'pratique',
    level: 2,
    title: 'Formation Pratique',
    subtitle: 'Maîtrise technique',
    duration: '3 jours',
    price: 150000,
    priceFCFA: '150 000 FCFA',
    badge: 'Populaire',
    color: 'emerald',
    features: [
      'Ingénierie du cycle de vie complet',
      'Incubation, alimentation, récolte',
      'Construction de Love Cages & Larveros',
      'Techniques de séchage micro-ondes (Pop-larvae)',
      'Contrôle qualité (BCR, taux de survie)',
      'Accès groupe WhatsApp réservé',
      'Kit de manipulations fourni',
    ],
    maxParticipants: 12,
    popular: true,
    icon: '🔬',
  },
  {
    id: 'business',
    level: 3,
    title: 'Formation Business',
    subtitle: 'Création d\'entreprise BSF',
    duration: '5 jours',
    price: 350000,
    priceFCFA: '350 000 FCFA',
    badge: 'Premium',
    color: 'amber',
    features: [
      'Tout le contenu de la Formation Pratique',
      'Gestion technico-économique complète',
      'Conception de projet d\'entreprise sur mesure',
      'Dimensionnement de votre unité (BSF Calculator)',
      'Étude de marché locale personnalisée',
      'Modèle financier NPV & Payback sur 5 ans',
      'Accompagnement post-formation (1 mois)',
      'Accès groupe d\'affaires exclusif',
    ],
    maxParticipants: 12,
    icon: '🚀',
  },
];

export const PRODUCTS = [
  // ── INTRANTS BIOLOGIQUES ──
  {
    id: '5dol-10k',
    category: 'Intrants Biologiques',
    name: 'Doses Larves 5-DOL (10 000 pcs)',
    description: 'Larves âgées de 5 jours, calibrées et prêtes à l\'engraissement immédiat en bac.',
    price: 15000,
    priceFCFA: '15 000 FCFA',
    unit: 'dose 10k',
    icon: '🐛',
    popular: true,
  },
  {
    id: '5dol-50k',
    category: 'Intrants Biologiques',
    name: 'Lot Éleveur 5-DOL (50 000 pcs)',
    description: 'Conditionnement spécial fermes satellites. Rendement garanti avec protocole ReWaste.',
    price: 65000,
    priceFCFA: '65 000 FCFA',
    unit: 'lot 50k',
    icon: '📦',
    highlight: true,
  },
  {
    id: 'oeufs-10g',
    category: 'Intrants Biologiques',
    name: 'Grammes d\'Œufs BSF Calibrés (10g)',
    description: 'Œufs frais de ponte certifiés (~400 000 larves potentielles) avec gélose nutritive.',
    price: 25000,
    priceFCFA: '25 000 FCFA',
    unit: 'tube 10g',
    icon: '🥚',
  },
  {
    id: 'prepupes-geniteurs',
    category: 'Intrants Biologiques',
    name: 'Pré-pupes Géniteurs Sélectionnés (1 kg)',
    description: 'Géniteurs à cuticule noire vigoureux pour peuplement direct de vos Love Cages.',
    price: 12000,
    priceFCFA: '12 000 FCFA',
    unit: 'kg',
    icon: '✨',
  },

  // ── ÉQUIPEMENTS & MATÉRIEL ──
  {
    id: 'pondoirs-lot',
    category: 'Équipements & Nurserie',
    name: 'Pondoirs Rainurés Bois ReWaste (Lot de 5)',
    description: 'Rainures calibrées 1.5mm idéales pour l\'oviposition avec séparateurs inox.',
    price: 8000,
    priceFCFA: '8 000 FCFA',
    unit: 'lot de 5',
    icon: '🪵',
  },
  {
    id: 'love-cage-pro',
    category: 'Équipements & Nurserie',
    name: 'Love Cage Modulaire 1m³',
    description: 'Cage de reproduction avec moustiquaire micro-maille, manchons étanches et crochets.',
    price: 145000,
    priceFCFA: '145 000 FCFA',
    unit: 'cage 1m³',
    icon: '🏠',
  },
  {
    id: 'kit-demarrage-complet',
    category: 'Équipements & Nurserie',
    name: 'Kit Démarrage Éleveur Satellite',
    description: '5 bacs Larveros + 2 Love Cages + 10 pondoirs + 50k 5-DOL + Manuel pratique ReWaste.',
    price: 250000,
    priceFCFA: '250 000 FCFA',
    unit: 'kit complet',
    icon: '🛠️',
    popular: true,
  },

  // ── BIOPRODUITS & ENGRAIS ──
  {
    id: 'pop-larvae',
    category: 'Bioproduits & Nutrition',
    name: 'Pop-Larvae Croustillantes ReWaste (1 kg)',
    description: 'Séchées par micro-ondes sous vide. 42% protéines, 35% lipides, couleur jaune or.',
    price: 4500,
    priceFCFA: '4 500 FCFA',
    unit: 'sachet 1 kg',
    icon: '🍿',
    highlight: true,
  },
  {
    id: 'farine-bsf-degraisse',
    category: 'Bioproduits & Nutrition',
    name: 'Farine BSF Dégraissée Haute Densité (5 kg)',
    description: '55-65% protéines digestibles. Remplacement direct farine de poisson en pisciculture.',
    price: 22000,
    priceFCFA: '22 000 FCFA',
    unit: 'sac 5 kg',
    icon: '🌾',
  },
  {
    id: 'frass-25',
    category: 'Bioproduits & Nutrition',
    name: 'Frass Bio Tamisé ReWaste (Sac 25 kg)',
    description: 'Amendement organique NPK 3-2-2 enrichi en chitine. Stimule l\'immunité des cultures.',
    price: 6000,
    priceFCFA: '6 000 FCFA',
    unit: 'sac 25 kg',
    icon: '🌱',
  },
  {
    id: 'huile-bsf',
    category: 'Bioproduits & Nutrition',
    name: 'Huile Brute BSF Extraite à Froid (1 Litre)',
    description: 'Concentrée à 45% en acide laurique antibactérien. Savonnerie & provenderie d\'élite.',
    price: 7500,
    priceFCFA: '7 500 FCFA',
    unit: 'bouteille 1L',
    icon: '💧',
  },
];

export const IMPACT_STATS = [
  { value: 80, suffix: '%', label: 'Réduction des déchets', icon: '♻️' },
  { value: 65, suffix: '%', label: 'Protéines dans la farine BSF', icon: '💪' },
  { value: 50, suffix: '%', label: 'Économie sur l\'alimentation animale', icon: '📉' },
  { value: 12, suffix: 'j', label: 'Cycle complet de bioconversion', icon: '🔄' },
];

export const CURATED_PLAYLISTS = [
  {
    id: 'pl-rewaste',
    title: 'Formation & Tutoriels ReWaste BSF Côte d\'Ivoire',
    author: 'Kouessi Émile Hognikou',
    videoCount: '18 vidéos',
    badge: 'Chaîne Officielle',
    icon: '🇨🇮',
    description: 'Le parcours technique complet filmé sur notre pépinière de Cocody : accouplement en Love Cage, préparation des bacs d\'engraissement et séchage des larves.',
    url: 'https://www.youtube.com/playlist?list=PL_REWASTE_OFFICIAL_TUTOS'
  },
  {
    id: 'pl-eawag',
    title: 'Eawag / Sandec — Industrial Black Soldier Fly Processing',
    author: 'Institut Fédéral Suisse des Sciences Aquatiques',
    videoCount: '12 vidéos',
    badge: 'Recherche Internationale',
    icon: '🇨🇭',
    description: 'La référence scientifique mondiale sur l\'ingénierie des installations BSF, la gestion des substrats complexes et les bilans massiques.',
    url: 'https://www.youtube.com/playlist?list=PL_EAWAG_BSF_PROCESSING'
  },
  {
    id: 'pl-lowtech',
    title: 'Low-Tech Lab & Élevage Modulaire d\'Insectes',
    author: 'Low-Tech Lab',
    videoCount: '8 vidéos',
    badge: 'Open-Source & Éco-Conception',
    icon: '🛠️',
    description: 'Plans de serres bioclimatiques, fabrication artisanale de pondoirs et séchoirs solaires optimisés pour les climats tropicaux d\'Afrique de l\'Ouest.',
    url: 'https://www.youtube.com/playlist?list=PL_LOWTECH_BSF_DESIGNS'
  },
  {
    id: 'pl-feedback',
    title: 'Retours d\'Expériences Éleveurs : Volailles & Tilapias',
    author: 'Communauté Éleveurs ReWaste',
    videoCount: '6 vidéos',
    badge: 'Terrain & Rentabilité',
    icon: '🐔',
    description: 'Témoignages concrets d\'aviculteurs et pisciculteurs ivoiriens ayant réduit leur facture d\'aliment de 40% à 60% avec les larves BSF vivantes et séchées.',
    url: 'https://www.youtube.com/playlist?list=PL_FARMERS_BSF_FEEDBACK'
  }
];

export const YOUTUBE_VIDEOS = [
  { id: 'HcfFoinWcs4', title: 'Stade mouche & Chambre nuptiale', category: 'Biologie' },
  { id: 'UR8mIbQtRak', title: 'Stade œuf & Dispositifs de ponte', category: 'Biologie' },
  { id: 'aQPfbSP0jx8', title: 'Stade éclosion & Gestion néonates', category: 'Biologie' },
  { id: 'TXTTnEwsdgQ', title: 'Stade nurserie & Calibrage 5-DOL', category: 'Biologie' },
  { id: 'oAk9TNGgsSU', title: 'Stade pré-pupe & Auto-récolte', category: 'Biologie' },
  { id: 'YYGlTbRpxpY', title: 'Stade pupaison en milieu obscur', category: 'Biologie' },
  { id: 'JQPfbGSUFWk', title: 'Pré-traitement & Broyage substrat', category: 'Opérations' },
  { id: '9xG_MXkjhWM', title: 'Traitement & Densité larvaire', category: 'Opérations' },
  { id: 'TwbBENbPs18', title: 'Récolte & Tamisage séparateur', category: 'Opérations' },
  { id: 'RwGQzUkSbdQ', title: 'Suivi et contrôle qualité (BCR)', category: 'Opérations' },
  { id: 'A1CnpJDVL5Q', title: 'Séchage micro-ondes (Pop-Larvae)', category: 'Post-traitement' },
  { id: 'mjei68FHLb8', title: 'Torréfaction (1) - Torréfacteur à café', category: 'Post-traitement' },
  { id: 'hPM_e0H7CdI', title: 'Torréfaction (2) - Four à gaz', category: 'Post-traitement' },
  { id: '4CvlmePGIQs', title: 'Séchage au four ventilé', category: 'Post-traitement' },
  { id: '1Nn0W-FWgME', title: 'Broyage et extraction farine', category: 'Post-traitement' },
  { id: 'c9VAffBMCP0', title: 'Fractionnement et pressage huile', category: 'Post-traitement' },
];

export const RESOURCES = [
  { title: 'Guide complet d\'élevage BSF (PDF FR)', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/publikationen/SWM/BSF/bsf_biowaste_processing_FR.pdf', icon: '📕' },
  { title: 'Manuel complet et annexes', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/Manual_and_Annexes.pdf', icon: '📘' },
  { title: 'Technical Drawings (ZIP)', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/publikationen/SWM/BSF/Technical_Drawings.zip', icon: '📐' },
  { title: 'Guide des opérations quotidiennes', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/masterfile_a.docx', icon: '📋' },
  { title: 'Tableur de suivi des données', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/masterfile_b.xlsx', icon: '📊' },
  { title: 'Fiche alimentation poissons-chats', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_catfish.pdf', icon: '🐟' },
  { title: 'Fiche alimentation poulets', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_chicken.pdf', icon: '🐔' },
  { title: 'Fiche fractionnement des larves', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/bsf_factsheet_fractioning.pdf', icon: '🔬' },
  { title: 'Fiche fabrication de savon', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factssheet_soap.pdf', icon: '🧼' },
  { title: 'Rapport d\'évaluation du marché BSF', url: 'https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/market_assessment_report_bsf.pdf', icon: '📈' },
];

export const GLOSSARY_TERMS = [
  { term: 'BSF (Mouche Soldat Noire)', definition: 'Hermetia illucens, insecte de la famille des Stratiomyidae utilisé pour le biotraitement des déchets organiques.' },
  { term: 'Larvero', definition: 'Container spécialement conçu pour l\'élevage des larves de BSF.' },
  { term: '5-DOL', definition: 'Larves de 5 jours (5-Day Old Larvae), stade de développement optimal pour le transfert vers les unités d\'engraissement.' },
  { term: 'Pré-pupe', definition: 'Stade du développement de la BSF précédant la pupaison, caractérisé par un assombrissement de la cuticule.' },
  { term: 'Frass', definition: 'Résidu de digestion comprenant les excréments des larves et le substrat non consommé. Excellent amendement organique.' },
  { term: 'BCR (Bioconversion Rate)', definition: 'Taux de conversion de biomasse. Mesure d\'efficacité indiquant la quantité de biomasse larvaire produite par rapport aux déchets traités.' },
  { term: 'Love Cage', definition: 'Cage de reproduction pour les mouches adultes BSF, optimisée avec un spectre lumineux spécifique (bleu 440 nm / vert 540 nm).' },
  { term: 'Pop-Larvae', definition: 'Larves séchées par micro-ondes. Texture soufflée, couleur jaune pâle distinctive. Haute valeur marchande pour le pet food.' },
  { term: 'Oviposition', definition: 'Action de ponte des œufs par la femelle BSF, généralement dans des interstices proches d\'un substrat nourricier.' },
  { term: 'Chambre nuptiale', definition: 'Espace conçu pour favoriser l\'accouplement des mouches adultes, avec des conditions de lumière et de température optimales.' },
  { term: 'Diapause', definition: 'Période d\'arrêt temporaire du développement, rare chez la BSF mais possible dans des conditions défavorables.' },
  { term: 'Bioconversion', definition: 'Processus de transformation des déchets organiques en biomasse larvaire et en résidu de digestion.' },
  { term: 'Molting (Mue)', definition: 'Processus pendant lequel la larve se débarrasse de son exosquelette pour permettre sa croissance.' },
  { term: 'Stades L1-L6', definition: 'Désignation des différents stades larvaires, de L1 (premier stade) à L6 (dernier stade avant pré-pupaison).' },
  { term: 'Chitine', definition: 'Biopolymère présent dans l\'exosquelette des insectes, ayant des applications en industrie et médecine.' },
  { term: 'Ratio C/N', definition: 'Rapport carbone/azote dans le substrat, facteur crucial pour l\'alimentation optimale des larves.' },
  { term: 'Phototactisme', definition: 'Réponse des larves BSF à la lumière (négative), les adultes recherchent la lumière pour l\'accouplement.' },
  { term: 'Gate Fees', definition: 'Frais de traitement facturés aux producteurs de déchets pour la réception et bioconversion de leurs biodéchets.' },
  { term: 'Tamis vibrant', definition: 'Équipement pour séparer les larves du substrat résiduel après traitement.' },
  { term: 'Acide laurique', definition: 'Acide gras concentré dans l\'huile de BSF, ingrédient de rupture pour la savonnerie et la cosmétique.' },
];

export const PRESET_AMOUNTS = [5000, 10000, 15000, 20000, 30000, 50000];
