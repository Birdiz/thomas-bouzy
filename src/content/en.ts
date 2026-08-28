import type { ResumeContent } from './types.ts';

export const en = {
  meta: {
    title: 'Thomas Bouzy — Senior Software Engineer, backend architecture',
    description:
      'Twelve years building complex, highly available web applications. Event-driven backend architecture, Event Sourcing and technical leadership on a 1.5M-user platform. Available now.',
    ogImageAlt: 'Thomas Bouzy — Senior Software Engineer, architecture & technical leadership',
  },

  a11y: {
    skipToContent: 'Skip to content',
    languageSwitcher: 'Language',
    switchToOther: 'Lire en français',
    mainNavigation: 'Main',
    portraitAlt: 'Portrait of Thomas Bouzy',
  },

  nav: {
    work: 'Work',
    experience: 'Experience',
    skills: 'Skills',
    about: 'About',
    contact: 'Get in touch',
  },

  hero: {
    availability: 'Available now — full-time roles & freelance',
    role: 'Senior Software Engineer — architecture & technical leadership',
    blurb:
      'Twelve years building complex, highly available web applications. Backend architecture, event-driven systems, and the kind of team coordination that keeps a 1.5M-user platform boring in the best way.',
    yearsCount: '12',
    yearsLabel: 'years',
    badges: ['PHP · Symfony', 'DDD · Event Sourcing', 'AWS · Kubernetes'],
    ctaWork: 'See the work',
    ctaPdf: 'Download CV',
  },

  stats: [
    { n: '1.5M+', label: 'active users on the platform I helped architect' },
    { n: '1,000/min', label: 'financial transactions through event-sourced wallets' },
    { n: '30k/min', label: 'gamification events at peak load' },
    { n: '6', label: 'developers led across two product squads' },
  ],

  work: {
    kicker: 'Selected projects',
    title: 'Five things worth opening',
    intro:
      'Each one is a real system in production. Open a card for the context, the approach and what it actually changed.',
    labelContext: 'Context',
    labelApproach: 'Approach',
    labelResult: 'Result',
  },

  projects: [
    {
      title: 'Event Sourcing on wallet transactions',
      org: 'Socios.com (Chiliz)',
      period: '2022–2026',
      context:
        'Fan-token wallets moved real money and real assets. The existing state-based model made it impossible to answer "how did this balance get here?" — a hard problem when finance, support and regulators all ask that question.',
      approach:
        'Introduced Event Sourcing on the transaction flows with an outbox pattern over SNS/SQS, so every balance change is a stored, replayable fact rather than an overwritten row. Projections rebuild read models from the log.',
      result:
        '1,000+ financial transactions a minute with a complete audit trail, reconciliation that stopped being archaeology, and bug investigations that replay instead of guess.',
      stack: ['PHP', 'Symfony 7', 'Event Sourcing', 'SNS/SQS', 'PostgreSQL', 'AWS'],
    },
    {
      title: 'Real-time gamification & leaderboards',
      org: 'Socios.com (Chiliz)',
      period: '2023–2026',
      context:
        'Engagement features — challenges, points, leaderboards — had to feel instant for a global audience, and the load arrives in spikes, not curves.',
      approach:
        "Major contributor on an event-driven gamification engine consuming the platform's activity stream, with Redis-backed leaderboards and idempotent handlers so replays never double-score.",
      result:
        'Sustained 30,000 events per minute with live leaderboard updates, and a scoring model product could extend without engineering rework.',
      stack: ['PHP', 'Symfony', 'Redis', 'Event-driven', 'Kubernetes'],
    },
    {
      title: 'Third-party financial integrations',
      org: 'Socios.com (Chiliz)',
      period: '2022–2026',
      context:
        'Digital asset custodians and exchange protocols each arrive with their own auth, semantics and failure modes — and every team wanted one.',
      approach:
        'Built the integrations behind a single internal contract: adapters per partner, retries and reconciliation built in, then opened it up as a shared service with documentation and an on-call story.',
      result:
        'Partner integrations went from bespoke per-squad work to a service other teams consumed directly — new partners onboarded without touching consumer code.',
      stack: ['PHP', 'Symfony', 'API design', 'DDD', 'AWS'],
    },
    {
      title: 'Legacy system → API Platform',
      org: 'Kiss The Bride',
      period: '2018–2022',
      context:
        "A digital agency serving large enterprise accounts on a legacy codebase that couldn't keep up with what clients now needed from their data.",
      approach:
        'Led an incremental migration to a modern API architecture on Symfony and API Platform — strangler-style, feature by feature, so client work never stopped. Rebuilt the CI/CD pipelines alongside it.',
      result:
        'A maintainable API layer serving enterprise accounts, faster deploys, and four junior developers who came out of it able to own features themselves.',
      stack: ['Symfony 4 & 5', 'API Platform', 'Docker', 'GitLab CI'],
    },
    {
      title: 'Delivery app for low-connectivity routes',
      org: 'ZOL',
      period: '2018',
      context:
        "Delivery drivers working in areas where the network simply isn't there — an app that assumes connectivity is an app that fails in the field.",
      approach:
        'Built an Android app with an offline-first data model — local queueing, deferred sync, conflict handling — paired with a logistics dashboard for the dispatch side.',
      result:
        'Drivers kept working through dead zones and the dashboard stayed accurate once they came back online.',
      stack: ['Android', 'PHP', 'Offline-first', 'REST'],
    },
  ],

  experience: {
    kicker: 'Track record',
    title: 'Where the hours went',
    earlierShow: 'Show earlier experience (2014–2018)',
    earlierHide: 'Hide earlier experience',
  },

  jobs: [
    {
      period: 'May 2022 – April 2026',
      duration: '4 years',
      place: 'Fully remote',
      title: 'Senior Backend Engineer / Tech Lead',
      company: 'Socios.com (Chiliz)',
      summary:
        'Global digital sports entertainment platform — fan tokens and sports engagement, 1.5M+ active users.',
      bullets: [
        'Designed an event-driven architecture (outbox pattern, SNS/SQS) and implemented Event Sourcing on wallet transaction flows — 1,000+ financial transactions per minute.',
        'Split business domains into microservices (DDD) and introduced an RFC/ADR process for cross-team architecture decisions.',
        'Sustained load during Fan Token Offerings — peaks of 10–20,000 users within minutes — and designed the load tests (BlazeMeter).',
        'Cross-squad technical leadership over two product squads (up to 6 developers, QA, PO): onboarding, architecture reviews, backend community of practice.',
        'Led three major Symfony version migrations on a continuously running production system.',
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
      period: 'Jan 2018 – April 2022',
      duration: '4 years',
      place: 'Freelance · Remote',
      title: 'Lead Backend Developer',
      company: 'Kiss The Bride — digital agency',
      summary: 'Backend technical referent for the agency, on large enterprise accounts.',
      bullets: [
        'Migrated a legacy system to a modern API architecture (Symfony + API Platform) for large enterprise accounts.',
        'Improved CI/CD deployment pipelines and mentored 4 junior developers.',
        'Parallel engagements: La Cartonnerie (Reims) — functional lead on an artistic management app; Highlife Recordings (Dijon) — full-stack development.',
      ],
      stack: ['Symfony 4 & 5', 'API Platform', 'Docker', 'GitLab CI'],
    },
  ],

  earlier: [
    {
      period: '2018 · 5 months',
      title: 'Full Stack Developer',
      org: 'ZOL',
      text: 'Android app for delivery drivers plus a logistics dashboard, optimized for low-connectivity infrastructure.',
    },
    {
      period: '2014–2016, 2017',
      title: 'Developer / Consultant',
      org: 'Business & Decision',
      text: 'Multichannel marketing BI platform for MSD France; large-account projects including Sanofi.',
    },
    {
      period: '2016–2017',
      title: 'Developer / Application Support',
      org: 'Quadra Informatique',
      text: 'Maintenance of a mission-critical industrial application in production.',
    },
    {
      period: '2016–2017',
      title: 'Computer Science Lecturer',
      org: 'University of Reims',
      text: 'Undergraduate teaching — the first mentoring experience, and the reason it stuck.',
    },
  ],

  skillsSection: {
    kicker: 'Toolkit',
    title: 'What I reach for',
  },

  skills: [
    { name: 'Languages', items: ['PHP (expert)', 'SQL', 'JavaScript / TypeScript', 'Shell'] },
    { name: 'Frameworks', items: ['Symfony (3 → 7)', 'API Platform', 'Node.js'] },
    {
      name: 'Architecture',
      items: ['DDD', 'CQRS', 'Event Sourcing', 'Event-Driven', 'Microservices', 'Modular monolith'],
    },
    { name: 'Databases', items: ['PostgreSQL', 'MySQL', 'Redis'] },
    { name: 'Infrastructure', items: ['AWS', 'Docker', 'Kubernetes', 'GitLab CI/CD', 'ArgoCD'] },
    {
      name: 'Testing & quality',
      items: ['PHPUnit', 'Behat', 'PhpStan', 'PHP CS Fixer', 'BlazeMeter'],
    },
    {
      name: 'Ways of working',
      items: ['Agile / Scrum', 'Kanban', 'Code review', 'Mentoring', 'RFC / ADR'],
    },
  ],

  about: {
    kicker: 'About',
    title: 'The short story',
    paragraphs: [
      "I'm a backend engineer who likes the unglamorous parts: transaction integrity, replayable event logs, migrations that nobody notices. I started as a developer in BI and enterprise consulting, went freelance to lead backend work for a digital agency, and spent the last four years fully remote as tech lead on a global sports platform.",
      'What I care about beyond the code: making architecture decisions legible to the rest of the company, and leaving teams more capable than I found them. RFCs, ADRs, review culture, and a lot of patient pairing.',
    ],
    mentoringKicker: 'Mentoring & teaching — a thread through all of it',
    languagesKicker: 'Languages',
    educationKicker: 'Education',
    educationText: 'DUT Computer Science — University of Reims Champagne-Ardenne, 2011–2013',
  },

  mentoring: [
    { year: '2016', text: 'Lectured undergraduate computer science at the University of Reims.' },
    {
      year: '2018',
      text: 'Mentored four junior developers into feature ownership at Kiss The Bride.',
    },
    { year: '2022', text: 'Ran onboarding and architecture reviews across two squads at Socios.' },
    {
      year: '2024',
      text: 'Founded the backend community of practice — RFCs, ADRs, shared standards.',
    },
  ],

  languages: [
    { name: 'French', level: 'native' },
    { name: 'English', level: 'C1 — full professional' },
    { name: 'German', level: 'B1 — professional basics' },
  ],

  contact: {
    kicker: 'Contact',
    title: 'Got a system that needs to hold up?',
    blurb:
      'Available for senior backend and tech-lead roles, and for freelance architecture work. Remote-first, based in the Grand Est — happy to travel for the parts that need a room.',
    revealPhone: 'Show phone number',
    pdfLabel: 'PDF',
    locationLine: 'Grand Est, France · Fully remote for 8+ years · CET',
  },
} satisfies ResumeContent;
