import type { ResumeContent } from './types.ts';

/*
 * `{credit}`, `{dayRate}`, `{maxDays}` and `{evolutionDays}` are read from
 * prices.ts when the page is built (src/lib/price-tokens.ts): a price is never
 * copied into prose.
 */
export const fr = {
  meta: {
    title: 'Thomas Bouzy — Freelance fullstack, Nancy et Strasbourg',
    description:
      "Fullstack, avec une expertise backend PHP/Symfony : je reprends et fais évoluer tes applications métier, même celle que plus personne n'ose toucher. Sur place de Nancy à Strasbourg, à distance ailleurs. Prix publics.",
  },

  a11y: {
    skipToContent: 'Aller au contenu',
    languageSwitcher: 'Langue',
    switchToOther: 'Read in English',
    breadcrumb: "Fil d'Ariane",
    mainNavigation: 'Principale',
    portraitAlt: 'Portrait de Thomas Bouzy',
  },

  nav: {
    home: 'Accueil',
    offers: 'Offres',
    partners: 'Partenaires',
    publicSector: 'Collectivités',
    work: 'Références',
    about: 'À propos',
    contact: 'Me contacter',
  },

  hero: {
    title: ['Je reprends et fais évoluer', 'tes applications métier.'],
    blurb: "Même celle que plus personne n'ose toucher. Sans l'arrêter, sans tout réécrire.",
    ctaBook: 'Réserver un appel gratuit',
    ctaOffers: 'Voir les offres',
  },

  problem: {
    audit: {
      text: 'Tu hésites ?',
      cta: 'Commence par un audit',
    },
    kicker: 'Le problème',
    title: "Tu reconnais l'une de ces phrases ?",
    pause: 'Pause',
    goTo: 'Phrase {n}',
  },

  failureModes: [
    {
      quote: "« Celui qui a fait notre appli est parti et plus personne n'ose y toucher. »",
      text: "L'application orpheline. Personne ne la connaît plus et chaque modification devient un pari.",
      offer: 'takeover',
    },
    {
      quote: "« La montée de version, c'est toujours pour le trimestre prochain. »",
      text: "La migration qui n'arrive jamais. Le système ne peut pas s'arrêter, alors on repousse et la facture grossit.",
      offer: 'migration',
    },
    {
      quote: '« Le stock ne tombe jamais juste et personne ne sait pourquoi. »',
      text: "L'écart que personne ne sait expliquer. Le logiciel donne le chiffre du jour, jamais les mouvements qui y ont mené.",
      offer: 'reliability',
    },
    {
      quote: '« Ce sont nos clients qui trouvent les bugs. »',
      text: 'Les défauts trouvés par les utilisateurs. Le bug était visible des heures plus tôt ; rien ne le signalait.',
      offer: 'reliability',
    },
    {
      quote: "« Le jour de l'opération commerciale, tout tombe. »",
      text: 'Le pic qui fait tout tomber. Le système tient au quotidien et lâche le jour où tout le monde arrive.',
      offer: 'scaling',
    },
  ],

  work: {
    kicker: 'Références',
    title: "Là où j'ai déjà tenu la production",
    intro: 'Industrie, fintech, SaaS, associatif, collectivité.',
    labelPlain: 'En clair :',
    labelApproach: 'Approche',
    labelResult: 'Résultat',
  },

  achievements: [
    {
      id: 'industrial-erp',
      title: "Maintenir l'ERP de plusieurs usines ArcelorMittal",
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        'Veiller sur le logiciel dont plusieurs usines dépendent chaque jour, des fournisseurs aux factures.',
      approach:
        'Toute la chaîne, des fournisseurs aux incidents : rien ne partait sans être vérifié.',
      result: 'Resté en production tout du long.',
    },
    {
      id: 'live-api-redesign',
      title: "Refaire une API de production sans que l'utilisateur s'en aperçoive",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Reconstruire les fondations d'un produit en service, sans une coupure pour ceux qui s'en servent.",
      approach:
        'Un produit de trading lent et instable, refait par étapes en React et Next.js, front jamais cassé. Déploiement sur Kubernetes et ArgoCD à ma charge.',
      result:
        'Erreurs 500 à zéro, page utilisable en 3 secondes au lieu de 17, déploiement de 15 à 4 minutes, données achetées de 9 000 € à 3 000 € par an. Incidents pilotés via Rootly.',
    },
    {
      id: 'wallet-event-sourcing',
      title: "Tracer l'argent de 1,5 million d'utilisateurs",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Rendre chaque mouvement d'un portefeuille traçable, au lieu de ne connaître que le solde du jour.",
      approach:
        'Event Sourcing et outbox via SNS/SQS : chaque mouvement devient un fait stocké et rejouable.',
      result:
        "Plus de 1 000 transactions par minute, pics de 10 000 à 20 000 utilisateurs testés en charge. Alertes avant la panne (OpenTelemetry et Datadog) : d'une vingtaine de bugs remontés à cinq par mois.",
    },
    {
      id: 'on-chain-operations',
      title: "Déplacer de l'argent réel, sans droit à l'erreur",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Un service qui place et réajuste tout seul de l'argent sur des marchés, où un ordre parti ne se rattrape pas.",
      approach:
        "Des opérations DeFi sur Solana, depuis un microservice Node.js avec le SDK Meteora et Fireblocks pour la signature. Intégration de SDK et opération de transactions, pas d'écriture de smart contracts.",
      result:
        'En production sur fonds réels, signature idempotente et réconciliation avec la chaîne.',
    },
    {
      id: 'enterprise-onboarding',
      title: 'Démarrer un nouveau grand compte en une journée',
      org: 'Kiss The Bride',
      period: 'Janv. 2018 – Avril 2022',
      plain:
        "Chaque nouveau client demandait un paramétrage sur mesure ; c'est désormais l'affaire d'une journée.",
      approach:
        "Un monolithe Symfony 2.7 sans aucun test. Les tests d'abord, puis Symfony 4 avec API Platform et React, sans arrêt ; mise en route automatisée en Node.js et Jenkins.",
      result: 'Classements diffusés en direct via Mercure. Quatre juniors encadrés deux ans.',
    },
    {
      id: 'codebase-audit',
      title: "Auditer une base de code qui n'est pas la mienne",
      org: 'Civic tech, bénévolat',
      period: '2026',
      plain:
        'Dire à une équipe ce qui, dans son code, peut lui coûter cher, puis corriger moi-même le plus critique.',
      approach:
        'Trois applications sans aucun test, dont une boutique qui encaisse. Quatre rapports priorisés, dont 17 points de sécurité.',
      result:
        'Le panier est revalidé côté serveur ; paiements et authentification admin testés, CodeQL dans le pipeline.',
    },
    {
      id: 'open-data-directories',
      title: 'Reconstituer en 40 secondes un annuaire fait à la main',
      org: 'Pour un client',
      period: '2026',
      plain:
        "Reconstituer en quelques secondes un annuaire qu'on établissait à la main, commune par commune.",
      approach:
        "Les données ouvertes, enrichies depuis les sites publics des collectivités, avec la provenance de chaque valeur. Local-first : un fichier SQLite sur la machine de l'utilisateur.",
      result: "Sur l'Ille-et-Vilaine, 31 273 associations de 332 communes en 40 secondes.",
      link: {
        href: 'https://github.com/Birdiz/annuaire-vie-associative/releases',
        label: 'Les versions publiées',
      },
    },
    {
      id: 'staircase-calculator',
      title: 'Calculer un escalier en bois, du plan à la découpe',
      org: 'Produit personnel',
      period: '2026',
      plain:
        "Un menuisier répond à six questions et obtient plan, 3D, fiche d'atelier et fichiers pour sa machine.",
      approach:
        "Un moteur de calcul séparé de l'interface, en TypeScript. 3D en Three.js, export DXF.",
      result: 'En ligne, en abonnement, utilisable sans réseau.',
      link: {
        href: 'https://quart-de-tour.fr',
        label: 'Essayer Quart de tour',
      },
    },
    {
      id: 'village-website',
      title: 'Donner à un village son site officiel',
      org: 'Commune de Grandrupt, bénévolat',
      period: '2026',
      plain: 'Horaires, démarches et nouvelles au même endroit et une mairie qui publie elle-même.',
      approach: 'En trois langues, sur Next.js, avec un back-office Payload CMS à rôles.',
      result:
        "Remis à la commune, avec sa déclaration d'accessibilité publiée : partiellement conforme.",
      link: {
        href: 'https://village-de-grandrupt.fr',
        label: 'Voir le site',
      },
    },
  ],

  references: {
    arcelormittal: {
      name: 'ArcelorMittal',
      sector: 'Industrie · via Quadra Informatique',
      period: '2016 – 2017',
      headline: "L'ERP de plusieurs usines, tenu en production, des fournisseurs aux factures.",
    },
    socios: {
      name: 'Socios.com (Chiliz)',
      sector: "Fintech · 1,5 million d'utilisateurs",
      period: '2022 – 2026',
      headline:
        "Une API refaite sans coupure, chaque mouvement d'argent tracé, les bugs remontés divisés par quatre.",
    },
    'kiss-the-bride': {
      name: 'Kiss The Bride',
      sector: 'SaaS pour grands comptes',
      period: '2018 – 2022',
      headline:
        "Un nouveau grand compte en une journée, sur un monolithe repris sans jamais l'arrêter.",
    },
    'civic-tech': {
      name: 'Civic tech',
      sector: 'Bénévolat',
      period: '2026',
      headline: 'Trois applications auditées, 17 failles trouvées, les plus graves corrigées.',
    },
    'open-data': {
      name: 'Annuaire associatif',
      sector: 'Open data · pour un client',
      period: '2026',
      headline: "31 273 associations recensées en 40 secondes, au lieu d'un relevé à la main.",
    },
    'quart-de-tour': {
      name: 'Quart de tour',
      sector: 'Menuiserie · produit personnel',
      period: '2026',
      headline: 'Un escalier en bois calculé en ligne, du plan aux fichiers de découpe.',
    },
    grandrupt: {
      name: 'Village de Grandrupt',
      sector: 'Collectivité · bénévolat',
      period: '2026',
      headline: "Le site officiel d'un village, en trois langues.",
    },
  },

  about: {
    kicker: 'À propos',
    title: 'Qui décroche',
    paragraphs: [
      "Ce qui me plaît, c'est le problème : comprendre ce dont ton métier a besoin et y répondre. La tech vient après. On me dit trop direct : pour toi, un avis sans enrobage.",
      "Mon terrain, c'est PHP et Symfony, puis Node.js, TypeScript et React ; Python, en projets personnels. J'ai enseigné à la fac et je vis à la campagne, en Grand Est.",
    ],
    careerLine: "En poste plutôt qu'en mission ?",
    careerLink: 'Mon parcours est sur LinkedIn.',
  },

  languages: [
    { name: 'Français', level: 'langue maternelle' },
    { name: 'Anglais', level: 'C1 — professionnel complet' },
    { name: 'Allemand', level: 'B1 — bases professionnelles' },
  ],

  schema: {
    jobTitle: 'Développeur fullstack freelance',
    knowsAbout: [
      'PHP',
      'Symfony',
      'Event Sourcing',
      'API Platform',
      'Node.js',
      'TypeScript',
      'React',
      'Next.js',
      'Solana',
      'Fireblocks',
      'Kubernetes',
      'ArgoCD',
      'OpenTelemetry',
      'Datadog',
      'Mercure',
      'Jenkins',
      'SQLite',
      'CodeQL',
    ],
  },

  offersSection: {
    kicker: 'Les offres',
    title: 'Une offre pour chaque moment de ton application, chacune avec son prix.',
    stages: ['Créer', 'Fiabiliser et migrer, en parallèle', 'Tenir la charge'],
    alongside: 'À tout moment',
    lifecycle: 'La vie de ton application',
    from: {
      fee: 'à partir de',
      setup: 'à partir de',
      plan: 'première étape à partir de',
      monthly: 'à partir de',
    },
    followedBy: 'puis',
    start: 'Par où commencer',
    inFrench: '(en français)',
    book: { text: "Tu sais déjà ce qu'il te faut ?", cta: 'Réserver un appel gratuit' },
    publicSector: 'Une collectivité ?',
    publicSectorLink: 'Voir la page dédiée',
    partners: 'Agence ou société de services ?',
    partnersLink: 'Voir la page partenaires',
  },

  offers: {
    audit: {
      name: 'Audit',
      plain:
        'Un regard extérieur, rendu par écrit : ce qui peut te coûter cher et par quoi commencer.',
    },
    takeover: {
      name: 'Reprise et maintenance',
      plain:
        "Reprendre l'application que plus personne n'ose toucher, sans rien casser, puis la faire vivre chaque mois.",
    },
    migration: {
      name: 'Migration sans interruption',
      plain:
        "Faire passer un système qui tourne à une nouvelle version, sans l'arrêter, étape par étape.",
    },
    reliability: {
      name: 'Fiabilisation',
      plain: 'Savoir expliquer un écart de stock, un solde ou un bug, au lieu de le deviner.',
    },
    scaling: {
      name: 'Tenue en charge',
      plain:
        'Que ton système tienne le jour où tout le monde arrive et se relève seul quand une pièce lâche.',
    },
    build: {
      name: 'Création sur mesure',
      plain:
        "Construire l'application qui te manque, pensée dès le départ pour qu'un autre puisse la reprendre.",
    },
    reinforcement: {
      name: 'Renfort senior',
      plain:
        'Un lead ou un architecte senior dans ton équipe, à temps partiel, facturé à la journée.',
    },
  },

  offerPage: {
    sentences: 'Tu te reconnais ici ?',
    delivered: 'Ce que tu reçois',
    disclaimer: 'Ordre de grandeur, pas un devis.',
    tableCaption: 'Toutes les fourchettes, hors taxes',
    excludingVat: 'HT',
    perMonth: '/ mois',
    weekOne: 'semaine',
    weekMany: 'semaines',
    notTheRightChoice: 'Pas le bon choix si…',
    achievements: 'Ce qui le prouve',
    faq: 'Questions fréquentes',
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes, gratuit.',
      text: 'Je te dis franchement si cette offre est la bonne et sinon laquelle.',
      cta: 'Réserver un appel',
      orWrite: 'Tu préfères écrire ?',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  offerPages: {
    audit: {
      meta: {
        title: 'Audit de code et due diligence technique',
        description:
          "Audit d'application : rapport écrit, registre des risques, plan d'action priorisé. L'express, à prix fixe, est déduit de la mission qui suit.",
      },
      heading: 'Audit technique de ton application',
      priceHeading: 'Combien coûte un audit de code ?',
      sentences: [
        '« On sent que quelque chose ne va pas, mais on ne sait pas par où commencer. »',
        '« Avant de signer pour une refonte, on voudrait un avis qui ne vend pas la refonte. »',
      ],
      delivered: [
        {
          title: 'Un rapport écrit',
          text: "Après lecture du code et échanges avec l'équipe, sans rien modifier : ce qui tient et ce qui coûte.",
        },
        {
          title: 'Un registre des risques',
          text: 'Chaque risque, sa gravité et le prix de le laisser en place.',
        },
        {
          title: "Un plan d'action, présenté à l'équipe",
          text: "Les corrections dans l'ordre où elles rapportent, discutées jusqu'à être comprises.",
        },
      ],
      variant: {
        title: 'Variante : la due diligence technique',
        text: 'Avant un rachat ou une levée de fonds : ce que vaut le logiciel et ce qui pourrait surprendre après signature.',
      },
      estimator: {
        dimensions: {
          size: {
            label: 'Taille du système',
            options: {
              small: 'Une application',
              medium: 'Quelques applications',
              large: 'Une plateforme',
            },
          },
          depth: {
            label: 'Profondeur',
            options: { express: 'Express', full: 'Complet' },
          },
        },
        amounts: { fee: "Prix de l'audit" },
        duration: 'Durée',
      },
      rules: [
        "Si tu me confies ensuite la mission qui en découle, {credit} du prix de l'audit en sont déduits.",
      ],
      notTheRightChoice: [
        {
          text: "Ton application n'a plus personne pour s'en occuper : la {offer} commence par là.",
          offer: 'takeover',
        },
        {
          text: "Tu cherches la validation d'une décision déjà prise : l'audit dira ce qu'il trouve.",
        },
      ],
      faq: [
        {
          question: "Et si l'audit conclut qu'il faut tout réécrire ?",
          answer:
            "Il le dira, avec ce que coûte de ne pas le faire. C'est rare : un système se reprend presque toujours par morceaux.",
        },
        {
          question: "Pourquoi un prix fixe pour l'express et une fourchette pour le complet ?",
          answer:
            "L'express est borné à moins de trois jours, sur l'application qui t'inquiète le plus. Le complet dépend de la taille réelle du système ; son devis est ferme avant de commencer.",
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "Une architecture et ses risques se lisent dans toutes les stacks. Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
    takeover: {
      meta: {
        title: "TMA : reprise et maintenance d'application métier",
        description:
          "Ton prestataire est parti, plus personne n'ose toucher l'application ? Reprise, filet de tests, puis maintenance mensuelle sans engagement, à prix publié.",
      },
      heading: 'Reprise et maintenance de ton application métier',
      priceHeading: "Combien coûte la maintenance d'une application ?",
      sentences: [
        '« On ne sait même plus qui a les accès au serveur. »',
        "« Chaque modification, c'est la boule au ventre. »",
      ],
      delivered: [
        {
          title: "Un filet de tests, d'abord",
          text: "Des tests qui vérifient ce que l'application fait aujourd'hui, avant toute modification.",
        },
        {
          title: "Une carte de l'application",
          text: "Ce qu'elle fait, où elle tourne, qui détient les accès. Écrite, pour ne plus dépendre d'une seule personne.",
        },
        {
          title: 'Une remise en état',
          text: 'Des sauvegardes qui se restaurent, les mises à jour de sécurité urgentes faites.',
        },
        {
          title: 'La formule Veille ou Évolution',
          text: "Chaque mois : sécurité, surveillance, incidents corrigés jusqu'à une demi-journée chacun. L'Évolution ajoute {evolutionDays} jours pour tes demandes.",
        },
      ],
      estimator: {
        dimensions: {
          size: {
            label: "Taille de l'application",
            options: {
              small: 'Un outil interne',
              medium: 'Une application métier',
              large: "Le cœur de l'activité",
            },
          },
          plan: {
            label: 'Formule',
            options: { watch: 'Veille', evolution: 'Évolution' },
          },
        },
        amounts: { setup: '01–03 · Mise en place, une fois', monthly: '04 · Formule mensuelle' },
        duration: 'Durée de la mise en place',
        daysIncluded: 'Veille + {days} jours pour tes demandes',
      },
      rules: [
        "Une Reprise commence toujours par un filet de tests : on ne modifie pas ce qu'on ne sait pas vérifier.",
        "En Veille, il couvre les parcours critiques ; en Évolution, toute l'application, puisqu'elle va changer. C'est ce qui rend sa mise en place plus chère.",
      ],
      notTheRightChoice: [
        {
          text: "Tu envisages un logiciel du marché : un {offer} te dira d'abord si c'est le bon calcul.",
          offer: 'audit',
        },
        {
          text: 'Ton équipe technique est en place : le {offer} lui conviendra mieux.',
          offer: 'reinforcement',
        },
      ],
      faq: [
        {
          question: 'Est-ce de la TMA ? Pour quelles technologies ?',
          answer:
            "Oui : une maintenance mensuelle d'applications web, même anciennes. Mon terrain, c'est PHP et Symfony ; Node.js, TypeScript et React aussi. Python, pour l'instant en projets personnels. Pas de WinDev ni d'Access.",
        },
        {
          question: "Faut-il récupérer le code auprès de l'ancien prestataire ?",
          answer: "Oui, c'est la première chose à faire ; la carte dit ce qui manque.",
        },
        {
          question: 'Et si tu pars à ton tour ?',
          answer:
            "La carte, les accès, les tests et la documentation t'appartiennent : un autre développeur reprend là où je m'arrête.",
        },
        {
          question: 'La formule est-elle avec engagement ?',
          answer: "Non. Elle est mensuelle, avec un mois de préavis de part et d'autre.",
        },
      ],
    },
    migration: {
      meta: {
        title: 'Migration Symfony et PHP sans interruption de service',
        description:
          "Montée de version Symfony ou PHP sur un système qui ne peut pas s'arrêter : plan à prix fixe, puis exécution avec ton équipe.",
      },
      heading: 'Migration Symfony et PHP sans interruption',
      priceHeading: 'Combien coûte une migration Symfony ?',
      sentences: [
        "« On est bloqués sur une version de PHP qui n'a plus de correctifs de sécurité. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : un plan chiffré',
          text: "Les étapes de ta montée de version PHP ou Symfony, leurs risques et leur retour arrière. Il t'appartient.",
        },
        {
          title: 'Phase 2 : la migration, avec ton équipe',
          text: "Étape par étape, tests manquants d'abord ; ancien et nouveau cohabitent le temps qu'il faut.",
        },
        {
          title: 'Une équipe qui saura refaire',
          text: "L'ancien chemin retiré et une équipe qui n'aura plus besoin de moi la prochaine fois.",
        },
      ],
      estimator: {
        dimensions: {
          gap: {
            label: 'Écart de version',
            options: {
              one: 'Une version majeure',
              two: 'Deux versions majeures',
              'three-plus': 'Trois ou plus',
            },
          },
          coverage: {
            label: 'Couverture de tests existante',
            options: { good: 'Bonne', partial: 'Partielle', none: 'Aucune' },
          },
        },
        amounts: { plan: 'Plan, phase 1 à prix fixe' },
        duration: 'Exécution, avec ton équipe',
      },
      rules: [
        "La Migration se vend en deux phases : un plan à prix fixe, puis l'exécution à {dayRate} HT la journée. Tu décides de la seconde, plan en main.",
      ],
      notTheRightChoice: [
        {
          text: "Le système peut s'arrêter un week-end sans dommage : une migration classique coûtera moins cher.",
        },
        {
          text: 'Tu veux le remplacer plutôt que le faire évoluer : un {offer} éclairera ce choix.',
          offer: 'audit',
        },
      ],
      faq: [
        {
          question:
            "Pourquoi la couverture de tests pèse-t-elle autant sur le prix d'une migration Symfony ?",
          answer:
            "Sans tests, chaque étape se vérifie à la main. C'est le premier facteur de coût, avant l'écart de version.",
        },
        {
          question: 'Et si une étape casse quelque chose ?',
          answer:
            'Chaque étape a son retour arrière, écrit dans le plan. On revient, on corrige, on repart.',
        },
      ],
    },
    reliability: {
      meta: {
        title: 'Fiabiliser une application : écarts, bugs en prod',
        description:
          "Un stock, un solde ou une facturation qui ne tombe pas juste ? Traçabilité des flux et observabilité pour expliquer l'écart. Prix publics.",
      },
      heading: 'Fiabilisation : expliquer chaque écart au lieu de le deviner',
      priceHeading: "Combien coûte la fiabilisation d'une application ?",
      sentences: ["« On a recrédité deux fois et on ne l'a vu qu'à la réconciliation. »"],
      delivered: [
        {
          title: 'Les flux qui comptent, choisis ensemble',
          text: 'Ceux où un écart coûte : stock, facturation, paiements.',
        },
        {
          title: 'Des flux traçables',
          text: "Chaque mouvement gardé comme un fait daté : l'historique se rejoue.",
        },
        {
          title: 'La double exécution, traitée',
          text: "Un message reçu deux fois n'est appliqué qu'une fois.",
        },
        {
          title: 'Des alertes avant tes clients',
          text: 'Et des équipes qui savent les lire quand je pars.',
        },
      ],
      estimator: {
        dimensions: {
          flows: {
            label: 'Flux ou services à fiabiliser',
            options: { few: '1 à 2', some: '3 à 5', many: '6 à 10' },
          },
        },
        amounts: { fee: 'Prix' },
        duration: 'Durée',
      },
      rules: [],
      notTheRightChoice: [
        {
          text: "Tu ne sais pas encore où est le problème : un {offer} le situera d'abord.",
          offer: 'audit',
        },
        {
          text: "Tu cherches seulement un outil de supervision à installer : ce n'est qu'un moyen.",
        },
      ],
      faq: [
        {
          question: "Qu'est-ce qu'une double exécution, concrètement ?",
          answer:
            'Un virement recrédité, un lot déstocké deux fois. Elle se prévient dès la conception.',
        },
        {
          question: "Faut-il changer d'outil de supervision ?",
          answer: "Rarement. On part de ce que tu as : l'essentiel est de savoir quoi observer.",
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "Tracer un flux ne dépend pas du langage. Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
    scaling: {
      meta: {
        title: "Montée en charge et haute disponibilité d'une application",
        description:
          'Ton application ralentit ou tombe aux pics de trafic ? Tir de charge, goulot trouvé, corrections mesurées : diagnostic à prix fixe. Prix publics.',
      },
      heading: 'Montée en charge et haute disponibilité de ton application',
      priceHeading: 'Combien coûte un diagnostic de montée en charge ?',
      sentences: [
        "« Ça rame dès qu'on a du monde. »",
        "« On a doublé les serveurs et ça n'a rien changé. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : un tir de charge qui reproduit ton pic',
          text: "Avant de rien modifier : on part d'un chiffre, pas d'une impression.",
        },
        {
          title: 'Le goulot, trouvé et chiffré',
          text: 'Base de données, cache, files de messages ou code : ce qui cède en premier et ce que chaque correction rapporte.',
        },
        {
          title: 'Phase 2 : les corrections, mesurées',
          text: 'Chacune repasse sous le même tir de charge.',
        },
        {
          title: 'Un système qui tombe proprement',
          text: "Contre-pression sur les files, disjoncteurs, mode dégradé : dans un système distribué, une pièce qui lâche n'emporte plus le reste. Le scénario de charge reste dans ta CI, avec un runbook d'incident.",
        },
      ],
      estimator: {
        dimensions: {
          services: {
            label: 'Services concernés',
            options: { one: 'Un service', some: '2 à 5', many: '6 ou plus' },
          },
          observability: {
            label: 'Supervision existante',
            options: { good: 'Bonne', partial: 'Partielle', none: 'Aucune' },
          },
        },
        amounts: { plan: 'Diagnostic, phase 1 à prix fixe' },
        duration: 'Corrections, à la journée',
      },
      rules: [
        'Une Tenue en charge commence toujours par un tir de charge qui reproduit le pic, avant toute modification.',
        'Elle se vend en deux phases : le diagnostic à prix fixe, puis les corrections à {dayRate} HT la journée.',
      ],
      notTheRightChoice: [
        {
          text: "Le problème est un chiffre faux, pas un système lent : la {offer} s'en occupe.",
          offer: 'reliability',
        },
        {
          text: "Tu ne sais pas encore où est le problème : un {offer} le situera d'abord.",
          offer: 'audit',
        },
      ],
      faq: [
        {
          question: 'Ajouter des serveurs ne suffit-il pas ?',
          answer:
            "Rarement. Si le goulot est la base de données ou un service externe, dix serveurs l'attendent ensemble. Le tir de charge dit où il est.",
        },
        {
          question: 'Le tir de charge risque-t-il de faire tomber la production ?',
          answer:
            "Il se fait sur une copie fidèle, ou en production par paliers, hors des heures d'affluence, avec un arrêt prêt.",
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "Un tir de charge ne dépend pas du langage. Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
    build: {
      meta: {
        title: "Développement d'application métier sur mesure, front et back",
        description:
          'Une application métier sur mesure, front et back, construite pour être reprise : cadrage à prix fixe, puis développement à la journée. Prix publics.',
      },
      heading: "Développement d'application sur mesure",
      priceHeading: 'Combien coûte une application sur mesure ?',
      sentences: [
        '« Toute notre activité tient sur un fichier Excel que tout le monde modifie en même temps. »',
        "« On a l'idée du service, pas l'équipe pour le construire. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : le cadrage, à prix fixe',
          text: "L'architecture, les décisions écrites et un premier squelette qui tourne de bout en bout. Il t'appartient.",
        },
        {
          title: 'Phase 2 : la construction, testée dès la première semaine',
          text: 'Livrée par étapes que tu utilises, pas en un bloc à la fin.',
        },
        {
          title: 'Une passation, pas une dépendance',
          text: "Le code, les tests et les décisions écrites : une autre équipe peut prendre le relais sans moi. C'est ce qui manque aux applications que je reprends.",
        },
      ],
      estimator: {
        dimensions: {
          size: {
            label: "Ce qu'il faut construire",
            options: {
              small: 'Un outil interne',
              medium: 'Une application métier',
              large: 'Un service critique',
            },
          },
          integrations: {
            label: 'Systèmes à relier',
            options: { none: 'Aucun', few: '1 ou 2', many: '3 ou plus' },
          },
        },
        amounts: { plan: 'Cadrage, phase 1 à prix fixe' },
        duration: 'Construction, à la journée',
      },
      rules: [
        "Une Création sur mesure ne remplace jamais un système qui tourne : celui-là relève d'une Migration, ou d'abord d'un Audit.",
        'Elle se vend en deux phases : le cadrage à prix fixe, puis la construction à {dayRate} HT la journée. Tu décides de la seconde, cadrage en main.',
      ],
      notTheRightChoice: [
        {
          text: 'Ton application existe déjà et tourne : la {offer} la fera évoluer sans la remplacer.',
          offer: 'migration',
        },
        {
          text: "Un logiciel du marché fait déjà le travail : un {offer} te dira si c'est le bon calcul.",
          offer: 'audit',
        },
      ],
      faq: [
        {
          question: 'Pourquoi le nombre de systèmes à relier pèse-t-il sur le prix ?',
          answer:
            "Chaque système à relier (ERP, paiement, comptabilité) a ses règles, ses pannes et ses délais. C'est là qu'un projet dérape, plus souvent que dans les écrans.",
        },
        {
          question: "Et une fois l'application livrée ?",
          answer:
            'Ton équipe la reprend avec les tests et les décisions écrites, ou je la maintiens au mois, avec la Reprise et maintenance.',
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "On choisit ensemble ce que ton équipe saura reprendre. Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Tech lead / architecte fullstack freelance à temps partiel',
        description:
          'Un tech lead ou architecte senior dans ton équipe, 1 à 4 jours par semaine : PHP/Symfony, Node.js/TypeScript, React. Taux journalier publié.',
      },
      heading: 'Renfort senior : un tech lead à temps partiel dans ton équipe',
      priceHeading: 'Combien coûte un tech lead à temps partiel ?',
      sentences: [
        "« On a besoin de quelqu'un de senior, mais pas à plein temps. »",
        "« L'équipe est bonne ; il lui manque quelqu'un qui tranche l'architecture. »",
      ],
      delivered: [
        {
          title: 'Deux semaines pour comprendre',
          text: "Je lis le système et rencontre l'équipe avant de proposer.",
        },
        {
          title: "Un lead dans l'équipe",
          text: 'Revues, décisions écrites, priorités tranchées, les mêmes jours chaque semaine.',
        },
        {
          title: 'Du code livré',
          text: 'Pas seulement des avis : je livre et je me fais relire.',
        },
        {
          title: 'Une sortie propre',
          text: 'Je pars en laissant la trace écrite qui permet de continuer sans moi.',
        },
      ],
      estimator: {
        dimensions: {
          days: {
            label: 'Jours par semaine',
            options: {
              '1': '1 jour',
              '2': '2 jours',
              '3': '3 jours',
              '4': '4 jours',
            },
          },
        },
        amounts: { monthly: 'Par mois' },
      },
      rules: ['{maxDays} jours par semaine au maximum, quel que soit le client.'],
      dayRate: {
        label: 'Taux journalier :',
        note: 'le même pour un client direct et pour une agence.',
      },
      notTheRightChoice: [
        {
          text: 'Le travail est un projet bien délimité : une {offer} sera plus claire.',
          offer: 'migration',
        },
        {
          text: "Tu n'as pas d'équipe technique : la {offer} est faite pour ça.",
          offer: 'takeover',
        },
      ],
      faq: [
        {
          question: 'Combien de jours au minimum ?',
          answer: "Un jour par semaine. En dessous, on ne suit plus le rythme de l'équipe.",
        },
        {
          question: 'Tu travailles à distance ?',
          answer:
            "Oui, par défaut, depuis huit ans. Et je viens volontiers chez toi : une journée sur place vaut souvent mieux qu'une semaine d'échanges.",
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
  },

  publicSectorPage: {
    meta: {
      title: 'Développeur fullstack pour collectivités et établissements publics',
      description:
        'Collectivités, établissements publics, structures subventionnées : reprise, maintenance et évolution de tes applications métier. Réversibilité, accessibilité RGAA, prix publics.',
    },
    kicker: 'Collectivités',
    title: 'Collectivités et établissements publics : tes applications métier, reprises et tenues',
    plain:
      "Le logiciel d'un service, le portail d'une régie, l'outil d'une structure subventionnée : je les reprends, les maintiens et les fais évoluer, avec ce qu'exige l'achat public.",
    points: [
      {
        title: 'Un achat simple',
        text: "Mes offres d'entrée, comme l'audit, restent sous le seuil des marchés passés sans publicité ni mise en concurrence préalables. Un devis suffit pour commencer.",
      },
      {
        title: 'La réversibilité, par écrit',
        text: "Code, accès, tests, documentation et décisions écrites t'appartiennent. Tes agents ou un autre prestataire reprennent derrière moi.",
      },
      {
        title: 'Accessibilité',
        text: "Ce que je construis ou reprends vise le RGAA, avec des tests d'accessibilité automatiques à chaque livraison.",
      },
      {
        title: 'Hébergement et données',
        text: "Hébergement en France ou dans l'Union européenne, chez l'hébergeur de ton choix. Aucune donnée ne part chez un service tiers sans ton accord.",
      },
    ],
    proof: {
      heading: 'Déjà au service du public',
      items: [
        {
          title: 'La Cartonnerie, à Reims',
          text: "Pour cette scène de musiques actuelles (SMAC), j'ai accompagné le responsable artistique face au prestataire : cadrage technique des premières étapes d'une application qui suit les musiciens de l'album à la scène, et besoins du produit traduits en langage technique.",
        },
        {
          title: 'Un annuaire associatif, tiré des sites publics',
          text: "31 273 associations d'Ille-et-Vilaine recensées en 40 secondes, depuis les données ouvertes et les sites des communes.",
        },
        {
          title: 'Le site officiel de Grandrupt',
          text: 'Un village, trois langues, des actualités publiées par la mairie elle-même. En bénévolat.',
        },
        {
          title: 'Civic tech, bénévolat',
          text: "Trois applications associatives auditées, dont une boutique qui encaisse des paiements ; les failles critiques corrigées. Et un CRM repris en entier à deux développeurs, en production : plus de 1 000 membres s'y connectent en SSO pour suivre leurs démarches.",
        },
      ],
    },
    offers: 'Ce que tu peux me confier',
    offerLink: "Voir l'offre",
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes sur ton application.',
      text: "Je te dis franchement si je peux aider et sous quelle forme d'achat.",
      cta: 'Réserver un appel',
      orWrite: 'Tu préfères écrire ?',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },
  partnersPage: {
    meta: {
      title: 'Sous-traitance fullstack PHP/Symfony et Node.js en marque blanche',
      description:
        'Agences web et ESN : un développeur fullstack senior en renfort sur tes missions, PHP/Symfony, Node.js ou React, en marque blanche, au taux journalier publié. CV sur demande.',
    },
    kicker: 'Partenaires',
    title: 'Agences et sociétés de services : un renfort senior en marque blanche',
    plain:
      'Un besoin senior chez ton client, pour quelques semaines ou quelques mois ? Je rejoins ta mission.',
    points: [
      {
        title: 'Marque blanche acceptée',
        text: 'Sous ton nom, chez ton client. Tu gardes la relation.',
      },
      {
        title: 'Tes conventions, pas les miennes',
        text: 'Ton code, tes outils, tes rituels, dès le premier jour.',
      },
      {
        title: 'CV sur demande',
        text: 'Envoyé par e-mail, dans le format de ton dossier si besoin.',
      },
    ],
    dayRate: {
      label: 'Taux journalier :',
      note: 'le même que pour un client direct, {maxDays} jours par semaine au maximum.',
    },
    offers: 'Ce que tu peux me confier',
    offerLink: "Voir l'offre",
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes sur ton client.',
      text: 'Je te dis franchement si je suis la bonne personne. Réponse sous 48 h ouvrées.',
      cta: 'Réserver un appel',
      orWrite: 'Pour le CV, ou pour écrire :',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Parlons de ton application.',
    blurb:
      'Un appel de 30 minutes, gratuit : je te dis franchement si je peux aider. Au pire, tu as perdu une demi-heure.',
    cta: 'Réserver un appel',
    orReach: 'Ou, si tu préfères :',
    revealPhone: 'Afficher le numéro',
    locationLine: 'Grand Est, France · Sur place à {towns} · À distance depuis 8 ans',
  },

  footer: {
    legalHeading: 'Mentions légales',
    hostedBy: 'Site hébergé par',
    siretLabel: 'SIRET',
    vatLabel: 'TVA',
    landmark: 'Informations sur le site',
  },
} satisfies ResumeContent;
