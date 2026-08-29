import type { ResumeContent } from './types.ts';

export const en = {
  meta: {
    title: 'Thomas Bouzy — Senior Software Engineer, backend architecture',
    description:
      'I design transactional systems that have to stay correct while they stay up. Twelve years of backend architecture — event-sourced wallets at 1,000+ transactions a minute, observability that took reported bugs from 20 a month to 5, and DeFi operations in production on real funds.',
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
    availability: 'Freelance now · permanent roles from September 2026',
    role: 'Senior Software Engineer — architecture & technical leadership',
    blurb:
      'I design transactional systems that have to stay correct while they stay up. Twelve years of backend and architecture — event-driven flows, Event Sourcing on wallets, and on-chain operations where a mistake costs real money.',
    yearsCount: '12',
    yearsLabel: 'years',
    badges: [
      'PHP · Symfony',
      'Event Sourcing · DDD',
      'Solana · Fireblocks',
      'OpenTelemetry · Datadog',
    ],
    ctaWork: 'See the work',
    ctaPdf: 'Download CV',
  },

  stats: [
    { n: '1.5M+', label: 'active users on the platform I helped architect' },
    { n: '1,000/min', label: 'financial transactions through event-sourced wallets' },
    { n: '30k/min', label: 'gamification events at peak load' },
    { n: '20 → 5', label: 'reported bugs a month, after instrumenting the backend' },
    { n: '17s → 3s', label: 'Time To Interactive, after the trader API was redesigned' },
    { n: '−67%', label: 'annual data-provider cost (€9,000 → €3,000), same data quality' },
  ],

  work: {
    kicker: 'Selected projects',
    title: 'Six things worth opening',
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
      title: 'Rebuilding a live API without users noticing',
      org: 'Socios.com (Chiliz)',
      period: '2022–2026',
      context:
        'The trader-facing FanTokens product was slow, unstable and expensive. Endpoints shipped payloads that were too heavy and not domain-oriented enough, 500 errors were recurring, and the page took 17 seconds to become usable. On this kind of product an inconsistent number is not a display defect — it is an investment decision taken on false information.',
      approach:
        'A full redesign of the API contracts around the business domain, run as an incremental migration rather than a rewrite: the hard constraint was that the rollout stay invisible to users, without breaking the frontend during the transition. On the same scope, making the token data served to traders consistent, redesigning the aggregation, and a TradingView integration where the backend produces clean datasets and the frontend injects them through the SDK — a data contract negotiated between two teams more than a library integration.',
      result:
        "Recurring 500s brought to zero and Time To Interactive from 17 to 3 seconds, lighter domain-focused payloads being the primary cause. Container image 1.7 GB → 200 MB, deployment from around 15 minutes to under 4, memory 1 GB → a few hundred MB, CPU 2 cores → 100 millicores. A cost-reduction directive on the same scope answered by batching calls, moving to the provider's bulk endpoints and, above all, internalising part of the data with an in-house RPC client reading token information directly on-chain: €9,000 → €3,000 a year at equivalent quality.",
      stack: ['PHP', 'Symfony', 'API Platform', 'React / Next.js', 'TradingView SDK', 'Kubernetes'],
    },
    {
      title: 'On-chain transactions that commit real funds',
      org: 'Socios.com (Chiliz)',
      period: '2022–2026',
      context:
        'DeFi operations on Solana had to be run from the platform: swaps, pool creation, opening and closing liquidity positions, claiming rewards, rebalancing. A mistake here does not cost a retry — it costs money that has already gone.',
      approach:
        'A dedicated Node.js microservice integrating the Meteora SDK, with full on-chain reads over RPC and a Fireblocks layer for custody and transaction signing — signing being an external approval workflow with its own latency and failure modes, not a library call. Rolled out progressively: devnet first, then production with real funds. Scope stated plainly: SDK integration and transaction operation, no smart contract authoring.',
      result:
        'In production on real funds. The hard part is not submitting the order: you control neither finality nor confirmation delay, and the transaction you believe lost may already have landed. Idempotent signing, transaction state tracking and reconciliation against the chain as the source of truth are designed in, not handled afterwards.',
      stack: ['Node.js', 'TypeScript', 'Solana', 'Meteora SDK', 'Fireblocks', 'On-chain RPC'],
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
      title: "Auditing a codebase I didn't write",
      org: 'Civic tech, volunteer',
      period: '2026',
      context:
        'A volunteer team shipping fast across a three-app monorepo — a public site, a shop taking real payments, a back-office. No automated tests anywhere, a CI that only checked the build, and no map of what that was costing.',
      approach:
        'Read-only first, fixing nothing: four prioritised reports — 17 security findings, 11 on quality and debt, 6 on deployment weight, and an SEO audit scoring 56/100 across 34 findings — each item written as a card the team could pick up, with severity, effort and acceptance criteria. Then I took the critical ones myself.',
      result:
        'A free-cart path that trusted the client is now revalidated server-side, editorial content injected into structured data is escaped, security headers are global, and both the CI actions and the base image are pinned. The platform went from zero automated tests to covering its payment flows and admin authentication, with CodeQL in the pipeline.',
      stack: ['Next.js', 'TypeScript', 'Turborepo', 'Docker', 'GitHub Actions', 'CodeQL'],
    },
    {
      title: 'Association directories from open data',
      org: 'Personal project',
      period: '2026',
      context:
        "Building a département's association directory is done by hand today — commune by commune, copy-pasted from town-hall sites. Slow, not reproducible, and nobody can say where any given line came from.",
      approach:
        "An eight-stage cost funnel over open data (the RNA and the government directory), enriched by crawling the public sources of the collectivités themselves, with the provenance of every value kept beside it. Local-first by design: one process, one SQLite file, an interface on localhost — requests leave the user's machine, never mine.",
      result:
        'On Ille-et-Vilaine: 332 of 353 communes resolved and 31,273 associations in 40 seconds, then 36,170 classified and 748 mail domains verified in four. A measured pre-filter cut the volume that would need inference from 40.3% to 6.5% — the target was 20% — without dropping one page that had produced a contact, and before a line of inference existed.',
      stack: ['TypeScript', 'Node 24', 'SQLite', 'Local-first', 'Docker', 'ADR'],
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
        'Global digital sports entertainment platform — fan tokens and sports engagement, 1.5M+ active users. Three successive roles over the period: senior backend engineer, backend tech representative, then acting tech lead.',
      bullets: [
        'Designed an event-driven architecture (outbox pattern, SNS/SQS) and implemented Event Sourcing on wallet transaction flows — 1,000+ financial transactions per minute.',
        'Split business domains into microservices (DDD), and introduced an RFC/ADR process and an API-first guideline for cross-team architecture decisions.',
        'Rolled out observability across all backend services — OpenTelemetry and Datadog, per-service dashboards, alerting on the signals that precede failure — alongside raised frontend test coverage: reported bugs down from around 20 a month to 5.',
        'Led a full API redesign of the trader-facing FanTokens product with no service interruption and no user-visible regression, and owned its cost: data-provider spend cut from €9,000 to €3,000 a year at equivalent quality, through call batching, bulk endpoints and an in-house RPC client reading token information on-chain.',
        'Designed and shipped a Node.js microservice for DeFi operations on Solana — Meteora SDK, on-chain reads over RPC, custody and signing through Fireblocks — rolled out on devnet, then in production on real funds.',
        'Integrated third-party financial partners (digital-asset custodians, exchange protocols), later opened to other teams as a shared service.',
        'Sustained load during Fan Token Offerings — peaks of 10–20,000 users within minutes — and designed the load tests (BlazeMeter).',
        'Cross-squad technical representative over two product squads (up to 6 developers, QA, PO): onboarding, architecture reviews, backend community of practice.',
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
        'OpenTelemetry',
        'Datadog',
        'Node.js / TypeScript',
        'Solana',
        'Fireblocks',
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
    title: 'What I reach for, and at what level',
  },

  skills: [
    {
      name: 'Production — deep',
      items: [
        'PHP',
        'Symfony (3 → 8)',
        'API Platform',
        'PostgreSQL',
        'MySQL',
        'Redis',
        'AWS',
        'Docker',
        'Kubernetes',
        'GitLab CI/CD',
        'ArgoCD',
        'PHPUnit',
        'Behat',
        'PHPStan',
        'BlazeMeter',
        'OpenTelemetry',
        'Datadog',
      ],
    },
    {
      name: 'Production — secondary',
      items: [
        'Node.js',
        'TypeScript',
        'Solana',
        'Meteora SDK',
        'Fireblocks',
        'On-chain RPC',
        'React / Next.js',
        'MongoDB',
        'TradingView SDK',
      ],
    },
    { name: 'Currently learning', items: ['Python', 'FastAPI'] },
    {
      name: 'Architecture & ways of working',
      items: [
        'DDD',
        'CQRS',
        'Event Sourcing',
        'Event-driven',
        'Microservices',
        'Modular monolith',
        'RFC / ADR',
        'API-first',
        'Code review',
        'Mentoring',
      ],
    },
    {
      name: 'AI practice',
      items: [
        'Coding agents — daily, professionally',
        'Claude API — personal projects',
        'MCP servers — personal projects',
        'Pipeline orchestration — personal projects',
      ],
    },
  ],

  about: {
    kicker: 'About',
    title: 'The short story',
    paragraphs: [
      "I'm a backend engineer who likes the unglamorous parts: transaction integrity, replayable event logs, migrations nobody notices. Across twelve years the through-line isn't the stack, it's the rising criticality of what breaks — a BI dashboard going down is an incident; a wallet double-crediting a transaction is an accounting, regulatory and trust problem.",
      "Teaching is part of the job rather than adjacent to it. An architecture decision the team doesn't understand isn't a decision, it's a dependency — which is why RFCs, ADRs and review culture matter to me more than any particular framework.",
      'Off-screen: rural Vosges, on a property I am renovating. Fully remote since 2018 — not a recent comfort preference, eight years of practice. Written, asynchronous and traceable work is the default mode here, not a constraint I put up with.',
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
      'Available for senior backend and tech-lead roles, and for bounded freelance work: event-driven architecture audits, Symfony migrations on systems that never stop, observability rollouts, API contract redesigns without downtime, infrastructure and data-provider cost audits. Remote-first — happy to travel for the parts that need a room.',
    revealPhone: 'Show phone number',
    pdfLabel: 'PDF',
    locationLine: 'Vosges, Grand Est, France · Fully remote for 8+ years · CET',
  },
} satisfies ResumeContent;
