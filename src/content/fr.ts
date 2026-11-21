import type { ResumeContent } from './types.ts';

/*
 * `{credit}`, `{dayRate}`, `{maxDays}` and `{evolutionDays}` are read from
 * prices.ts when the page is built (src/lib/price-tokens.ts): a price is never
 * copied into prose.
 */
export const fr = {
  meta: {
    title: 'Thomas Bouzy — Ingénieur logiciel, Nancy et Strasbourg',
    description:
      "Ingénieur logiciel, j'outille le métier des PME : des ateliers IA pour dirigeants, puis la reprise et l'évolution de vos logiciels métier, même celui que plus personne n'ose toucher. Sur place de Nancy à Strasbourg.",
  },

  a11y: {
    skipToContent: 'Aller au contenu',
    languageSwitcher: 'Langue',
    switchToOther: 'Read in English',
    breadcrumb: "Fil d'Ariane",
    mainNavigation: 'Principale',
    portraitAlt: 'Portrait de Thomas Bouzy',
    otherHome: 'Home page in English',
  },

  nav: {
    home: 'Accueil',
    offers: 'Offres et prix',
    partners: 'Partenaires',
    publicSector: 'Collectivités',
    work: 'Références',
    about: 'À propos',
    contact: 'Réserver un appel',
  },

  hero: {
    role: 'Ingénieur logiciel',
    region: 'Grand Est',
    title: "J'outille le métier des PME",
    blurb: "Je commence par un atelier : vous voyez ce que l'IA change chez vous.",
    ctaBook: 'Réserver un appel gratuit',
    ctaSecondary: 'Voir les ateliers',
    proof:
      "J'étais dans l'équipe qui a maintenu l'ERP de plusieurs usines ArcelorMittal, puis dans celle qui a rendu traçable l'argent de 1,5 million d'utilisateurs. J'ai enseigné la programmation à l'Université de Reims.",
  },

  workshops: {
    nav: 'Ateliers',
    kicker: 'Ateliers IA pour dirigeants',
    title: "Appliquez l'IA à votre propre entreprise.",
    plain:
      "Des ateliers pratiques, pas une conférence : c'est vous qui travaillez, sur votre entreprise.",
    levels: [
      {
        title: 'Une matinée découverte',
        text: "En petit groupe de six à huit dirigeants, sur des cas comme les vôtres : vous repérez ce que l'IA peut alléger.",
      },
      {
        title: "Un atelier d'une journée",
        text: "Chez vous, sur vos dossiers. Vous repartez avec un écrit : ce que l'IA peut faire et ce qu'elle ne doit pas toucher.",
      },
      {
        title: 'Un suivi',
        text: 'Ensuite, sur votre cas réel.',
      },
    ],
    practice:
      "Je me sers de l'IA chaque jour pour construire des logiciels : je sais où elle se trompe.",
    status: 'Les dates et le prix seront annoncés ici.',
    notify: {
      text: 'Être prévenu des premières sessions ?',
      label: 'Écrivez-moi.',
      subject: 'Ateliers IA : me prévenir des premières sessions',
    },
  },

  failureModes: [
    {
      quote: "« Celui qui a fait notre appli est parti et plus personne n'ose y toucher. »",
      offer: 'takeover',
    },
    {
      quote: "« La mise à jour, c'est toujours pour le trimestre prochain. »",
      offer: 'migration',
    },
    {
      quote: '« Le stock ne tombe jamais juste et personne ne sait pourquoi. »',
      offer: 'reliability',
    },
    {
      quote: '« Ce sont nos clients qui trouvent les bugs. »',
      offer: 'reliability',
    },
    {
      quote: "« Le jour de l'opération commerciale, tout tombe. »",
      offer: 'scaling',
    },
  ],

  work: {
    kicker: 'Références',
    title: "Des logiciels qui ne pouvaient pas s'arrêter",
    intro: 'Industrie, finance, grands comptes, associations, une commune.',
    labelPlain: 'En clair :',
    labelApproach: 'Approche',
    approachFor: 'pour les équipes techniques',
    labelResult: 'Résultat',
    more: 'Voir les {count} autres références',
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
      title: "Refaire un produit en service sans que ses utilisateurs s'en aperçoivent",
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
      id: 'acquired-app-migration',
      title: "Faire entrer une application rachetée dans l'écosystème de l'entreprise",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Reprendre une application écrite par d'autres et la migrer vers les systèmes de l'entreprise qui l'a rachetée.",
    },
    {
      id: 'enterprise-onboarding',
      title: 'Démarrer un nouveau grand compte en une journée',
      org: 'Kiss The Bride',
      period: 'Janv. 2018 – Avril 2022',
      plain:
        "Chaque nouveau client demandait un paramétrage à la main ; c'est désormais l'affaire d'une journée.",
      approach:
        "Un monolithe Symfony 2.7 sans aucun test. Les tests d'abord, puis Symfony 4 avec API Platform et React, sans arrêt ; mise en route automatisée en Node.js et Jenkins.",
      result: 'Classements diffusés en direct via Mercure. Quatre juniors encadrés deux ans.',
    },
    {
      id: 'codebase-audit',
      title: "Auditer une base de code qui n'est pas la mienne",
      org: 'Projets citoyens, bénévolat',
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
      nature: 'En poste chez Quadra Informatique',
      sector: 'Industrie',
      period: '2016 – 2017',
      headline: "L'ERP de plusieurs usines, maintenu en service, des fournisseurs aux factures.",
    },
    socios: {
      name: 'Socios.com (Chiliz)',
      nature: 'En poste',
      sector: "Finance · 1,5 million d'utilisateurs",
      period: '2022 – 2026',
      headline:
        "Un produit refait sans coupure, chaque mouvement d'argent tracé, les bugs remontés divisés par quatre.",
    },
    'kiss-the-bride': {
      name: 'Kiss The Bride',
      nature: "En mission d'indépendant",
      sector: 'Logiciel en ligne pour grands comptes',
      period: '2018 – 2022',
      headline:
        "Un nouveau grand compte en une journée, sur un logiciel repris sans jamais l'arrêter.",
    },
    'civic-tech': {
      name: 'Projets citoyens',
      nature: 'Bénévolat',
      sector: 'Associations',
      period: '2026',
      headline: 'Trois applications auditées, 17 failles trouvées, les plus graves corrigées.',
    },
    'open-data': {
      name: 'Annuaire associatif',
      nature: 'Pour un client',
      sector: 'Données publiques',
      period: '2026',
      headline: "31 273 associations recensées en 40 secondes, au lieu d'un relevé à la main.",
    },
    'quart-de-tour': {
      name: 'Quart de tour',
      nature: 'Produit personnel',
      sector: 'Menuiserie',
      period: '2026',
      headline: 'Un escalier en bois calculé en ligne, du plan aux fichiers de découpe.',
    },
    grandrupt: {
      name: 'Village de Grandrupt',
      nature: 'Bénévolat',
      sector: 'Collectivité',
      period: '2026',
      headline: "Le site officiel d'un village, en trois langues.",
    },
  },

  about: {
    kicker: 'À propos',
    title: 'Qui décroche',
    paragraphs: [
      "Quand vous appelez, c'est moi qui décroche. Depuis une douzaine d'années, je construis et je maintiens des logiciels dont des entreprises dépendent chaque jour.",
    ],
    more: 'Lire la suite',
    careerLink: 'Mon parcours complet est sur LinkedIn.',
  },

  languages: [
    { name: 'Français', level: 'langue maternelle' },
    { name: 'Anglais', level: 'C1 — professionnel complet' },
    { name: 'Allemand', level: 'B1 — bases professionnelles' },
  ],

  schema: {
    jobTitle: 'Ingénieur logiciel',
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
    title: 'Une offre par situation, chacune avec son prix.',
    question: "Vous reconnaissez l'une de ces phrases ?",
    situations: [
      {
        title: 'Votre logiciel vous pose problème',
        lead: "Je reprends et fais évoluer vos logiciels métier, même celui que plus personne n'ose toucher. Sans l'arrêter, sans tout réécrire.",
      },
      {
        title: 'Il vous manque un outil',
        sentence: '« Toute notre activité tient sur un fichier Excel. »',
      },
      { title: 'Vous avez une équipe technique ?' },
    ],
    more: "Voir l'offre et le prix",
    from: {
      fee: 'à partir de',
      setup: 'à partir de',
      plan: 'dès',
      monthly: 'à partir de',
    },
    followedBy: 'puis',
    start: 'Par où commencer',
    inFrench: '(en français)',
    publicSector: 'Une collectivité ?',
    publicSectorLink: 'Voir la page dédiée',
    partners: 'Agence ou société de services ?',
    partnersLink: 'Voir la page partenaires',
  },

  offers: {
    audit: {
      name: 'Audit',
      plain:
        'Un avis écrit, sans refonte à vendre : ce qui peut vous coûter cher et par quoi commencer.',
    },
    takeover: {
      name: 'Reprise et maintenance',
      plain:
        'Je reprends votre application sans rien casser, puis je la maintiens au mois, sans engagement.',
    },
    migration: {
      name: 'Migration sans interruption',
      plain:
        "Je mets votre logiciel à jour par étapes, sans l'arrêter, avant que la facture ne grossisse.",
      phase: 'plan',
    },
    reliability: {
      name: 'Fiabilisation',
      plain: "Vous savez d'où vient un écart de stock et vous voyez un bug avant vos clients.",
    },
    scaling: {
      name: 'Tenue en charge',
      plain: 'Je reproduis votre pic avant le jour J, puis je corrige ce qui cède en premier.',
      phase: 'diagnostic',
    },
    build: {
      name: 'Création sur mesure',
      plain: "Je construis l'outil qui vous manque, pensé pour que vous ne dépendiez pas de moi.",
      phase: 'cadrage',
    },
    reinforcement: {
      name: 'Renfort senior',
      plain: 'Je rejoins votre équipe 1 à {maxDays} jours par semaine, pour trancher et livrer.',
    },
  },

  offerPage: {
    sentences: 'Vous vous reconnaissez ici ?',
    delivered: 'Ce que vous recevez',
    disclaimer: 'Ordre de grandeur, pas un devis.',
    tableCaption: 'Toutes les fourchettes, hors taxes',
    excludingVat: 'HT',
    perMonth: '/ mois',
    weekOne: 'semaine',
    weekMany: 'semaines',
    notTheRightChoice: 'Pas le bon choix si…',
    achievements: 'Ce qui le prouve',
    faq: 'Questions fréquentes',
    who: "C'est moi qui décroche : Thomas Bouzy, ingénieur logiciel dans le Grand Est.",
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes, gratuit.',
      text: 'Je vous dis franchement si cette offre est la bonne et sinon laquelle.',
      cta: 'Réserver un appel',
      orWrite: 'Vous préférez écrire ?',
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
      heading: 'Audit technique de votre application',
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
          depth: {
            label: 'Profondeur',
            options: { express: 'Express', full: 'Complet' },
            notes: {
              express:
                "Moins de trois jours sur l'application qui vous inquiète le plus, quelle que soit la taille du système.",
              full: 'Tout le système, au prix de sa taille réelle. Le devis est ferme avant de commencer.',
            },
          },
          size: {
            label: 'Taille du système',
            options: {
              small: 'Une application',
              medium: 'Quelques applications',
              large: 'Une plateforme',
            },
          },
        },
        amounts: { fee: "Prix de l'audit" },
        duration: 'Durée',
      },
      rules: [
        "Si vous me confiez ensuite la mission qui en découle, je déduis de son prix {credit} payés pour l'audit.",
      ],
      notTheRightChoice: [
        {
          text: "Votre application n'a plus personne pour s'en occuper : la {offer} commence par là.",
          offer: 'takeover',
        },
        {
          text: "Vous cherchez la validation d'une décision déjà prise : l'audit dira ce qu'il trouve.",
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
            "L'express est borné à moins de trois jours, sur l'application qui vous inquiète le plus. Le complet dépend de la taille réelle du système ; son devis est ferme avant de commencer.",
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
          "Votre prestataire est parti, plus personne n'ose toucher l'application ? Reprise, filet de tests, puis maintenance mensuelle sans engagement, à prix publié.",
      },
      heading: 'Reprise et maintenance de votre logiciel métier',
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
          text: "Chaque mois : sécurité, surveillance et jusqu'à une demi-journée d'incidents corrigés. L'Évolution ajoute {evolutionDays} jours pour vos demandes.",
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
        daysIncluded: 'Veille + {days} jours pour vos demandes',
        total: { label: 'Première année', note: 'La mise en place, puis douze mois de formule.' },
      },
      rules: [
        "En Veille, les tests couvrent les fonctions vitales ; en Évolution, toute l'application, qui va changer : sa mise en place coûte plus cher.",
        "Au-delà de la formule, c'est {dayRate} HT la journée, après votre accord. Les jours non utilisés ne se reportent pas.",
        'Si un Audit a précédé, {credit} sont déduits de la mise en place.',
      ],
      notTheRightChoice: [
        {
          text: "Vous envisagez un logiciel du marché : un {offer} vous dira d'abord si c'est le bon calcul.",
          offer: 'audit',
        },
        {
          text: 'Votre équipe technique est en place : le {offer} lui conviendra mieux.',
          offer: 'reinforcement',
        },
      ],
      proof: {
        'enterprise-onboarding':
          "Un logiciel pour grands comptes qui n'avait aucun test, repris sans jamais l'arrêter.",
      },
      faq: [
        {
          question: 'Est-ce de la TMA ? Pour quelles technologies ?',
          answer:
            "Oui : une maintenance mensuelle d'applications web, même anciennes. Mon terrain, c'est PHP et Symfony ; Node.js, TypeScript et React aussi. Python, pour l'instant en projets personnels. Pas de WinDev ni d'Access.",
        },
        {
          question: "Faut-il récupérer le code auprès de l'ancien prestataire ?",
          answer:
            "Oui, d'abord. S'il a disparu, on cherche sur le serveur et dans les sauvegardes ; la carte dit ce qui manque.",
        },
        {
          question: 'Et quand ça plante ?',
          answer:
            "Je réponds sous 48 heures ouvrées ; un incident bloquant passe avant le reste. Pas d'astreinte la nuit ni le week-end.",
        },
        {
          question: 'Et pendant vos congés ?',
          answer:
            'Je vous préviens un mois avant ; les mises à jour urgentes sont faites avant mon départ.',
        },
        {
          question: 'Et si vous partez à votre tour ?',
          answer:
            "La carte, les accès, les tests et la documentation vous appartiennent : un autre développeur reprend là où je m'arrête.",
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
          "Montée de version Symfony ou PHP sur un système qui ne peut pas s'arrêter : plan à prix fixe, puis exécution avec votre équipe. Prix publics.",
      },
      heading: 'Migration Symfony et PHP sans interruption',
      priceHeading: 'Combien coûte une migration Symfony ?',
      sentences: [
        "« On est bloqués sur une version de PHP qui n'a plus de correctifs de sécurité. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : un plan chiffré',
          text: 'Les étapes de votre montée de version PHP ou Symfony, leurs risques et leur retour arrière. Il vous appartient.',
        },
        {
          title: 'Phase 2 : la migration, avec votre équipe',
          text: "Étape par étape, tests manquants d'abord ; ancien et nouveau cohabitent le temps qu'il faut.",
        },
        {
          title: 'Une équipe qui saura refaire',
          text: "L'ancien code retiré et une équipe qui n'aura plus besoin de moi la prochaine fois.",
        },
      ],
      estimator: {
        dimensions: {
          gap: {
            label: 'Écart de version de Symfony',
            options: {
              one: 'Une version majeure',
              two: 'Deux versions majeures',
              'three-plus': 'Trois ou plus',
            },
          },
          coverage: {
            label: 'Couverture de tests existante',
            options: { good: 'Bonne', partial: 'Partielle', none: 'Aucune' },
            help: "La part du logiciel vérifiée par des tests automatiques. Vous ne savez pas ? Choisissez « Aucune » : c'est l'estimation haute.",
          },
        },
        amounts: { plan: 'Plan, phase 1 à prix fixe' },
        duration: 'Exécution, avec votre équipe',
        total: {
          label: 'Budget total',
          note: "Le plan, puis l'exécution à {maxDays} jours par semaine au plus.",
        },
      },
      rules: [
        "La Migration se vend en deux phases : un plan à prix fixe, ferme avant de commencer, puis l'exécution à {dayRate} HT la journée. Vous décidez de la seconde, plan et plafond écrit en main.",
        "Pendant l'exécution, je travaille jusqu'à {maxDays} jours par semaine avec votre équipe.",
      ],
      notTheRightChoice: [
        {
          text: "Votre application peut s'arrêter un week-end sans dommage : sa mise à jour entre dans la {offer}, pour moins cher.",
          offer: 'takeover',
        },
        {
          text: 'Vous voulez le remplacer plutôt que le faire évoluer : un {offer} éclairera ce choix.',
          offer: 'audit',
        },
      ],
      proof: {
        'enterprise-onboarding':
          "Un logiciel sans aucun test, mis à jour de deux versions majeures sans jamais l'arrêter : les tests d'abord.",
      },
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
      heading: 'Expliquer chaque écart, au lieu de le deviner',
      priceHeading: "Combien coûte la fiabilisation d'une application ?",
      sentences: ["« On a facturé deux fois le même client et personne ne l'a vu. »"],
      delivered: [
        {
          title: 'Les flux qui comptent, choisis ensemble',
          text: 'Ceux où un écart coûte : stock, facturation, paiements.',
        },
        {
          title: 'Chaque mouvement gardé et daté',
          text: "Pour chaque écart, vous retrouvez l'opération qui l'a causé.",
        },
        {
          title: 'Plus de doublons',
          text: "Une commande ou un paiement reçu deux fois n'est enregistré qu'une fois.",
        },
        {
          title: 'Des alertes avant vos clients',
          text: 'Et des équipes qui savent les lire quand je pars.',
        },
      ],
      estimator: {
        dimensions: {
          flows: {
            label: 'Flux à fiabiliser',
            options: { few: '1 à 2', some: '3 à 5', many: '6 à 10' },
            notes: {
              few: "Un flux, c'est le chemin d'un mouvement d'un bout à l'autre : de la commande au stock, du paiement au solde.",
              some: "Les flux d'un même métier, par exemple la commande, le stock et la facture.",
              many: "Les flux d'argent et de marchandise de tout un système, souvent répartis sur plusieurs services.",
            },
          },
        },
        amounts: { fee: 'Prix' },
        duration: 'Durée',
      },
      rules: [
        'Le prix est fixé avant de commencer, une fois les flux choisis ensemble.',
        'Si un Audit a situé le problème, {credit} de son prix sont déduits.',
      ],
      notTheRightChoice: [
        {
          text: "Vous ne savez pas encore où est le problème : un {offer} le situera d'abord.",
          offer: 'audit',
        },
        {
          text: "Vos chiffres sont justes mais le système ralentit ou tombe au pic : la {offer} s'en occupe.",
          offer: 'scaling',
        },
        {
          text: "Vous cherchez seulement un outil de supervision à installer : ce n'est qu'un moyen.",
        },
      ],
      faq: [
        {
          question: "Qu'est-ce qu'une double exécution, concrètement ?",
          answer:
            "Un virement recrédité, un lot déstocké deux fois. Elle se corrige sur un système qui tourne : chaque traitement apprend à reconnaître ce qu'il a déjà fait.",
        },
        {
          question: "Faut-il changer d'outil de supervision ?",
          answer:
            "Rarement. On part de ce que vous avez : l'essentiel est de savoir quoi observer.",
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
          'Votre application ralentit ou tombe aux pics de trafic ? Tir de charge, goulot trouvé, corrections mesurées : diagnostic à prix fixe. Prix publics.',
      },
      heading: 'Montée en charge et haute disponibilité de votre application',
      priceHeading: 'Combien coûte un diagnostic de montée en charge ?',
      sentences: [
        "« Ça rame dès qu'on a du monde. »",
        "« On a doublé les serveurs et ça n'a rien changé. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : un tir de charge qui reproduit votre pic',
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
          text: "Si une pièce lâche, le reste continue de tourner, en mode réduit. Vous gardez le test de charge et la marche à suivre en cas d'incident.",
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
            help: "Ce que vous mesurez déjà du logiciel en marche : erreurs, lenteurs, alertes. Vous ne savez pas ? Choisissez « Aucune » : c'est l'estimation haute.",
          },
        },
        amounts: { plan: 'Diagnostic, phase 1 à prix fixe' },
        duration: 'Durée des corrections',
        total: {
          label: 'Budget total',
          note: 'Le diagnostic, puis les corrections à {maxDays} jours par semaine au plus.',
        },
      },
      rules: [
        'Une Tenue en charge commence toujours par un tir de charge qui reproduit le pic, avant toute modification.',
        'Elle se vend en deux phases : le diagnostic à prix fixe, puis les corrections à {dayRate} HT la journée. Vous décidez de la seconde, diagnostic et plafond écrit en main.',
      ],
      notTheRightChoice: [
        {
          text: "Le problème est un chiffre faux, pas un système lent : la {offer} s'en occupe.",
          offer: 'reliability',
        },
        {
          text: "Vous ne savez pas encore où est le problème : un {offer} le situera d'abord.",
          offer: 'audit',
        },
      ],
      proof: {
        'wallet-event-sourcing':
          'Plus de 1 000 transactions par minute, des pics de 10 000 à 20 000 utilisateurs testés en charge.',
      },
      faq: [
        {
          question: 'Ajouter des serveurs ne suffit-il pas ?',
          answer:
            "Rarement. Si le goulot est la base de données ou un service externe, dix serveurs l'attendent ensemble. Le tir de charge dit où il est.",
        },
        {
          question: 'Pourquoi la supervision existante pèse-t-elle sur le prix ?',
          answer:
            "Sans métriques, il faut d'abord instrumenter le système pour voir ce qui cède. C'est du travail avant le premier chiffre et pour mesurer chaque correction.",
        },
        {
          question: 'Le tir de charge risque-t-il de faire tomber la production ?',
          answer:
            "Il se fait sur une copie fidèle, ou en production par paliers, hors des heures d'affluence, avec un arrêt prêt.",
        },
        {
          question: 'Et techniquement ?',
          answer:
            "Contre-pression sur les files, disjoncteurs, mode dégradé : dans un système distribué, une pièce qui lâche n'emporte plus le reste. Le scénario de charge reste dans votre CI, avec un runbook d'incident.",
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
        title: 'Création sur mesure de logiciel métier, front et back',
        description:
          'Un logiciel métier neuf, front et back, construit pour être repris : cadrage à prix fixe, puis développement à la journée. Prix publics.',
      },
      heading: "Création sur mesure : l'outil métier qui vous manque",
      priceHeading: 'Combien coûte un outil métier neuf ?',
      sentences: [
        '« Toute notre activité tient sur un fichier Excel que tout le monde modifie en même temps. »',
        "« On a l'idée du service, pas l'équipe pour le construire. »",
      ],
      delivered: [
        {
          title: 'Phase 1 : le cadrage, à prix fixe',
          text: "L'architecture, les décisions écrites et un premier squelette qui tourne de bout en bout. Il vous appartient.",
        },
        {
          title: 'Phase 2 : la construction, testée dès la première semaine',
          text: 'Livrée par étapes que vous utilisez, pas en un bloc à la fin.',
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
              medium: 'Un logiciel métier',
              large: 'Un service critique',
            },
          },
          integrations: {
            label: 'Systèmes à relier',
            options: { none: 'Aucun', few: '1 ou 2', many: '3 ou plus' },
          },
        },
        amounts: { plan: 'Cadrage, phase 1 à prix fixe' },
        duration: 'Durée de la construction, à la journée',
        total: {
          label: 'Budget total',
          note: 'Le cadrage, puis la construction à {maxDays} jours par semaine au plus.',
        },
      },
      rules: [
        "Une Création sur mesure ne remplace jamais un système qui tourne : celui-là relève d'une Migration, ou d'abord d'un Audit.",
        'Elle se vend en deux phases : le cadrage à prix fixe, puis la construction à {dayRate} HT la journée. Vous décidez de la seconde, cadrage et plafond écrit en main.',
      ],
      notTheRightChoice: [
        {
          text: 'Votre application existe déjà et tourne : la {offer} la mettra à jour étape par étape, au lieu de la remplacer.',
          offer: 'migration',
        },
        {
          text: "Un logiciel du marché fait déjà le travail : prenez-le. Si vous hésitez, l'appel gratuit sert aussi à trancher.",
        },
      ],
      faq: [
        {
          question: 'Combien coûte la construction ?',
          answer:
            "Elle se facture à {dayRate} HT la journée, {maxDays} jours par semaine au plus : le budget total de l'estimateur est donc un plafond. Le cadrage le précise par écrit avant que vous décidiez de la suite.",
        },
        {
          question: "Notre ERP vient d'un éditeur et nous n'avons pas son code. Ça bloque ?",
          answer:
            'Non. Je travaille autour : ses exports, des liaisons avec vos autres outils, des automatisations.',
        },
        {
          question: 'Pourquoi le nombre de systèmes à relier pèse-t-il sur le prix ?',
          answer:
            "Chaque système à relier (ERP, paiement, comptabilité) a ses règles, ses pannes et ses délais. C'est là qu'un projet dérape, plus souvent que dans les écrans.",
        },
        {
          question: "Et une fois l'application livrée ?",
          answer:
            'Votre équipe ou une autre la reprend avec les tests et les décisions écrites, ou je la maintiens au mois, avec la Reprise et maintenance.',
        },
        {
          question: 'Sur quelles technologies ?',
          answer:
            "On choisit ensemble ce qu'une équipe saura reprendre après moi. Mon terrain, c'est PHP et Symfony ; je travaille aussi en Node.js, TypeScript et React. Python, pour l'instant en projets personnels.",
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Tech lead / architecte à temps partiel, PHP/Symfony et Node.js',
        description:
          'Un tech lead ou architecte senior dans votre équipe, 1 à 4 jours par semaine : PHP/Symfony, Node.js/TypeScript, React. Taux journalier publié.',
      },
      heading: 'Renfort senior : un tech lead à temps partiel dans votre équipe',
      priceHeading: 'Combien coûte un tech lead à temps partiel ?',
      sentences: [
        "« On a besoin de quelqu'un de senior, mais pas à plein temps. »",
        "« L'équipe est bonne ; il lui manque quelqu'un qui tranche l'architecture. »",
      ],
      delivered: [
        {
          title: 'Les premiers jours pour comprendre',
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
        amounts: { monthly: 'Votre budget' },
        daysIncluded: 'Environ {days} jours au taux journalier',
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
          text: "Vous n'avez pas d'équipe technique : la {offer} est faite pour ça.",
          offer: 'takeover',
        },
      ],
      proof: {
        'enterprise-onboarding':
          'Quatre développeurs débutants encadrés pendant deux ans, sur un logiciel pour grands comptes.',
      },
      faq: [
        {
          question: 'Combien de jours au minimum ?',
          answer: "Un jour par semaine. En dessous, on ne suit plus le rythme de l'équipe.",
        },
        {
          question: 'Vous travaillez à distance ?',
          answer:
            "Oui, par défaut, depuis huit ans. Et je viens volontiers chez vous : une journée sur place vaut souvent mieux qu'une semaine d'échanges.",
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
      title: 'Ingénieur logiciel pour collectivités et établissements publics',
      description:
        'Collectivités, établissements publics, structures subventionnées : reprise, maintenance et évolution de vos applications métier. Réversibilité, accessibilité RGAA, prix publics.',
    },
    kicker: 'Collectivités',
    title: 'Collectivités et établissements publics : vos applications métier, reprises et tenues',
    plain:
      "Le logiciel d'un service, le portail d'une régie, l'outil d'une structure subventionnée : je les reprends, les maintiens et les fais évoluer, avec ce qu'exige l'achat public.",
    points: [
      {
        title: 'Un achat simple',
        text: "Mes offres d'entrée, comme l'audit, restent sous le seuil des marchés passés sans publicité ni mise en concurrence préalables. Un devis suffit pour commencer.",
      },
      {
        title: 'La réversibilité, par écrit',
        text: 'Code, accès, tests, documentation et décisions écrites vous appartiennent. Vos agents ou un autre prestataire reprennent derrière moi.',
      },
      {
        title: 'Accessibilité',
        text: "Ce que je construis ou reprends vise le RGAA, avec des tests d'accessibilité automatiques à chaque livraison.",
      },
      {
        title: 'Hébergement et données',
        text: "Hébergement en France ou dans l'Union européenne, chez l'hébergeur de votre choix. Aucune donnée ne part chez un service tiers sans votre accord.",
      },
    ],
    proof: {
      heading: 'Déjà au service du public',
      items: [
        {
          title: 'Un annuaire associatif, tiré des sites publics',
          text: "31 273 associations d'Ille-et-Vilaine recensées en 40 secondes, depuis les données ouvertes et les sites des communes.",
        },
        {
          title: 'Le site officiel de Grandrupt',
          text: 'Un village, trois langues, des actualités publiées par la mairie elle-même. En bénévolat.',
        },
        {
          title: 'Projets citoyens, bénévolat',
          text: "Trois applications associatives auditées, dont une boutique qui encaisse des paiements ; les failles critiques corrigées. Et un CRM repris en entier à deux développeurs, en production : plus de 1 000 membres s'y connectent en SSO pour suivre leurs démarches.",
        },
      ],
    },
    offers: 'Ce que vous pouvez me confier',
    offerLink: "Voir l'offre",
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes sur votre application.',
      text: "Je vous dis franchement si je peux aider et sous quelle forme d'achat.",
      cta: 'Réserver un appel',
      orWrite: 'Vous préférez écrire ?',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },
  partnersPage: {
    meta: {
      title: 'Sous-traitance PHP/Symfony et Node.js en marque blanche',
      description:
        'Agences web et ESN : un ingénieur logiciel senior en renfort sur vos missions, PHP/Symfony, Node.js ou React, en marque blanche, au taux journalier publié. CV sur demande.',
    },
    kicker: 'Partenaires',
    title: 'Agences et sociétés de services : un renfort senior en marque blanche',
    plain:
      'Un besoin senior chez votre client, pour quelques semaines ou quelques mois ? Je rejoins votre mission.',
    points: [
      {
        title: 'Marque blanche acceptée',
        text: 'Sous votre nom, chez votre client. Vous gardez la relation.',
      },
      {
        title: 'Vos conventions, pas les miennes',
        text: 'Votre code, vos outils, vos rituels, dès le premier jour.',
      },
      {
        title: 'CV sur demande',
        text: 'Envoyé par e-mail, dans le format de votre dossier si besoin.',
      },
    ],
    dayRate: {
      label: 'Taux journalier :',
      note: 'le même que pour un client direct, {maxDays} jours par semaine au maximum.',
    },
    offers: 'Ce que vous pouvez me confier',
    offerLink: "Voir l'offre",
    referrers:
      "Cabinet comptable, intégrateur ? Si l'un de vos clients a un logiciel qui coince, je fais avec lui un premier point gratuit.",
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes sur votre client.',
      text: 'Je vous dis franchement si je suis la bonne personne. Réponse sous 48 h ouvrées.',
      cta: 'Réserver un appel',
      orWrite: 'Pour le CV, ou pour écrire :',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  aboutPage: {
    meta: {
      title: 'À propos : Thomas Bouzy, ingénieur logiciel dans le Grand Est',
      description:
        'Qui décroche quand vous appelez : un ingénieur logiciel qui aime se creuser la tête sur votre problème. Direct, pédagogue, installé à la campagne dans le Grand Est.',
    },
    kicker: 'À propos',
    title: 'Thomas Bouzy, ingénieur logiciel dans le Grand Est',
    plain: "Avec le goût de comprendre l'exigence des autres.",
    paragraphs: [
      "Un stock qui ne tombe jamais juste, une appli que plus personne n'ose toucher : confiez-moi ça et je ne lâche plus.",
      "J'ai passé ma carrière sur des logiciels qui ne pouvaient pas s'arrêter : l'ERP de plusieurs usines ArcelorMittal, un logiciel pour grands comptes repris sans jamais l'arrêter, une application de 1,5 million d'utilisateurs dont chaque mouvement d'argent devait rester traçable.",
      "La tech, c'est mon outil. Ce qui m'intéresse, c'est ce dont votre entreprise a besoin et comment on le met en place sans en faire une usine à gaz.",
      "On me dit parfois trop direct. C'est vrai. Si quelque chose cloche dans votre projet, vous le saurez. (J'enrobe un peu mieux qu'avant, promis.)",
      "J'aime aussi expliquer. Pour beaucoup, le logiciel reste une boîte noire. J'ai enseigné la programmation à l'Université de Reims et formé des développeurs débutants. J'aime toujours autant lever le voile.",
      [
        'Je vis à la campagne, dans le Grand Est. Je travaille à distance depuis huit ans. Et je viens volontiers chez vous : rien ne remplace une journée sur place pour comprendre comment vous travaillez. Le reste du temps, je bricole. ',
        { href: 'https://quart-de-tour.fr', label: 'Quart de tour' },
        ', mon logiciel pour les menuisiers, est né comme ça.',
      ],
    ],
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes, gratuit.',
      text: 'Vous savez maintenant qui décroche. Je vous dis franchement si je peux aider.',
      cta: 'Réserver un appel',
      orWrite: 'Vous préférez écrire ?',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Parlons de votre entreprise.',
    blurb:
      'Un appel de 30 minutes, gratuit : je vous dis franchement si je peux aider. Au pire, vous avez perdu une demi-heure.',
    cta: 'Réserver un appel',
    orReach: 'Ou, si vous préférez :',
    revealPhone: 'Afficher le numéro',
    locationLine: 'Je viens chez vous à {towns}. Ailleurs, on avance à distance.',
  },

  footer: {
    role: 'Ingénieur logiciel',
    pages: 'Pages du site',
    legalHeading: 'Mentions légales',
    hostedBy: 'Site hébergé par',
    siretLabel: 'SIRET',
    vatLabel: 'TVA',
    landmark: 'Informations sur le site',
  },
} satisfies ResumeContent;
