import type { ResumeContent } from './types.ts';

/*
 * `{credit}`, `{dayRate}`, `{maxDays}` and `{evolutionDays}` are read from
 * prices.ts when the page is built (src/lib/price-tokens.ts): a price is never
 * copied into prose.
 */
export const fr = {
  meta: {
    title: 'Thomas Bouzy — Freelance PHP/Symfony, applications métier',
    description:
      'Je reprends, fiabilise et fais évoluer les applications métier PHP/Symfony dont votre activité dépend. Grand Est ou à distance. Prix publics.',
    ogImageAlt:
      'Thomas Bouzy — « I design transactional systems that have to stay correct while they stay up. » Backend & architecture.',
  },

  a11y: {
    skipToContent: 'Aller au contenu',
    languageSwitcher: 'Langue',
    switchToOther: 'Read in English',
    mainNavigation: 'Principale',
    portraitAlt: 'Portrait de Thomas Bouzy',
  },

  nav: {
    offers: 'Offres',
    partners: 'Partenaires',
    work: 'Réalisations',
    approach: 'Ma position',
    about: 'À propos',
    contact: 'Me contacter',
  },

  hero: {
    availability: 'Premières missions en préparation — parlons-en dès maintenant',
    title: 'Je reprends, fiabilise et fais évoluer vos applications métier.',
    blurb:
      "Même celle que plus personne n'ose toucher. Sans l'arrêter, sans tout réécrire, avec des prix affichés.",
    ctaOffers: 'Voir les offres',
  },

  problem: {
    audit: {
      text: 'Pas sûr de savoir laquelle est la vôtre ?',
      cta: 'Commencer par un audit',
    },
    kicker: 'Le problème',
    title: "Vous reconnaissez l'une de ces phrases ?",
  },

  failureModes: [
    {
      quote: "« Celui qui a fait notre appli est parti, et plus personne n'ose y toucher. »",
      text: "L'application orpheline. Personne ne la connaît plus, et chaque modification devient un pari.",
      offer: 'takeover',
    },
    {
      quote: "« La montée de version, c'est toujours pour le trimestre prochain. »",
      text: "La migration qui n'arrive jamais. Le système ne peut pas s'arrêter, alors on repousse, et la facture grossit.",
      offer: 'migration',
    },
    {
      quote: '« Le stock ne tombe jamais juste, et personne ne sait pourquoi. »',
      text: "L'écart que personne ne sait expliquer. Le logiciel donne le chiffre du jour, jamais les mouvements qui y ont mené.",
      offer: 'reliability',
    },
    {
      quote: '« Ce sont nos clients qui trouvent les bugs. »',
      text: 'Les défauts trouvés par les utilisateurs. Le bug était visible des heures plus tôt ; personne ne regardait.',
      offer: 'reliability',
    },
  ],

  position: {
    kicker: 'Ma position',
    title: 'Ce que je défends, et ce que ça coûte.',
    intro: "Chaque recommandation vient avec ce qu'elle sacrifie.",
    costLabel: 'Le coût assumé',
  },

  principles: [
    {
      title: 'Migrer par étapes, jamais tout réécrire.',
      text: 'Trois migrations majeures de Symfony sur un système en service continu, aucune en big bang.',
      cost: 'Une période où ancien et nouveau cohabitent, à ne pas laisser durer.',
    },
    {
      title: "Ce qui n'est pas instrumenté n'est pas fiable.",
      text: "OpenTelemetry et Datadog sur tous les services backend, des alertes avant la panne : les bugs remontés sont passés d'une vingtaine à cinq par mois.",
      cost: 'Du temps pris sur les livraisons, et choisir quoi surveiller.',
    },
    {
      title: "Trois niveaux d'honnêteté, jamais compressés.",
      text: "Production, projets personnels, en cours d'apprentissage : je les annonce séparément, pour que vous sachiez ce que vous achetez.",
      cost: "Une liste plus courte, et dire « pas en production » quand c'est le cas.",
    },
  ],

  work: {
    kicker: 'Réalisations',
    title: 'Des réalisations à ouvrir',
    intro: "Ouvrez une carte : ce que j'ai fait, et ce que ça a changé.",
    labelPlain: 'En clair :',
    labelApproach: 'Approche',
    labelResult: 'Résultat',
  },

  achievements: [
    {
      id: 'industrial-erp',
      title: 'Maintenir un ERP industriel en production',
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        "Veiller sur l'ERP dont un industriel dépend chaque jour, des fournisseurs aux factures.",
      approach:
        "Corrections et évolutions sur un logiciel dont l'entreprise ne pouvait se passer une journée : rien ne partait sans être vérifié.",
      result:
        "L'ERP est resté en production tout du long. C'est le cas exact pour lequel existe la Reprise.",
    },
    {
      id: 'live-api-redesign',
      title: "Refaire une API de production sans que l'utilisateur s'en aperçoive",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Reconstruire les fondations d'un produit en service, sans une coupure pour ceux qui s'en servent.",
      approach:
        "Un produit de trading lent et instable, refait par étapes : contrats d'API recentrés sur le métier, front jamais cassé. Huit sprints aux côtés de l'équipe front, en React et Next.js ; déploiement sur Kubernetes et ArgoCD à ma charge.",
      result:
        'Erreurs 500 à zéro, page utilisable en 3 secondes au lieu de 17, déploiement de 15 à 4 minutes, données achetées de 9 000 € à 3 000 € par an. Mise en production sous astreinte, incidents pilotés via Rootly.',
    },
    {
      id: 'wallet-event-sourcing',
      title: 'Event Sourcing sur les transactions wallet',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Rendre chaque mouvement d'un portefeuille traçable, au lieu de ne connaître que le solde du jour.",
      approach:
        "Des portefeuilles d'actifs réels, pour plus de 1,5 million d'utilisateurs actifs. Event Sourcing et outbox via SNS/SQS : chaque mouvement devient un fait stocké et rejouable.",
      result:
        "Plus de 1 000 transactions par minute avec une piste d'audit complète, et des pics de 10 000 à 20 000 utilisateurs en quelques minutes, testés en charge.",
    },
    {
      id: 'on-chain-operations',
      title: 'Des transactions on-chain qui engagent des fonds réels',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Un service qui place et réajuste tout seul de l'argent sur des marchés, où un ordre parti ne se rattrape pas.",
      approach:
        "Des opérations DeFi sur Solana, depuis un microservice Node.js avec le SDK Meteora et Fireblocks pour la signature. Devnet, puis fonds réels. Intégration de SDK et opération de transactions, pas d'écriture de smart contracts.",
      result:
        'En production sur fonds réels. Signature idempotente et réconciliation avec la chaîne conçues dès le départ, puis ouvertes aux autres équipes en service partagé.',
    },
    {
      id: 'enterprise-onboarding',
      title: 'Démarrer un nouveau grand compte en une journée',
      org: 'Kiss The Bride',
      period: 'Janv. 2018 – Avril 2022',
      plain:
        "Chaque nouveau client demandait un paramétrage sur mesure ; c'est désormais l'affaire d'une journée.",
      approach:
        "Un SaaS pour grands comptes, sur un monolithe Symfony 2.7 / AngularJS sans aucun test. Les tests d'abord, puis Symfony 4 avec API Platform et React, sans arrêt ; mise en route automatisée en Node.js et Jenkins.",
      result:
        'Un nouveau grand compte démarre en une journée. Classements diffusés en direct via Mercure. Quatre juniors encadrés deux ans.',
    },
    {
      id: 'codebase-audit',
      title: "Auditer une base de code qui n'est pas la mienne",
      org: 'Civic tech, bénévolat',
      period: '2026',
      plain:
        'Dire à une équipe ce qui, dans son code, peut lui coûter cher, puis corriger moi-même le plus critique.',
      approach:
        "Trois applications bénévoles, dont une boutique qui encaisse, sans aucun test. En lecture seule d'abord : quatre rapports priorisés, dont 17 points de sécurité. Puis j'ai corrigé les critiques moi-même.",
      result:
        'Le panier qui faisait confiance au navigateur est revalidé côté serveur. Paiements et authentification admin couverts par des tests, CodeQL dans le pipeline.',
    },
    {
      id: 'open-data-directories',
      title: "Annuaires associatifs depuis l'open data",
      org: 'Projet personnel',
      period: '2026',
      plain:
        "Reconstituer en quelques secondes un annuaire qu'on établissait à la main, commune par commune.",
      approach:
        "Les données ouvertes (RNA, Annuaire de l'administration), enrichies depuis les sites publics des collectivités, avec la provenance de chaque valeur. Local-first : un fichier SQLite sur la machine de l'utilisateur.",
      result:
        "Sur l'Ille-et-Vilaine, 31 273 associations de 332 communes en 40 secondes. Un pré-filtre mesuré ramène les pages à analyser de 40 % à 6,5 %.",
      link: {
        href: 'https://github.com/Birdiz/annuaire-vie-associative/releases',
        label: 'Les versions publiées',
      },
    },
  ],

  about: {
    kicker: 'À propos',
    title: 'En bref',
    paragraphs: [
      "Je travaille en PHP et Symfony, et je reprends aussi le React, le TypeScript et le Node.js qui vont avec. J'aime les sujets peu glamour : des transactions qui restent justes, des historiques qu'on peut rejouer, des migrations que personne ne remarque. Et j'écris mes décisions, pour que l'équipe continue sans moi.",
      "Je vis dans le Grand Est, à la campagne. L'écrit et l'asynchrone sont mon mode par défaut ; je me déplace quand il faut une salle.",
    ],
    mentoringKicker: 'Transmettre, un fil rouge',
    careerLine: "En poste plutôt qu'en mission ?",
    careerLink: 'Mon parcours est sur LinkedIn.',
  },

  mentoring: [
    { year: '2016', text: "Enseignant en premier cycle à l'Université de Reims." },
    { year: '2018', text: "Quatre juniors menés jusqu'à l'autonomie, chez Kiss The Bride." },
    {
      year: '2022',
      text: "Revues d'architecture pour deux équipes chez Socios : cinq développeurs et un QA.",
    },
    { year: '2024', text: 'Création de la communauté de pratique backend : RFC, ADR, standards.' },
  ],

  languages: [
    { name: 'Français', level: 'langue maternelle' },
    { name: 'Anglais', level: 'C1 — professionnel complet' },
    { name: 'Allemand', level: 'B1 — bases professionnelles' },
  ],

  schema: {
    jobTitle: 'Ingénieur logiciel senior — architecture backend',
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
    title: 'Des offres pour vos applications métier, chacune avec son prix.',
    from: 'à partir de',
    see: "Voir l'offre",
    inFrench: '(en français)',
    partners: 'Agence ou société de services ?',
    partnersLink: 'Voir la page partenaires',
  },

  offers: {
    audit: {
      name: 'Audit',
      plain:
        'Un regard extérieur, rendu par écrit : ce qui peut vous coûter cher, et par quoi commencer.',
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
    reinforcement: {
      name: 'Renfort senior',
      plain:
        'Un lead ou un architecte senior dans votre équipe, à temps partiel, facturé à la journée.',
    },
  },

  offerPage: {
    kicker: 'Offre',
    sentences: 'Vous reconnaissez-vous ici ?',
    delivered: "Ce que vous recevez, dans l'ordre",
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
      text: 'Je vous dis franchement si cette offre est la bonne, et sinon laquelle.',
      cta: 'Réserver un appel',
      orWrite: 'Vous préférez écrire ?',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  offerPages: {
    audit: {
      meta: {
        title: 'Audit de code PHP/Symfony et due diligence technique',
        description:
          "Audit d'application PHP/Symfony : rapport écrit, registre des risques, plan d'action priorisé. Prix publics, déduit de la mission qui suit.",
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
          text: 'Chaque risque, sa gravité, et le prix de le laisser en place.',
        },
        {
          title: "Un plan d'action, présenté à l'équipe",
          text: "Les corrections dans l'ordre où elles rapportent, discutées jusqu'à être comprises.",
        },
      ],
      variant: {
        title: 'Variante : la due diligence technique',
        text: 'Avant un rachat ou une levée de fonds : ce que vaut le logiciel, et ce qui pourrait surprendre après signature.',
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
        "Si vous confiez ensuite la mission qui en découle, {credit} du prix de l'audit en sont déduits.",
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
          question: "Pourquoi un prix fixe pour l'express, et une fourchette pour le complet ?",
          answer:
            "L'express est borné à moins de trois jours, sur l'application qui vous inquiète le plus. Le complet dépend de la taille réelle du système ; son devis est ferme avant de commencer.",
        },
      ],
    },
    takeover: {
      meta: {
        title: "Maintenance d'application métier : reprise, prix publics",
        description:
          "Votre prestataire est parti, plus personne n'ose toucher l'application ? Reprise, filet de tests, puis maintenance mensuelle à prix publié.",
      },
      heading: 'Reprise et maintenance de votre application métier',
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
          text: "Chaque mois : sécurité, surveillance, incidents corrigés jusqu'à une demi-journée. L'Évolution ajoute {evolutionDays} jours pour vos demandes.",
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
        amounts: { setup: 'Mise en place', monthly: 'Formule mensuelle' },
        duration: 'Durée de la mise en place',
      },
      rules: [
        "Une Reprise commence toujours par un filet de tests : on ne modifie pas ce qu'on ne sait pas vérifier.",
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
      faq: [
        {
          question: 'Est-ce de la TMA ? Pour quelles technologies ?',
          answer:
            "Oui : une maintenance mensuelle d'applications web en PHP et Symfony, même anciennes, et du React, TypeScript ou Node.js qui va avec. Pas de WinDev ni d'Access.",
        },
        {
          question: "Faut-il récupérer le code auprès de l'ancien prestataire ?",
          answer: "Oui, c'est la première chose à faire ; la carte dit ce qui manque.",
        },
      ],
    },
    migration: {
      meta: {
        title: 'Migration Symfony et PHP sans interruption de service',
        description:
          "Montée de version Symfony ou PHP sur un système qui ne peut pas s'arrêter : plan à prix fixe, puis exécution avec votre équipe.",
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
          text: "L'ancien chemin retiré, et une équipe qui n'aura plus besoin de moi la prochaine fois.",
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
        duration: 'Exécution, avec votre équipe',
      },
      rules: [
        "La Migration se vend en deux phases : un plan à prix fixe, puis l'exécution à {dayRate} HT la journée. Vous décidez de la seconde plan en main.",
      ],
      notTheRightChoice: [
        {
          text: "Le système peut s'arrêter un week-end sans dommage : une migration classique coûtera moins cher.",
        },
        {
          text: 'Vous voulez le remplacer plutôt que le faire évoluer : un {offer} éclairera ce choix.',
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
        title: "Écarts de stock, bugs en prod : fiabiliser l'application",
        description:
          "Un stock, un solde ou une facturation qui ne tombe pas juste ? Traçabilité des flux et observabilité pour expliquer l'écart. Prix publics.",
      },
      heading: 'Fiabilisation : expliquer chaque écart au lieu de le deviner',
      priceHeading: "Combien coûte la fiabilisation d'une application ?",
      sentences: ["« On a recrédité deux fois, et on ne l'a vu qu'à la réconciliation. »"],
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
          title: 'Des alertes avant vos clients',
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
          text: "Vous ne savez pas encore où est le problème : un {offer} le situera d'abord.",
          offer: 'audit',
        },
        {
          text: "Vous cherchez seulement un outil de supervision à installer : ce n'est qu'un moyen.",
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
          answer:
            "Rarement. On part de ce que vous avez : l'essentiel est de savoir quoi observer.",
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Tech lead / architecte Symfony freelance à temps partiel',
        description:
          'Un tech lead ou architecte PHP/Symfony senior dans votre équipe, 1 à 4 jours par semaine. Taux journalier publié.',
      },
      heading: 'Renfort senior : un tech lead à temps partiel dans votre équipe',
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
          text: 'Pas seulement des avis : je livre, et je me fais relire.',
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
          text: "Vous n'avez pas d'équipe technique : la {offer} est faite pour ça.",
          offer: 'takeover',
        },
      ],
      faq: [
        {
          question: 'Combien de jours au minimum ?',
          answer: "Un jour par semaine. En dessous, on ne suit plus le rythme de l'équipe.",
        },
        {
          question: 'Travaillez-vous à distance ?',
          answer: 'Oui, par défaut, avec des déplacements quand il faut une salle.',
        },
      ],
    },
  },

  partnersPage: {
    meta: {
      title: 'Sous-traitance PHP/Symfony en marque blanche pour agences',
      description:
        'Agences web et ESN : un développeur PHP/Symfony senior en renfort sur vos missions, en marque blanche, au taux journalier publié. CV sur demande.',
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
        text: 'Votre code PHP/Symfony, vos outils, vos rituels, dès le premier jour.',
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
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes sur votre client.',
      text: 'Je vous dis franchement si je suis la bonne personne. Réponse sous 48 h ouvrées.',
      cta: 'Réserver un appel',
      orWrite: 'Pour le CV, ou pour écrire :',
      serviceArea: 'Sur place à {towns} ; à distance partout ailleurs.',
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Parlons de votre application.',
    blurb:
      'Un appel de 30 minutes, gratuit : vous décrivez la situation, je vous dis franchement si je peux aider.',
    cta: 'Réserver un appel',
    revealPhone: 'Afficher le numéro',
    locationLine: 'Grand Est, France · Full remote depuis 8 ans · CET',
  },

  footer: {
    legalHeading: 'Mentions légales',
    hostedBy: 'Site hébergé par',
    siretLabel: 'SIRET',
    vatLabel: 'TVA',
    landmark: 'Informations sur le site',
  },
} satisfies ResumeContent;
