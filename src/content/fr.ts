import type { ResumeContent } from './types.ts';

export const fr = {
  meta: {
    title: 'Thomas Bouzy — Ingénieur logiciel senior, architecture backend',
    description:
      "Je conçois des systèmes transactionnels qui doivent rester justes pendant qu'ils restent debout. Douze ans d'architecture backend — wallets event-sourcés à plus de 1 000 transactions par minute, observabilité qui a ramené les bugs de 20 à 5 par mois, et des opérations DeFi en production sur fonds réels.",
    ogImageAlt: 'Thomas Bouzy — Ingénieur logiciel senior, architecture & leadership technique',
  },

  a11y: {
    skipToContent: 'Aller au contenu',
    languageSwitcher: 'Langue',
    switchToOther: 'Read in English',
    mainNavigation: 'Principale',
    portraitAlt: 'Portrait de Thomas Bouzy',
  },

  nav: {
    work: 'Projets',
    experience: 'Parcours',
    skills: 'Compétences',
    about: 'À propos',
    contact: 'Me contacter',
  },

  hero: {
    availability: 'Freelance immédiatement · CDI à partir de septembre 2026',
    role: 'Ingénieur logiciel senior — architecture & leadership technique',
    blurb:
      "Je conçois des systèmes transactionnels qui doivent rester justes pendant qu'ils restent debout. Douze ans de backend et d'architecture — flux event-driven, Event Sourcing sur les wallets, et des opérations on-chain où une erreur coûte de l'argent réel.",
    yearsCount: '12',
    yearsLabel: 'ans',
    badges: [
      'PHP · Symfony',
      'Event Sourcing · DDD',
      'Solana · Fireblocks',
      'OpenTelemetry · Datadog',
    ],
    ctaWork: 'Voir les projets',
    ctaPdf: 'Télécharger le CV',
  },

  stats: [
    { n: '1,5 M+', label: 'utilisateurs actifs sur la plateforme architecturée' },
    { n: '1 000/min', label: 'transactions financières en event sourcing' },
    { n: '30k/min', label: 'événements de gamification en pic de charge' },
    { n: '20 → 5', label: "bugs remontés par mois, après déploiement de l'observabilité" },
    { n: '17 s → 3 s', label: "Time To Interactive, après refonte de l'API traders" },
    { n: '−67 %', label: 'de coût annuel fournisseur (9 000 € → 3 000 €), à qualité égale' },
  ],

  work: {
    kicker: 'Projets sélectionnés',
    title: 'Six sujets à ouvrir',
    intro:
      "Chacun est un système réel en production. Ouvrez une carte pour le contexte, l'approche et ce que ça a changé.",
    labelContext: 'Contexte',
    labelApproach: 'Approche',
    labelResult: 'Résultat',
  },

  projects: [
    {
      title: 'Event Sourcing sur les transactions wallet',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      context:
        "Les wallets de fan tokens manipulaient de l'argent et des actifs réels. Le modèle basé état rendait impossible de répondre à « comment ce solde est-il arrivé là ? » — une question que posent la finance, le support et le régulateur.",
      approach:
        "Mise en place de l'Event Sourcing sur les flux de transactions avec un outbox pattern via SNS/SQS : chaque mouvement devient un fait stocké et rejouable plutôt qu'une ligne écrasée. Les projections reconstruisent les modèles de lecture.",
      result:
        "Plus de 1 000 transactions financières par minute avec une piste d'audit complète, une réconciliation qui a cessé d'être de l'archéologie, et des investigations qui se rejouent au lieu de se deviner.",
      stack: ['PHP', 'Symfony 7', 'Event Sourcing', 'SNS/SQS', 'PostgreSQL', 'AWS'],
    },
    {
      title: "Refaire une API de production sans que l'utilisateur s'en aperçoive",
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      context:
        "Le produit FanTokens destiné aux traders était lent, instable et coûteux. Les endpoints livraient des payloads trop lourdes et pas assez orientées métier, les erreurs 500 étaient récurrentes, et la page mettait 17 secondes à devenir utilisable. Sur ce type de produit, une donnée incohérente n'est pas un défaut d'affichage : c'est une décision d'investissement prise sur une information fausse.",
      approach:
        "Refonte complète des contrats d'API autour du domaine métier, menée en migration incrémentale et non en réécriture : la contrainte forte était que la livraison reste invisible côté utilisateur, sans casser le front pendant la transition. Sur le même périmètre, fiabilisation des données de tokens servies aux traders, refonte de l'agrégation, et intégration TradingView — le backend produit des datasets propres, le front les injecte via le SDK. Le vrai livrable est un contrat de données entre deux équipes, pas une intégration de librairie.",
      result:
        "Erreurs 500 récurrentes ramenées à zéro et Time To Interactive de 17 à 3 secondes, les payloads allégées et recentrées sur le métier en étant la cause principale. Image de conteneur de 1,7 Go à 200 Mo, déploiement d'une quinzaine de minutes à moins de 4, mémoire de 1 Go à quelques centaines de Mo, CPU de 2 cores à 100 millicores. Une directive de réduction de coût sur le même périmètre, traitée par batching des appels, endpoints de masse du fournisseur et surtout internalisation d'une partie de la donnée via un client RPC maison lisant les informations de tokens directement on-chain : 9 000 € → 3 000 € par an à qualité équivalente.",
      stack: ['PHP', 'Symfony', 'API Platform', 'React / Next.js', 'SDK TradingView', 'Kubernetes'],
    },
    {
      title: 'Des transactions on-chain qui engagent des fonds réels',
      org: 'Socios.com (Chiliz)',
      period: 'Mai 2022 – Avril 2026',
      context:
        "Il fallait opérer depuis la plateforme des opérations DeFi sur Solana : swap, création de pool, ouverture et fermeture de positions de liquidité, claim de rewards, rebalance. Ici, une erreur ne coûte pas un nouvel essai — elle coûte de l'argent déjà parti.",
      approach:
        "Un microservice Node.js dédié, intégrant le SDK Meteora, avec lecture on-chain complète via RPC et une couche Fireblocks pour la custody et la signature des transactions — signer n'étant pas un appel de librairie mais un workflow d'approbation externe, avec sa latence et ses modes d'échec propres. Mise en service progressive : devnet d'abord, puis production sur fonds réels. Périmètre dit franchement : intégration de SDK et opération de transactions, pas d'écriture de smart contracts.",
      result:
        "En production sur fonds réels. La difficulté n'est pas d'émettre l'ordre : on ne contrôle ni la finalité ni le délai de confirmation, et la transaction qu'on croit perdue est peut-être déjà passée. Signature idempotente, suivi d'état de transaction et réconciliation avec la chaîne comme source de vérité sont conçus dès le départ, pas rattrapés après coup.",
      stack: ['Node.js', 'TypeScript', 'Solana', 'SDK Meteora', 'Fireblocks', 'RPC on-chain'],
    },
    {
      title: 'Démarrer un nouveau grand compte en une journée',
      org: 'Kiss The Bride',
      period: 'Janv. 2018 – Avril 2022',
      context:
        "Une plateforme SaaS multi-tenant d'engagement des forces de vente par la gamification, vendue à des grands comptes, sur un monolithe Symfony 2.7 / AngularJS sans la moindre couverture de tests. Chaque client a sa base isolée, donc chaque nouveau compte imposait un paramétrage sur mesure.",
      approach:
        "Les tests d'abord : on ne migre pas un monolithe sans de quoi constater les régressions. Puis deux migrations en parallèle sur un système vivant — Symfony 2.7 vers 4 avec API Platform, AngularJS vers React. Le contrat servait deux consommateurs aux cycles de release distincts, un front web et une application mobile : conventions de payload, taxonomie d'erreurs et guidelines d'usage d'API Platform ont donc été arrêtées avant l'implémentation, pas après. Le déploiement lui-même est passé derrière un assistant d'initialisation écrit en Node.js et une orchestration Jenkins.",
      result:
        "La mise en route d'un nouveau grand compte est tombée à une journée. Les classements et résultats des forces de vente sont diffusés en direct par une intégration Mercure en Server-Sent Events. Sur quatre juniors hérités et encadrés deux ans, l'un est resté et a basculé sur l'application mobile servie par la même API.",
      stack: ['Symfony 2.7 → 4', 'API Platform', 'Mercure', 'React', 'MariaDB', 'Jenkins'],
    },
    {
      title: "Auditer une base de code qui n'est pas la mienne",
      org: 'Civic tech, bénévolat',
      period: '2026',
      context:
        'Une équipe bénévole qui livre vite, sur un monorepo de trois applications — un site public, une boutique qui encaisse, un back-office. Aucun test automatisé, une CI qui ne vérifiait que le build, et aucune carte de ce que ça coûtait.',
      approach:
        "D'abord en lecture seule, sans rien corriger : quatre rapports priorisés — 17 findings de sécurité, 11 de qualité et de dette, 6 sur le poids de déploiement, et un audit SEO à 56/100 sur 34 findings — chaque item rédigé comme une carte prête à prendre, avec sévérité, effort et critères d'acceptation. Puis j'ai traité les critiques moi-même.",
      result:
        "Le panier gratuit qui faisait confiance au client est revalidé côté serveur, le contenu éditorial injecté dans les données structurées est échappé, les en-têtes de sécurité sont globaux, et les actions CI comme l'image de base sont épinglées. La plateforme est passée de zéro test automatisé à la couverture de ses flux de paiement et de l'authentification admin, avec CodeQL dans le pipeline.",
      stack: ['Next.js', 'TypeScript', 'Turborepo', 'Docker', 'GitHub Actions', 'CodeQL'],
    },
    {
      title: "Annuaires associatifs depuis l'open data",
      org: 'Projet personnel',
      period: '2026',
      context:
        "Constituer l'annuaire des associations d'un département se fait à la main, commune par commune, par copier-coller depuis les sites de mairie. C'est long, non reproductible, et personne ne peut dire d'où vient une ligne.",
      approach:
        "Un entonnoir de coût en huit étages sur les données ouvertes (RNA, Annuaire de l'administration), enrichies en explorant les sources publiques des collectivités, avec la provenance de chaque valeur conservée à côté d'elle. Local-first : un process, un fichier SQLite, une interface sur localhost — les requêtes partent de la machine de l'utilisateur, jamais de la mienne.",
      result:
        "Sur l'Ille-et-Vilaine : 332 communes résolues sur 353 et 31 273 associations en 40 secondes, puis 36 170 classées et 748 domaines de messagerie vérifiés en quatre. Un pré-filtre mesuré ramène le volume appelant une inférence de 40,3 % à 6,5 % — l'objectif était 20 % — sans écarter une seule page ayant produit un contact, et avant qu'une ligne d'inférence n'existe.",
      stack: ['TypeScript', 'Node 24', 'SQLite', 'Local-first', 'Docker', 'ADR'],
    },
  ],

  experience: {
    kicker: 'Parcours',
    title: 'Où sont passées les heures',
    earlierShow: 'Voir le parcours antérieur (2014–2018)',
    earlierHide: 'Masquer le parcours antérieur',
  },

  jobs: [
    {
      period: 'Mai 2022 – Avril 2026',
      duration: '4 ans',
      place: 'Full remote',
      title: 'Senior Backend Engineer / Tech Lead',
      company: 'Socios.com (Chiliz)',
      summary:
        'Plateforme mondiale de sport digital — fan tokens et engagement sportif, 1,5 M+ utilisateurs actifs. Trois rôles successifs sur la période : senior backend engineer, référent technique backend, puis tech lead par intérim.',
      bullets: [
        "Conception d'une architecture event-driven (outbox pattern, SNS/SQS) et implémentation de l'Event Sourcing sur les flux de transactions wallet — plus de 1 000 transactions financières par minute.",
        "Découpage des domaines métier en microservices (DDD), et mise en place d'un processus RFC/ADR et d'une guideline API-first pour les décisions d'architecture inter-équipes.",
        "Déploiement de l'observabilité sur l'ensemble des services backend — OpenTelemetry et Datadog, dashboards par service, alerting sur les signaux qui précèdent la panne — couplé à une montée de la couverture de tests côté front : bugs remontés passés d'environ 20 par mois à 5.",
        "Refonte complète de l'API du produit FanTokens destiné aux traders, sans rupture de service ni régression visible, et pilotage de son coût : fournisseur de données ramené de 9 000 € à 3 000 € par an à qualité équivalente, par batching des appels, endpoints de masse et client RPC interne lisant les informations de tokens on-chain.",
        "Conception et mise en production d'un microservice Node.js d'opérations DeFi sur Solana — SDK Meteora, lecture on-chain via RPC, custody et signature via Fireblocks — déployé sur devnet, puis en production sur fonds réels.",
        'Intégration de partenaires financiers tiers (dépositaires d’actifs numériques, protocoles d’échange), ensuite ouverte aux autres équipes en service partagé.',
        'Tenue de la charge pendant les Fan Token Offerings — pics de 10 à 20 000 utilisateurs en quelques minutes — et conception des tests de charge (BlazeMeter).',
        "Référent technique transverse sur deux squads produit (jusqu'à 6 développeurs, QA, PO) : onboarding, revues d'architecture, communauté de pratique backend.",
        'Pilotage de trois migrations majeures de Symfony sur un système en production continue.',
      ],
      stack: [
        'PHP',
        'Symfony 7',
        'PHPUnit',
        'Behat',
        'AWS',
        'Kubernetes',
        'Docker',
        'GitLab CI/CD',
        'OpenTelemetry',
        'Datadog',
        'Node.js / TypeScript',
        'Solana',
        'Fireblocks',
      ],
    },
    {
      period: 'Janv. 2018 – Avril 2022',
      duration: '4 ans',
      place: 'Freelance · Remote',
      title: 'Lead Backend Developer',
      company: 'Kiss The Bride — agence digitale',
      summary:
        "Plateforme SaaS multi-tenant d'engagement des forces de vente par la gamification, déployée pour des grands comptes.",
      bullets: [
        "Refonte d'un monolithe Symfony 2.7 / AngularJS sans couverture de tests vers une architecture API-first (Symfony 4, API Platform) et un front React — deux migrations menées en parallèle sur un système en production continue, la mise en place de la couverture de tests conditionnant la reprise.",
        "Industrialisation du déploiement multi-tenant : mise en route d'un nouveau grand compte ramenée à une journée — base de données isolée par client, assistant d'initialisation développé en Node.js et orchestration Jenkins.",
        "Définition des contrats d'API servant deux consommateurs aux cycles de release distincts, front web et application mobile : conventions de payload, taxonomie d'erreurs et guidelines d'usage d'API Platform pour l'équipe.",
        "Diffusion temps réel des classements et résultats de forces de vente, par une intégration Mercure (Server-Sent Events) sur l'API.",
        'Encadrement de 4 développeurs juniors sur deux ans, référent technique backend : revues de code, standards de test, montée en compétence.',
      ],
      stack: [
        'Symfony 2.7 → 4',
        'API Platform',
        'Mercure',
        'React',
        'MariaDB',
        'Node.js',
        'GitLab CI',
        'Jenkins',
        'Docker',
      ],
    },
  ],

  earlier: [
    {
      period: '2018 · 5 mois',
      title: 'Développeur Full Stack',
      org: 'ZOL',
      text: 'Application Android pour livreurs et tableau de bord logistique, optimisés pour les infrastructures à faible connectivité.',
    },
    {
      period: '2014–2016, 2017',
      title: 'Développeur / Consultant',
      org: 'Business & Decision',
      text: 'Plateforme BI marketing multicanal pour MSD France ; projets grands comptes dont Sanofi.',
    },
    {
      period: '2016–2017',
      title: 'Développeur / Support applicatif',
      org: 'Quadra Informatique',
      text: "Maintenance d'une application industrielle critique en production.",
    },
    {
      period: 'Avant 2018',
      title: 'Missions freelance',
      org: 'La Cartonnerie · Highlife Recordings',
      text: 'La Cartonnerie (Reims) — référent fonctionnel sur une application de gestion artistique ; Highlife Recordings (Dijon) — développement full-stack.',
    },
    {
      period: '2016–2017',
      title: 'Vacataire en informatique',
      org: 'Université de Reims',
      text: 'Enseignement en premier cycle — la première expérience de transmission, et celle qui est restée.',
    },
  ],

  skillsSection: {
    kicker: 'Boîte à outils',
    title: "Ce que j'utilise, et à quel niveau",
  },

  skills: [
    {
      name: 'Production — maîtrise profonde',
      items: [
        'PHP',
        'Symfony (3 → 8)',
        'API Platform',
        'PostgreSQL',
        'MySQL / MariaDB',
        'Redis',
        'AWS',
        'Docker',
        'Kubernetes',
        'GitLab CI/CD',
        'ArgoCD',
        'Jenkins',
        'PHPUnit',
        'Behat',
        'PHPStan',
        'BlazeMeter',
        'OpenTelemetry',
        'Datadog',
      ],
    },
    {
      name: 'Production — secondaire',
      items: [
        'Node.js',
        'TypeScript',
        'Solana',
        'SDK Meteora',
        'Fireblocks',
        'RPC on-chain',
        'React / Next.js',
        'Mercure',
        'SDK TradingView',
      ],
    },
    { name: 'En apprentissage', items: ['Python', 'FastAPI'] },
    {
      name: 'Architecture & méthodes',
      items: [
        'DDD',
        'CQRS',
        'Event Sourcing',
        'Event-driven',
        'Microservices',
        'Monolithe modulaire',
        'Multi-tenant',
        'RFC / ADR',
        'API-first',
        'Revue de code',
        'Mentorat',
      ],
    },
    {
      name: 'Pratique IA',
      items: [
        'Agents de code — quotidien, en pro',
        'Claude API — projets personnels',
        'Serveurs MCP — projets personnels',
        'Orchestration de pipelines — projets personnels',
      ],
    },
  ],

  about: {
    kicker: 'À propos',
    title: 'En bref',
    paragraphs: [
      "Je suis un ingénieur backend qui aime les sujets peu glamour : intégrité transactionnelle, journaux d'événements rejouables, migrations que personne ne remarque. Sur douze ans, la ligne directrice n'est pas la stack, c'est la criticité croissante de ce qui casse — un dashboard BI qui tombe est un incident ; un wallet qui double une transaction est un problème comptable, réglementaire et de confiance.",
      "La transmission fait partie du métier, pas à côté. Une décision d'architecture que l'équipe ne comprend pas n'est pas une décision, c'est une dépendance — c'est pour ça que les RFC, les ADR et la culture de la revue comptent plus, à mes yeux, que n'importe quel framework.",
      "Hors écran : le Grand Est, en pleine campagne, sur une propriété que je rénove. Full remote depuis 2018 — ce n'est pas une préférence de confort récente, c'est huit ans de pratique. L'écrit, l'asynchrone et la trace sont ici le mode par défaut, pas une contrainte subie.",
    ],
    mentoringKicker: 'Mentorat & enseignement — un fil rouge',
    languagesKicker: 'Langues',
    educationKicker: 'Formation',
    educationText: 'DUT Informatique — Université de Reims Champagne-Ardenne, 2011–2013',
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
    { year: '2022', text: "Onboarding et revues d'architecture sur deux squads chez Socios." },
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

  contact: {
    kicker: 'Contact',
    title: 'Un système qui doit tenir la charge ?',
    blurb:
      "Disponible pour des postes backend senior et tech lead, et pour des missions freelance bornées : audits d'architecture event-driven, migrations Symfony sur des systèmes qui ne s'arrêtent pas, mise en place de l'observabilité, refonte de contrats d'API sans rupture de service, audits de coût infra et fournisseurs de données. Remote-first — je me déplace volontiers quand il faut une salle.",
    revealPhone: 'Afficher le numéro',
    pdfLabel: 'PDF',
    locationLine: 'Grand Est, France · Full remote depuis 8 ans · CET',
  },
} satisfies ResumeContent;
