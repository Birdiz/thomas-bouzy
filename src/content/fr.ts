import type { ResumeContent } from './types.ts';

export const fr = {
  meta: {
    title: 'Thomas Bouzy — Ingénieur logiciel senior, architecture backend',
    description:
      "Je conçois des systèmes transactionnels qui doivent rester justes pendant qu'ils restent debout. Douze ans d'architecture backend — wallets event-sourcés à plus de 1 000 transactions par minute, observabilité qui a ramené les bugs de 20 à 5 par mois, et des opérations DeFi en production sur fonds réels.",
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
    work: 'Réalisations',
    approach: 'Ma position',
    about: 'À propos',
    contact: 'Me contacter',
  },

  hero: {
    availability: 'Premières missions en préparation — parlons-en dès maintenant',
    blurb:
      "Je conçois des systèmes transactionnels qui doivent rester justes pendant qu'ils restent debout. Douze ans de backend et d'architecture — flux event-driven, Event Sourcing sur les wallets, et des opérations on-chain où une erreur coûte de l'argent réel.",
    ctaWork: 'Voir les projets',
  },

  concepts: [
    {
      label: 'Traçable',
      gloss:
        'Chaque mouvement conservé comme un fait daté ; le solde se rejoue au lieu de se deviner.',
    },
    {
      label: 'Refonte invisible',
      gloss: 'Des payloads reconstruits sous leurs consommateurs, sans en casser un seul.',
    },
    {
      label: 'Empreinte',
      gloss:
        "Mémoire, CPU, poids d'image et déploiement traités comme du design, pas comme la météo.",
    },
    {
      label: 'Build-vs-buy',
      gloss: "Ce qu'on continue d'acheter, ce qu'on internalise, et où passe la ligne.",
    },
    {
      label: 'Service partagé',
      gloss: "Né du besoin d'une squad, ouvert aux autres équipes qui avaient le même.",
    },
    {
      label: 'Transmission',
      gloss: "Revues d'architecture, onboarding, une trace écrite qu'un nouveau peut contester.",
    },
  ],

  problem: {
    kicker: 'Le problème',
    title: "Le chemin nominal n'est jamais la partie intéressante.",
    paragraphs: [
      "La plupart des systèmes fonctionnent le jour de leur mise en ligne. Ce qui mérite d'être payé, c'est ce qu'ils font la nuit où un consumer rejoue deux fois le même message, où l'API d'un dépositaire part en timeout au milieu d'un transfert, ou bien où vingt mille personnes arrivent en quatre minutes.",
      "Sur un flux d'argent, ce n'est pas un problème de performance. C'est un problème comptable, réglementaire et de confiance — et quand il se manifeste, l'architecture qui l'a permis a deux ans et tout repose dessus.",
      "Les décisions qui l'évitent se prennent tôt et pour pas cher, avant que l'implémentation coûteuse ne commence : où tombent les frontières de domaine, ce qui doit être idempotent, ce qui mérite un journal d'événements et ce qui ne le mérite pas, et ce qu'on instrumente avant d'optimiser quoi que ce soit.",
    ],
  },

  failureModes: [
    {
      quote: "« On a recrédité deux fois, et on ne l'a vu qu'à la réconciliation. »",
      text: "La double exécution. Un consumer rejoue un message, et rien dans le code ne distingue le second passage du premier. Ce n'est déjà plus un incident technique à ce stade : c'est un écart comptable, avec un régulateur au bout.",
    },
    {
      quote: '« On ne sait pas expliquer comment ce solde est arrivé là. »',
      text: "Un modèle basé état. Il dit ce qu'est le solde aujourd'hui, jamais la suite de faits qui l'a produit — la seule chose que demandent réellement la finance, le support et l'audit.",
    },
    {
      quote: '« La migration est dans la roadmap depuis deux ans. »',
      text: "La réécriture qui exige une fenêtre d'arrêt. Sur un système qui ne s'arrête pas, cette fenêtre n'arrive jamais : le chantier glisse d'un trimestre à l'autre pour de bonnes raisons, pendant que le coût de l'ancien modèle continue de courir.",
    },
    {
      quote: '« On apprend nos bugs par les tickets clients. »',
      text: "Les défauts trouvés par les utilisateurs. Un bug découvert par un ticket était détectable des heures plus tôt. Ce qui n'est pas instrumenté n'est pas fiable : c'est juste non testé en production, et le client fait la recette à votre place.",
    },
  ],

  position: {
    kicker: 'Ma position',
    title: 'Cinq choses que je défends, et ce que chacune coûte.',
    intro:
      "À ce niveau, une réponse qui n'expose aucun coût sonne faux. Chaque recommandation ci-dessous vient donc avec ce qu'elle sacrifie — y compris celles que je referais sans hésiter.",
    costLabel: 'Le coût assumé',
  },

  principles: [
    {
      title: "L'architecture s'écrit.",
      text: "RFC et ADR plutôt que consensus oral. Une décision doit survivre aux gens qui l'ont prise et au fil Slack d'où elle vient, et un nouvel arrivant doit comprendre pourquoi avant de vouloir changer.",
      cost: "Plus lent au moment de décider. C'est remboursé la deuxième fois qu'on ne rejoue pas le même débat.",
    },
    {
      title: 'Migration incrémentale plutôt que réécriture.',
      text: "Trois migrations majeures de Symfony sur un système en production continue, aucune en big bang. Idem pour un contrat d'API : on le refait sous les pieds de ses consommateurs, on ne le remplace pas.",
      cost: 'Une période de cohabitation où deux modèles coexistent — et la discipline de ne pas la laisser devenir un état permanent.',
    },
    {
      title: "L'idempotence avant l'élégance.",
      text: "Sur un flux d'argent, la question n'est pas de savoir si c'est beau, mais ce qui se passe quand le message arrive deux fois. Je ne dis jamais « exactly-once » sans nuance : l'outbox, c'est at-least-once à la publication, plus des consumers idempotents — soit exactly-once du point de vue métier.",
      cost: "Des clés de déduplication, de l'état stocké et de la réconciliation à maintenir, pour un cas que, bien fait, on ne voit jamais se produire.",
    },
    {
      title: "Ce qui n'est pas instrumenté n'est pas fiable.",
      text: "Observabilité avant optimisation. On ne discute pas d'une performance qu'on n'a pas mesurée, et on ne corrige pas un défaut découvert par un ticket utilisateur. OpenTelemetry et Datadog sur l'ensemble des services backend, des dashboards par service, des alertes sur les signaux qui précèdent la panne : c'est ce qui a fait passer les bugs remontés d'une vingtaine par mois à cinq.",
      cost: "Du temps de delivery investi dans l'instrumentation, et le choix plus difficile de quoi observer — une alerte de trop tue toutes les alertes.",
    },
    {
      title: "Trois niveaux d'honnêteté, jamais compressés.",
      text: "Expérience en production, projets personnels, en cours d'apprentissage — annoncés séparément, y compris quand les confondre rendrait la candidature plus vendable. Une techno revendiquée un cran au-dessus de sa place explose au premier entretien technique sérieux, et coûte plus cher que le trou qu'elle masquait.",
      cost: 'Une liste plus courte de ce que je peux revendiquer sans réserve, et devoir dire « pas en production » sur des travaux dont je suis fier.',
    },
  ],

  work: {
    kicker: 'Réalisations',
    title: 'Des réalisations à ouvrir',
    intro:
      "Chacun est un système réel en production. Ouvrez une carte pour le contexte, l'approche et ce que ça a changé.",
    labelPlain: 'En clair :',
    labelContext: 'Contexte',
    labelApproach: 'Approche',
    labelResult: 'Résultat',
  },

  achievements: [
    {
      id: 'wallet-event-sourcing',
      title: 'Event Sourcing sur les transactions wallet',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Rendre chaque mouvement d'un portefeuille traçable un par un, au lieu de ne connaître que le solde du jour.",
      context:
        "Les wallets de fan tokens manipulaient de l'argent et des actifs réels, sur une plateforme mondiale de sport digital à plus de 1,5 million d'utilisateurs actifs. Le modèle basé état rendait impossible de répondre à « comment ce solde est-il arrivé là ? » — une question que posent la finance, le support et le régulateur.",
      approach:
        "Mise en place de l'Event Sourcing sur les flux de transactions avec un outbox pattern via SNS/SQS : chaque mouvement devient un fait stocké et rejouable plutôt qu'une ligne écrasée. Les projections reconstruisent les modèles de lecture.",
      result:
        "Plus de 1 000 transactions financières par minute avec une piste d'audit complète, une réconciliation qui a cessé d'être de l'archéologie, et des investigations qui se rejouent au lieu de se deviner. Le même flux encaisse les Fan Token Offerings — des pics de 10 000 à 20 000 utilisateurs en quelques minutes — sur des tests de charge conçus pour ça (BlazeMeter).",
    },
    {
      id: 'live-api-redesign',
      title: "Refaire une API de production sans que l'utilisateur s'en aperçoive",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Reconstruire les fondations d'un produit qui tourne, sans une coupure ni un écran cassé pour ceux qui s'en servent.",
      context:
        "Le produit FanTokens destiné aux traders était lent, instable et coûteux. Les endpoints livraient des payloads trop lourdes et pas assez orientées métier, les erreurs 500 étaient récurrentes, et la page mettait 17 secondes à devenir utilisable. Sur ce type de produit, une donnée incohérente n'est pas un défaut d'affichage : c'est une décision d'investissement prise sur une information fausse.",
      approach:
        "Refonte complète des contrats d'API autour du domaine métier, menée en migration incrémentale et non en réécriture : la contrainte forte était que la livraison reste invisible côté utilisateur, sans casser le front pendant la transition. Sur le même périmètre, fiabilisation des données de tokens servies aux traders, refonte de l'agrégation, et intégration TradingView — le backend produit des datasets propres, le front les injecte via le SDK. Le vrai livrable est un contrat de données entre deux équipes, pas une intégration de bibliothèque. Le front n'a pas été laissé aux autres pour autant : pendant huit sprints, le tech lead a rejoint cette équipe de trois comme quatrième développeur — configuration de build, optimisation d'images, features, correctifs, couverture de tests et suite e2e, en React et Next.js.",
      result:
        "Erreurs 500 récurrentes ramenées à zéro et Time To Interactive de 17 à 3 secondes, les payloads allégées et recentrées sur le métier en étant la cause principale. Image de conteneur de 1,7 Go à 200 Mo, déploiement d'une quinzaine de minutes à moins de 4, mémoire de 1 Go à quelques centaines de Mo, CPU de 2 cores à 100 millicores — le déploiement et l'empreinte d'exécution de ces services sont à ma charge, sur Kubernetes et ArgoCD, sur un cluster opéré avec l'appui de l'équipe devops. Une directive de réduction de coût sur le même périmètre, traitée par batching des appels, endpoints de masse du fournisseur et surtout internalisation d'une partie de la donnée via un client RPC maison lisant les informations de tokens directement on-chain : 9 000 € → 3 000 € par an à qualité équivalente. Mise en production sous astreinte, incidents pilotés et coordonnés via Rootly : les travaux en cours s'arrêtent jusqu'à ce que la mitigation tienne, tech leads, QA et produit dans la même pièce.",
    },
    {
      id: 'on-chain-operations',
      title: 'Des transactions on-chain qui engagent des fonds réels',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      plain:
        "Un service qui place et réajuste tout seul de l'argent sur des marchés, où un ordre parti ne se rattrape pas.",
      context:
        "Il fallait opérer depuis la plateforme des opérations DeFi sur Solana : swap, création de pool, ouverture et fermeture de positions de liquidité, claim de rewards, rebalance. Ici, une erreur ne coûte pas un nouvel essai — elle coûte de l'argent déjà parti.",
      approach:
        "Un microservice Node.js dédié, intégrant le SDK Meteora, avec lecture on-chain complète via RPC et une couche Fireblocks pour la custody et la signature des transactions — signer n'étant pas un appel de bibliothèque mais un workflow d'approbation externe, avec sa latence et ses modes d'échec propres. Mise en service progressive : devnet d'abord, puis production sur fonds réels. Périmètre dit franchement : intégration de SDK et opération de transactions, pas d'écriture de smart contracts. L'intégration de partenaires financiers tiers construite ici — dépositaires d'actifs numériques, protocoles d'échange — a ensuite été ouverte aux autres équipes en service partagé.",
      result:
        "En production sur fonds réels. La difficulté n'est pas d'émettre l'ordre : on ne contrôle ni la finalité ni le délai de confirmation, et la transaction qu'on croit perdue est peut-être déjà passée. Signature idempotente, suivi d'état de transaction et réconciliation avec la chaîne comme source de vérité sont conçus dès le départ, pas rattrapés après coup.",
    },
    {
      id: 'enterprise-onboarding',
      title: 'Démarrer un nouveau grand compte en une journée',
      org: 'Kiss The Bride',
      period: 'Janv. 2018 – Avril 2022',
      plain:
        "L'ouverture d'un nouveau client demandait un paramétrage sur mesure à chaque fois ; elle tient désormais dans une journée.",
      context:
        "Une plateforme SaaS multi-tenant d'engagement des forces de vente par la gamification, vendue à des grands comptes, sur un monolithe Symfony 2.7 / AngularJS sans la moindre couverture de tests. Chaque client a sa base isolée, donc chaque nouveau compte imposait un paramétrage sur mesure.",
      approach:
        "Les tests d'abord : on ne migre pas un monolithe sans de quoi constater les régressions. Puis deux migrations en parallèle sur un système vivant — Symfony 2.7 vers 4 avec API Platform, AngularJS vers React. Le contrat servait deux consommateurs aux cycles de release distincts, un front web et une application mobile : conventions de payload, taxonomie d'erreurs et guidelines d'usage d'API Platform ont donc été arrêtées avant l'implémentation, pas après. Le déploiement lui-même est passé derrière un assistant d'initialisation écrit en Node.js et une orchestration Jenkins.",
      result:
        "La mise en route d'un nouveau grand compte est tombée à une journée. Les classements et résultats des forces de vente sont diffusés en direct par une intégration Mercure en Server-Sent Events. Sur quatre juniors hérités et encadrés deux ans, l'un est resté et a basculé sur l'application mobile servie par la même API.",
    },
    {
      id: 'industrial-erp',
      title: 'Maintenir un ERP industriel en production',
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        "Veiller sur le logiciel dont un industriel dépend de bout en bout, des fournisseurs aux factures, pendant qu'il sert tous les jours.",
      context:
        "Un ERP complet pour des clients industriels : fournisseurs, ligne de production, stock, facturation et suivi des incidents, dans une seule application dont l'entreprise ne pouvait pas se passer une journée.",
      approach:
        "Maintenance et évolutions sur un système en production quotidienne. Chaque correction et chaque évolution partait dans l'application qui tenait le stock et les factures, où une régression atteignait l'atelier ou la comptabilité le jour même — rien n'était donc changé qu'on ne puisse d'abord vérifier.",
      result:
        "L'ERP est resté en production tout du long. C'est exactement le genre d'application pour laquelle existe la Reprise : un outil dont l'entreprise dépend chaque jour, et qui doit continuer de tourner pendant qu'on s'en occupe.",
    },
    {
      id: 'codebase-audit',
      title: "Auditer une base de code qui n'est pas la mienne",
      org: 'Civic tech, bénévolat',
      period: '2026',
      plain:
        'Dire à une équipe ce qui, dans son code, peut lui coûter cher — puis corriger moi-même ce qui était critique.',
      context:
        'Une équipe bénévole qui livre vite, sur un monorepo de trois applications — un site public, une boutique qui encaisse, un back-office. Aucun test automatisé, une CI qui ne vérifiait que le build, et aucune carte de ce que ça coûtait.',
      approach:
        "D'abord en lecture seule, sans rien corriger : quatre rapports priorisés — 17 findings de sécurité, 11 de qualité et de dette, 6 sur le poids de déploiement, et un audit SEO à 56/100 sur 34 findings — chaque item rédigé comme une carte prête à prendre, avec sévérité, effort et critères d'acceptation. Puis j'ai traité les critiques moi-même.",
      result:
        "Le panier gratuit qui faisait confiance au client est revalidé côté serveur, le contenu éditorial injecté dans les données structurées est échappé, les en-têtes de sécurité sont globaux, et les actions CI comme l'image de base sont épinglées. La plateforme est passée de zéro test automatisé à la couverture de ses flux de paiement et de l'authentification admin, avec CodeQL dans le pipeline.",
    },
    {
      id: 'open-data-directories',
      title: "Annuaires associatifs depuis l'open data",
      org: 'Projet personnel',
      period: '2026',
      plain:
        "Reconstituer par la machine, en quelques secondes, un annuaire qu'on établissait à la main commune par commune.",
      context:
        "Constituer l'annuaire des associations d'un département se fait à la main, commune par commune, par copier-coller depuis les sites de mairie. C'est long, non reproductible, et personne ne peut dire d'où vient une ligne.",
      approach:
        "Un entonnoir de coût en huit étages sur les données ouvertes (RNA, Annuaire de l'administration), enrichies en explorant les sources publiques des collectivités, avec la provenance de chaque valeur conservée à côté d'elle. Local-first : un process, un fichier SQLite, une interface sur localhost — les requêtes partent de la machine de l'utilisateur, jamais de la mienne.",
      result:
        "Sur l'Ille-et-Vilaine : 332 communes résolues sur 353 et 31 273 associations en 40 secondes, puis 36 170 classées et 748 domaines de messagerie vérifiés en quatre secondes. Un pré-filtre mesuré ramène le volume appelant une inférence de 40,3 % à 6,5 % — l'objectif était 20 % — sans écarter une seule page ayant produit un contact, et avant qu'une ligne d'inférence n'existe.",
    },
  ],

  about: {
    kicker: 'À propos',
    title: 'En bref',
    paragraphs: [
      "Je suis un ingénieur backend qui aime les sujets peu glamour : intégrité transactionnelle, journaux d'événements rejouables, migrations que personne ne remarque. Sur douze ans, la ligne directrice n'est pas la stack, c'est la criticité croissante de ce qui casse — un dashboard BI qui tombe est un incident ; un wallet qui double une transaction est un problème comptable, réglementaire et de confiance.",
      "La transmission fait partie du métier, pas à côté. Une décision d'architecture que l'équipe ne comprend pas n'est pas une décision, c'est une dépendance — c'est pour ça que les RFC, les ADR et la culture de la revue comptent plus, à mes yeux, que n'importe quel framework. Concrètement, c'est ce qui m'a valu de rédiger les évaluations de compétences et de savoir-être de mes pairs, adressées au Head of Tech et au Head of Engineering en amont du cycle annuel.",
      "Hors écran : le Grand Est, en pleine campagne, sur une propriété que je rénove. Full remote depuis 2018 — ce n'est pas une préférence de confort récente, c'est huit ans de pratique. L'écrit, l'asynchrone et la trace sont ici le mode par défaut, pas une contrainte subie.",
    ],
    mentoringKicker: 'Mentorat & enseignement — un fil rouge',
    careerLine: "En poste plutôt qu'en mission ?",
    careerLink: 'Mon parcours est sur LinkedIn.',
  },

  mentoring: [
    {
      year: '2016',
      text: "Enseignement de l'informatique en premier cycle à l'Université de Reims.",
    },
    {
      year: '2018',
      text: "Mentorat de quatre développeurs juniors jusqu'à l'autonomie chez Kiss The Bride.",
    },
    {
      year: '2022',
      text: "Onboarding et revues d'architecture sur deux équipes produit chez Socios — six personnes, cinq développeurs et un QA.",
    },
    {
      year: '2024',
      text: 'Création de la communauté de pratique backend — RFC, ADR, standards partagés.',
    },
  ],

  languages: [
    { name: 'Français', level: 'langue maternelle' },
    { name: 'Anglais', level: 'C1 — professionnel complet' },
    { name: 'Allemand', level: 'B1 — bases professionnelles' },
  ],

  schema: {
    jobTitle: 'Ingénieur logiciel senior — architecture backend',
    knowsAbout: [
      'Event Sourcing',
      'Symfony',
      'API Platform',
      'Node.js',
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

  offers: {
    audit: {
      name: 'Audit',
      plain:
        "Un regard extérieur sur votre application, rendu par écrit : ce qui peut vous coûter cher, et dans quel ordre s'en occuper.",
    },
    takeover: {
      name: 'Reprise et maintenance',
      plain:
        "Reprendre en main l'application que plus personne n'ose toucher, sans rien casser, puis la faire vivre chaque mois.",
    },
    migration: {
      name: 'Migration sans interruption',
      plain:
        "Faire passer un système qui tourne à une nouvelle version sans l'arrêter, en commençant par un plan à prix fixe.",
    },
    reliability: {
      name: 'Fiabilisation',
      plain:
        'Rendre visible ce que fait votre système, pour expliquer un écart de stock, un solde ou un bug au lieu de le deviner.',
    },
    reinforcement: {
      name: 'Renfort senior',
      plain: 'Un lead ou un architecte à temps partiel dans votre équipe, facturé à la journée.',
    },
  },

  offerPage: {
    kicker: 'Offre',
    sentences: 'Ce que vous en dites',
    delivered: 'Ce que vous recevez',
    steps: 'Comment ça se passe',
    price: 'Combien ça coûte',
    disclaimer: 'Ordre de grandeur, pas un devis.',
    tableCaption: 'Toutes les fourchettes, hors taxes',
    excludingVat: 'HT',
    perMonth: '/ mois',
    weekOne: 'semaine',
    weekMany: 'semaines',
    fit: 'Est-ce le bon choix ?',
    goodChoice: 'Un bon choix si',
    notTheRightChoice: 'Pas le bon choix si',
    achievements: 'Ce qui le prouve',
    faq: 'Questions fréquentes',
    concepts: 'En deux mots',
    book: {
      kicker: 'Premier pas',
      title: 'Un appel de 30 minutes, pour voir si je peux aider.',
      text: "Gratuit et sans engagement : vous décrivez la situation, je vous dis franchement si cette offre est la bonne, et sinon laquelle l'est.",
      cta: 'Réserver un appel',
      orWrite: 'Vous préférez écrire ?',
    },
  },

  offerPages: {
    audit: {
      meta: {
        title: "Audit d'application — Thomas Bouzy",
        description:
          "Un audit écrit de votre application : rapport, registre des risques et plan d'action priorisé. Prix publics, déduits de la mission qui suit.",
      },
      sentences: [
        '« On sent que quelque chose ne va pas, mais on ne sait pas par où commencer. »',
        '« Avant de signer pour une refonte, on voudrait un avis qui ne vend pas la refonte. »',
        '« On va racheter cette société : que vaut vraiment son logiciel ? »',
      ],
      concepts: [
        {
          label: 'Empreinte',
          gloss:
            "Mémoire, CPU, poids d'image et déploiement traités comme du design, pas comme la météo.",
        },
        {
          label: 'Build-vs-buy',
          gloss: "Ce qu'on continue d'acheter, ce qu'on internalise, et où passe la ligne.",
        },
      ],
      delivered: [
        {
          title: 'Un rapport écrit',
          text: "Ce qui tient, ce qui fragilise et ce qui coûte, de l'architecture à l'exploitation, lu par quelqu'un qui n'a rien à défendre dedans.",
        },
        {
          title: 'Un registre des risques',
          text: 'Chaque risque avec sa gravité, sa probabilité et ce que coûte de le laisser en place, pour décider en connaissance de cause.',
        },
        {
          title: "Un plan d'action",
          text: "Les corrections dans l'ordre où elles rapportent, chacune prête à prendre, avec son effort estimé. Les décisions structurantes sont écrites en ADR, pour que votre équipe puisse les discuter.",
        },
      ],
      variant: {
        title: 'Variante : la due diligence technique',
        text: "Avant un rachat ou une levée de fonds, le même travail écrit pour quelqu'un qui n'est pas l'équipe : ce que vaut le système, ce que coûtera de le faire évoluer, et ce qui pourrait surprendre après la signature.",
      },
      steps: [
        {
          title: 'Un appel de 30 minutes',
          text: 'Vous décrivez le système et ce qui vous inquiète. Je vous dis si un audit est la bonne réponse, et à quelle profondeur.',
        },
        {
          title: 'Un accès en lecture seule',
          text: "Au code, à la documentation et, si possible, aux métriques de production. Rien n'est modifié pendant l'audit.",
        },
        {
          title: 'La lecture et les entretiens',
          text: 'Je lis le système et je parle à ceux qui le font tourner : les risques que le code ne montre pas se trouvent souvent là.',
        },
        {
          title: 'La restitution',
          text: "Le rapport, le registre et le plan, présentés et discutés avec vous et votre équipe, jusqu'à ce que chaque point soit compris.",
        },
      ],
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
        "Si vous confiez ensuite la mission qui en découle, le prix de l'audit en est déduit : l'audit n'est jamais une dépense perdue.",
      ],
      goodChoice: [
        'Vous sentez un risque sans pouvoir le nommer.',
        "Vous devez décider d'une refonte, d'une migration ou d'un rachat, et vous voulez un avis indépendant avant.",
        "Votre équipe a besoin d'une liste priorisée plutôt que d'une impression générale.",
      ],
      notTheRightChoice: [
        'Vous savez déjà ce qui ne va pas : la Reprise ou la Fiabilisation vont plus droit au but.',
        "Le système est en panne en ce moment : il faut d'abord rétablir le service, l'audit viendra après.",
        "Vous cherchez la validation d'une décision déjà prise : l'audit dira ce qu'il trouve.",
      ],
      faq: [
        {
          question: 'Faut-il me donner accès à la production ?',
          answer:
            "Non. Un accès en lecture au code suffit pour l'audit express. Pour l'audit complet, des métriques ou des journaux de production rendent le diagnostic bien plus précis, et restent en lecture.",
        },
        {
          question: "Et si l'audit conclut qu'il faut tout réécrire ?",
          answer:
            "Il le dira, avec ce que coûte de ne pas le faire. C'est rarement la conclusion : la plupart des systèmes se reprennent par morceaux, sans tout arrêter.",
        },
        {
          question: "Pourquoi une fourchette plutôt qu'un prix ?",
          answer:
            "Parce que le prix dépend de la taille réelle du système, qu'on mesure pendant le premier appel. Le devis, lui, est ferme avant de commencer.",
        },
      ],
    },
  },

  contact: {
    kicker: 'Contact',
    title: 'Un système qui doit rester juste ?',
    blurb:
      "Disponible pour des missions bornées : audits d'architecture event-driven, migrations Symfony sur des systèmes qui ne s'arrêtent pas, mise en place de l'observabilité, refonte de contrats d'API sans rupture de service, audits de coût infra et fournisseurs de données. Remote-first — je me déplace volontiers quand il faut une salle.",
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
