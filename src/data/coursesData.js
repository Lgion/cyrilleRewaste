// ═══════════════════════════════════════════════
// ReWaste BSF — Support de Cours & Chapitres Pédagogiques LMS
// (Issu de la documentation officielle et de l'ancien site de formation)
// ═══════════════════════════════════════════════

export const LMS_CHAPTERS = [
  {
    id: 'chapitre-1',
    number: '01',
    title: 'BSF : Pourquoi et comment l\'utiliser',
    subtitle: 'Biologie, taxonomie, cycle de vie et atouts économiques',
    badge: 'Fondamentaux',
    icon: '🔬',
    summary: 'Comprendre l\'insecte Hermetia illucens, ses besoins biologiques stricts (28-30°C, phototactisme 440/540 nm) et la logique du cycle d\'élevage.',
    sections: [
      {
        heading: 'Le Défi des Déchets & La Solution BSF',
        content: `Dans les grandes métropoles d'Afrique de l'Ouest comme Abidjan, les biodéchets représentent 50% à 70% des volumes mis en décharge. 
        L'élevage de la mouche soldat noire (*Hermetia illucens*) permet de convertir jusqu'à 80% de cette biomasse organique en 12 jours, 
        produisant à la fois des protéines de haute qualité pour l'alimentation animale et un engrais naturel (le frass).`
      },
      {
        heading: 'Biologie & Cycle de Vie Naturel',
        content: `La mouche soldat noire ne possède pas de pièces buccales fonctionnelles à l'état adulte : elle ne pique pas, ne transmet pas de maladies et ne se nourrit pas. 
        Toute son énergie provient des réserves accumulées pendant son stade larvaire.
        
        • Stade Œuf : Incubation de 4 jours à 28°C-30°C et 70% d'humidité.
        • Stade Larve (L1 à L6) : Période de voracité intense de 12 à 14 jours, où la larve multiplie sa masse par 6 000.
        • Stade Pré-pupe : La larve cesse de s'alimenter, sa cuticule noircit et elle migre spontanément hors du substrat (auto-récolte).
        • Stade Pupe : Métamorphose de 8 à 14 jours dans un milieu sec et sombre.
        • Stade Adulte : Vie de 5 à 8 jours dédiée exclusivement à l'accouplement et à la ponte.`
      },
      {
        heading: 'Cycle Ingéniérisé en 3 Unités de Production',
        content: `Pour rentabiliser l'élevage, l'installation est divisée en 3 zones étanches :
        1. L'Unité de Reproduction (Love Cages avec lumière spécifique 440 nm / 540 nm et pondoirs rainurés).
        2. L'Unité de Nurserie & Engraissement (Bacs Larveros conduits à 31,25 kg/m²/jour).
        3. L'Unité de Post-Traitement (Blanchiment 90°C/60s, séchage Pop-Larvae, pressage d'huile et tamisage du frass).`
      }
    ],
    keyPoints: [
      'L\'adulte ne se nourrit pas et n\'est pas un vecteur pathogène.',
      'Plage thermique optimale : 28°C à 32°C. Au-dessus de 36°C ou en-dessous de 20°C, le développement stoppe.',
      'Le rapport de bioconversion (BCR) doit dépasser 12% en conditions rentables.',
      'Les larves réduisent la charge bactérienne (Salmonella, E. coli) grâce à leurs peptides antimicrobiens.'
    ]
  },
  {
    id: 'chapitre-2',
    number: '02',
    title: 'Déchets et Collecte',
    subtitle: 'Typologie des gisements, formulation et préparation des substrats',
    badge: 'Alimentation',
    icon: '🥗',
    summary: 'Identifier les gisements de biodéchets admissibles, éviter les contaminants et maîtriser le ratio C/N et le taux d\'humidité idéal.',
    sections: [
      {
        heading: 'Déchets Admissibles vs Interdits',
        content: `La larve BSF est très polyvalente mais certains déchets sont proscrits :
        
        ✅ Déchets Excellents :
        • Écarts de tri de marchés de fruits et légumes (mangues, bananes, papayes, papaye).
        • Drêches de brasserie et résidus céréaliers (riches en fibres et protéines).
        • Épluchures de tubercules (manioc, igname) pré-broyées.
        • Restes de cantines collectives (après contrôle du sel et des épices).
        
        ❌ Déchets Strictement Interdits :
        • Déchets contenant des insecticides ou solvants chimiques.
        • Cadavres d'animaux en état de décomposition avancée sans chaîne de chaud.
        • Déchets à haute teneur en sel (> 1,5%) qui dessèchent les larves.
        • Bois dur, coques de noix et matières ligno-cellulosiques non dégradables.`
      },
      {
        heading: 'Préparation et Test du Poing Serré',
        content: `L'humidité du substrat est le paramètre le plus critique :
        • Objectif : 70% à 75% d'humidité.
        • Le Test du Poing : Prenez une poignée de substrat préparé et serrez fort dans la main. 
          - Si de l'eau s'écoule entre les doigts : Trop humide (> 85%), risque d'asphyxie et de fuite larvaire.
          - Si la motte s'effrite à l'ouverture : Trop sec (< 60%), les larves ne peuvent pas s'alimenter.
          - Si la motte reste compacte avec juste quelques gouttes visibles : Humidité parfaite !`
      },
      {
        heading: 'Formulation Nurserie 70/30',
        content: `Pour les 5 premiers jours des jeunes larves (5-DOL), utilisez la formule nurserie ReWaste :
        • 70% d'aliment de démarrage provende poulet micronisée.
        • 30% d'eau propre.
        Ce régime garantit un taux de survie supérieur à 90% avant le transfert en engraissement sur biodéchets bruts.`
      }
    ],
    keyPoints: [
      'Broyer les déchets grossiers à une granulométrie de 5 à 10 mm pour accélérer l\'ingestion.',
      'Maintenir le ratio C/N (Carbone/Azote) entre 15:1 et 25:1.',
      'Ne jamais utiliser de substrats moisis ou toxiques.',
      'Prévoir un bac de rétention des lixiviats sous chaque étage de Larvero.'
    ]
  },
  {
    id: 'chapitre-3',
    number: '03',
    title: 'Les Trois Unités de Production',
    subtitle: 'Conception technique de l\'insectarium, de la nurserie et du raffinage',
    badge: 'Ingénierie',
    icon: '🏭',
    summary: 'Plans techniques, équipement d\'élevage, régulation du climat et organisation des flux matière sans contamination croisée.',
    sections: [
      {
        heading: '1. Unité de Reproduction (Love Cages)',
        content: `La chambre nuptiale requiert :
        • Moustiquaire micro-aérée empêchant toute évasion et entrée de mouches domestiques.
        • Éclairage biologique adapté : spectre bleu 440 nm et vert 540 nm (ou lumière naturelle indirecte 3000 à 6000 lx).
        • Pondoirs en lattes de bois rainurées ou carton ondulé suspendus au-dessus d'un attractant odorant sans contact direct.
        • Récolte quotidienne des blocs d'œufs (oviposition).`
      },
      {
        heading: '2. Unité de Croissance Larvaire (Larveros)',
        content: `Les bacs de grossissement sont empilables et conçus pour la ventilation :
        • Surface requise : ratio de 31,25 kg de déchets par m² et par jour.
        • Cycle d'engraissement standard : 12 jours.
        • Gestion de la densité larvaire : environ 3 à 5 larves par gramme de substrat.
        • Séparation mécanique finale via tamis vibrant motorisé ou tamis manuel rotatif.`
      },
      {
        heading: '3. Unité de Post-Traitement & Raffinage',
        content: `Pour commercialiser des produits conformes aux normes sanitaires :
        • Blanchiment thermique : Immersion des larves lavées dans l'eau à 90°C pendant exactement 60 secondes (pasteurisation et stabilisation enzymatique).
        • Séchage Pop-Larvae : Procédé micro-ondes exclusif créant une texture soufflée jaune pâle très recherchée.
        • Pressage mécanique : Séparation de la fraction protéique dégraissée (farine 60% protéines) et de l'huile brute (acide laurique).
        • Conditionnement du frass : Séchage à l'air libre et ensachage en sacs de 25 kg et 50 kg.`
      }
    ],
    keyPoints: [
      'Garantir une marche en avant : les flux de déchets ne croisent jamais les produits finis.',
      'Pièges à fourmis obligatoires sous chaque pied de support de bacs (eau + détergent).',
      'Port des EPI industriels (bottes, gants thermiques, tablier étanche, masque).',
      'Désinfection systématique des bacs à l\'alcool 95% ou nettoyeur haute pression.'
    ]
  },
  {
    id: 'chapitre-4',
    number: '04',
    title: 'Scénarios de Production & Business Model',
    subtitle: 'Rentabilité, investissement initial, Gate Fees et marchés cibles',
    badge: 'Business',
    icon: '📈',
    summary: 'Construire son plan financier, fixer ses prix de vente, piloter ses marges et négocier ses contrats de Gate Fees avec les collectivités.',
    sections: [
      {
        heading: 'Les 5 Flux de Trésorerie du Modèle Hybride',
        content: `Une unité BSF moderne ne dépend pas d'un seul produit :
        1. Vente récurrente de larves 5-DOL aux fermes satellites (lots pré-comptés).
        2. Gate Fees : Facturation de la réception des déchets aux industriels (8 000 à 25 000 FCFA / tonne selon le risque sanitaire).
        3. Farine BSF dégraissée vendue aux provendiers (substitut premium à 500-800 FCFA/kg).
        4. Huile brute BSF vendue aux savonneries artisanales et cosmétiques.
        5. Formations certifiées et accompagnement de nouveaux porteurs de projets.`
      },
      {
        heading: 'Seuils de Rentabilité & Payback',
        content: `D'après les analyses économiques du Business Plan ReWaste :
        • Une unité pilote traitant 200 kg/jour de biodéchets génère environ 1,3 tonne de larves fraîches et 2 tonnes de frass par mois.
        • L'économie directe sur l'aliment volaille/poisson dépasse 400 000 FCFA/mois pour une ferme de taille moyenne.
        • Le retour sur investissement (Payback period) est généralement atteint entre 14 et 18 mois d'exploitation continue.`
      },
      {
        heading: 'Stratégie Commerciale Locale',
        content: `Commencez par contractualiser les approvisionnements en déchets (marchés de gros ou brasseries locales) avec une garantie de retrait hebdomadaire. 
        Nouez des partenariats avec les pisciculteurs locaux (silures / poissons-chats) qui sont les clients les plus réceptifs aux larves vivantes et séchées.`
      }
    ],
    keyPoints: [
      'Toujours sécuriser la source de déchets avant d\'investir dans le matériel.',
      'Les Gate Fees permettent de financer les charges d\'exploitation avant même la vente des coproduits.',
      'La traçabilité par lot (Colony Manager) est obligatoire pour vendre aux industriels.',
      'La formation est le levier de trésorerie le plus rapide au démarrage.'
    ]
  }
];
