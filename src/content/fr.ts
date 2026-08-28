import type { ResumeContent } from './types.ts';

export const fr = {
  meta: {
    title: 'Thomas Bouzy — Ingénieur logiciel senior, architecture backend',
    description:
      "Douze ans à concevoir des applications web complexes et hautement disponibles. Architecture backend event-driven, Event Sourcing et leadership technique sur une plateforme d'1,5 M d'utilisateurs. Disponible immédiatement.",
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
    availability: 'Disponible immédiatement — postes et freelance',
    role: 'Ingénieur logiciel senior — architecture & leadership technique',
    blurb:
      "Douze ans à concevoir des applications web complexes et hautement disponibles. Architecture backend, systèmes event-driven, et la coordination d'équipe qui rend une plateforme d'1,5 M d'utilisateurs agréablement ennuyeuse.",
    yearsCount: '12',
    yearsLabel: 'ans',
    badges: ['PHP · Symfony', 'DDD · Event Sourcing', 'AWS · Kubernetes'],
    ctaWork: 'Voir les projets',
    ctaPdf: 'Télécharger le CV',
  },

  stats: [
    { n: '1,5 M+', label: 'utilisateurs actifs sur la plateforme architecturée' },
    { n: '1 000/min', label: 'transactions financières en event sourcing' },
    { n: '30k/min', label: 'événements de gamification en pic de charge' },
    { n: '6', label: 'développeurs encadrés sur deux squads produit' },
  ],

  work: {
    kicker: 'Projets sélectionnés',
    title: 'Cinq sujets à ouvrir',
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
      period: '2022–2026',
      context:
        "Les wallets de fan tokens manipulaient de l'argent et des actifs réels. Le modèle basé état rendait impossible de répondre à « comment ce solde est-il arrivé là ? » — une question que posent la finance, le support et le régulateur.",
      approach:
        "Mise en place de l'Event Sourcing sur les flux de transactions avec un outbox pattern via SNS/SQS : chaque mouvement devient un fait stocké et rejouable plutôt qu'une ligne écrasée. Les projections reconstruisent les modèles de lecture.",
      result:
        "Plus de 1 000 transactions financières par minute avec une piste d'audit complète, une réconciliation qui a cessé d'être de l'archéologie, et des investigations qui se rejouent au lieu de se deviner.",
      stack: ['PHP', 'Symfony 7', 'Event Sourcing', 'SNS/SQS', 'PostgreSQL', 'AWS'],
    },
    {
      title: 'Gamification et classements temps réel',
      org: 'Socios.com (Chiliz)',
      period: '2023–2026',
      context:
        "Les fonctionnalités d'engagement — défis, points, classements — devaient être instantanées pour une audience mondiale, avec une charge qui arrive en pics et non en courbes.",
      approach:
        "Contributeur majeur d'un moteur de gamification event-driven consommant le flux d'activité, avec des classements sur Redis et des handlers idempotents pour que les rejeux ne comptent jamais deux fois.",
      result:
        '30 000 événements par minute soutenus, classements mis à jour en direct, et un modèle de scoring que le produit pouvait étendre sans retravail technique.',
      stack: ['PHP', 'Symfony', 'Redis', 'Event-driven', 'Kubernetes'],
    },
    {
      title: 'Legacy → API Platform',
      org: 'Kiss The Bride',
      period: '2018–2022',
      context:
        'Une agence digitale au service de grands comptes, sur une base de code legacy qui ne suivait plus les attentes des clients sur leurs données.',
      approach:
        'Migration incrémentale vers une architecture API moderne (Symfony + API Platform), en strangler pattern, fonctionnalité par fonctionnalité, sans jamais arrêter la production. Refonte des pipelines CI/CD en parallèle.',
      result:
        'Une couche API maintenable pour les grands comptes, des déploiements plus rapides, et quatre développeurs juniors capables de porter leurs propres fonctionnalités.',
      stack: ['Symfony 4 & 5', 'API Platform', 'Docker', 'GitLab CI'],
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
        'Plateforme mondiale de sport digital — fan tokens et engagement sportif, 1,5 M+ utilisateurs actifs.',
      bullets: [
        "Conception d'une architecture event-driven (outbox pattern, SNS/SQS) et implémentation de l'Event Sourcing sur les flux de transactions wallet — plus de 1 000 transactions financières par minute.",
        "Découpage des domaines métier en microservices (DDD) et mise en place d'un processus RFC/ADR pour les décisions d'architecture inter-équipes.",
        'Tenue de la charge pendant les Fan Token Offerings — pics de 10 à 20 000 utilisateurs en quelques minutes — et conception des tests de charge (BlazeMeter).',
        "Leadership technique transverse sur deux squads produit (jusqu'à 6 développeurs, QA, PO) : onboarding, revues d'architecture, communauté de pratique backend.",
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
      ],
    },
    {
      period: 'Janv. 2018 – Avril 2022',
      duration: '4 ans',
      place: 'Freelance · Remote',
      title: 'Lead Backend Developer',
      company: 'Kiss The Bride — agence digitale',
      summary: "Référent technique backend de l'agence, sur des comptes grands comptes.",
      bullets: [
        "Migration d'un système legacy vers une architecture API moderne (Symfony + API Platform) pour des grands comptes.",
        'Amélioration des pipelines de déploiement CI/CD et mentorat de 4 développeurs juniors.',
        'Missions parallèles : La Cartonnerie (Reims) — référent fonctionnel sur une application de gestion artistique ; Highlife Recordings (Dijon) — développement full-stack.',
      ],
      stack: ['Symfony 4 & 5', 'API Platform', 'Docker', 'GitLab CI'],
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
      period: '2016–2017',
      title: 'Vacataire en informatique',
      org: 'Université de Reims',
      text: 'Enseignement en premier cycle — la première expérience de transmission, et celle qui est restée.',
    },
  ],

  skillsSection: {
    kicker: 'Boîte à outils',
    title: "Ce que j'utilise",
  },

  skills: [
    { name: 'Langages', items: ['PHP (expert)', 'SQL', 'JavaScript / TypeScript', 'Shell'] },
    { name: 'Frameworks', items: ['Symfony (3 → 7)', 'API Platform', 'Node.js'] },
    {
      name: 'Architecture',
      items: [
        'DDD',
        'CQRS',
        'Event Sourcing',
        'Event-Driven',
        'Microservices',
        'Monolithe modulaire',
      ],
    },
    { name: 'Bases de données', items: ['PostgreSQL', 'MySQL', 'Redis'] },
    { name: 'Infrastructure', items: ['AWS', 'Docker', 'Kubernetes', 'GitLab CI/CD', 'ArgoCD'] },
    {
      name: 'Tests & qualité',
      items: ['PHPUnit', 'Behat', 'PhpStan', 'PHP CS Fixer', 'BlazeMeter'],
    },
    {
      name: 'Méthodes',
      items: ['Agile / Scrum', 'Kanban', 'Revue de code', 'Mentorat', 'RFC / ADR'],
    },
  ],

  about: {
    kicker: 'À propos',
    title: 'En bref',
    paragraphs: [
      "Je suis un ingénieur backend qui aime les sujets peu glamour : intégrité transactionnelle, journaux d'événements rejouables, migrations que personne ne remarque. J'ai commencé en BI et conseil grands comptes, je suis passé en freelance comme référent backend d'une agence digitale, et j'ai passé quatre ans en full remote comme tech lead sur une plateforme sportive mondiale.",
      "Ce qui compte pour moi au-delà du code : rendre les décisions d'architecture lisibles pour le reste de l'entreprise, et laisser les équipes plus autonomes que je ne les ai trouvées. RFC, ADR, culture de la revue, et beaucoup de pair programming patient.",
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
      "Disponible pour des postes backend senior et tech lead, ainsi que pour des missions freelance d'architecture. Remote-first, basé dans le Grand Est — je me déplace volontiers quand il faut une salle.",
    revealPhone: 'Afficher le numéro',
    pdfLabel: 'PDF',
    locationLine: 'Grand Est, France · Full remote depuis 8 ans · CET',
  },
} satisfies ResumeContent;
