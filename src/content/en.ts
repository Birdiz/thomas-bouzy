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
    approach: 'Approach',
    about: 'About',
    contact: 'Get in touch',
  },

  hero: {
    availability: 'Available now',
    blurb:
      'I design transactional systems that have to stay correct while they stay up. Twelve years of backend and architecture — event-driven flows, Event Sourcing on wallets, and on-chain operations where a mistake costs real money.',
    ctaWork: 'See the work',
  },

  concepts: [
    {
      label: 'Traceable',
      gloss: 'Every movement kept as a dated fact; the balance replays instead of being guessed.',
    },
    {
      label: 'Invisible redesign',
      gloss: 'Payloads rebuilt underneath their consumers, without breaking a single one.',
    },
    {
      label: 'Footprint',
      gloss: 'Memory, CPU, image size and deployment treated as design, not as weather.',
    },
    {
      label: 'Build-vs-buy',
      gloss: 'What you keep buying, what you bring in-house, and where the line falls.',
    },
    {
      label: 'Shared service',
      gloss: "Born of one squad's need, opened to the other teams that turned out to have it.",
    },
    {
      label: 'Handover',
      gloss: 'Architecture reviews, onboarding, a written trail a newcomer can argue with.',
    },
  ],

  problem: {
    kicker: 'The problem',
    title: 'The happy path is never the interesting part.',
    paragraphs: [
      'Most systems work on the day they ship. What is worth paying for is what they do the night a consumer replays a message twice, a custodian API times out halfway through a transfer, or twenty thousand people arrive within four minutes.',
      'On a money flow that is not a performance problem. It is an accounting problem, a regulatory problem and a trust problem — and by the time it surfaces, the architecture that allowed it is two years old and load-bearing.',
      'The decisions that prevent it get made early and cheaply, before the expensive implementation starts: where the domain boundaries fall, what has to be idempotent, what earns an event log and what does not, and what you instrument before you optimise anything.',
    ],
  },

  failureModes: [
    {
      label: 'Double execution',
      text: 'A message arrives twice and the money moves twice. Nobody notices until reconciliation, and by then it is a support ticket with a regulator attached.',
    },
    {
      label: 'A balance nobody can explain',
      text: 'State-based models answer what the balance is, never how it got there — which is the only question finance, support and auditors actually ask.',
    },
    {
      label: 'The migration that never happens',
      text: 'A rewrite that needs a stop window on a system that cannot stop is a rewrite that stays on the roadmap for three years.',
    },
    {
      label: 'Defects found by users',
      text: 'A bug you learn about from a ticket was detectable hours earlier. What is not instrumented is not reliable, it is only untested in production.',
    },
  ],

  position: {
    kicker: 'Approach',
    title: 'Five things I will argue for, and what each one costs.',
    intro:
      'At this level an answer that exposes no cost sounds false. So every recommendation below comes with the thing it sacrifices — including the ones I would still make again.',
    costLabel: 'The cost',
  },

  principles: [
    {
      title: 'Architecture is written down.',
      text: 'RFCs and ADRs rather than verbal consensus. A decision should outlive the people who made it and the Slack thread it came from, and a newcomer should understand why before wanting to change it.',
      cost: 'Slower at the moment of deciding. You buy that back the second time the same debate does not get replayed.',
    },
    {
      title: 'Incremental migration over rewrite.',
      text: 'Three major Symfony migrations on a continuously running production system, none of them a big bang. The same applies to an API contract: you reshape it underneath its consumers, you do not replace it.',
      cost: 'A coexistence period where two models live side by side — and the discipline to keep that from becoming the permanent state.',
    },
    {
      title: 'Idempotency before cleverness.',
      text: 'On a money flow the question is not whether it is elegant, it is what happens when the message arrives twice. I never say exactly-once without qualifying it: outbox is at-least-once on publication, plus idempotent consumers, which is exactly-once from the business point of view.',
      cost: 'Deduplication keys, stored state and reconciliation to maintain — for a case that, done right, you never see happen.',
    },
    {
      title: 'What is not instrumented is not reliable.',
      text: 'Observability before optimisation. You do not argue about performance you have not measured, and you do not fix a defect you discovered through a user ticket. OpenTelemetry and Datadog across every backend service, per-service dashboards, alerting on the signals that precede failure: that is what took reported bugs from around twenty a month to five.',
      cost: 'Delivery time spent on instrumentation, and the harder decision of what to observe — one alert too many kills every alert.',
    },
    {
      title: 'Three honesty levels, never compressed.',
      text: 'Production experience, personal projects, currently learning — stated apart, including when merging them would make the application easier to sell. A stack claimed one level above where it belongs detonates in the first serious technical interview, and costs more than the gap it hid.',
      cost: 'A shorter list of things I can claim outright, and having to say "not in production" about work I am proud of.',
    },
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
      period: 'May 2022 – April 2026',
      context:
        'Fan-token wallets moved real money and real assets, on a global digital sports platform with 1.5M+ active users. The existing state-based model made it impossible to answer "how did this balance get here?" — a hard problem when finance, support and regulators all ask that question.',
      approach:
        'Introduced Event Sourcing on the transaction flows with an outbox pattern over SNS/SQS, so every balance change is a stored, replayable fact rather than an overwritten row. Projections rebuild read models from the log.',
      result:
        '1,000+ financial transactions a minute with a complete audit trail, reconciliation that stopped being archaeology, and bug investigations that replay instead of guess. The same flow absorbs the Fan Token Offerings — peaks of 10,000–20,000 users within minutes — on load tests designed for it (BlazeMeter).',
    },
    {
      title: 'Rebuilding a live API without users noticing',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      context:
        'The trader-facing FanTokens product was slow, unstable and expensive. Endpoints shipped payloads that were too heavy and not domain-oriented enough, 500 errors were recurring, and the page took 17 seconds to become usable. On this kind of product an inconsistent number is not a display defect — it is an investment decision taken on false information.',
      approach:
        'A full redesign of the API contracts around the business domain, run as an incremental migration rather than a rewrite: the hard constraint was that the rollout stay invisible to users, without breaking the frontend during the transition. On the same scope, making the token data served to traders consistent, redesigning the aggregation, and a TradingView integration where the backend produces clean datasets and the frontend injects them through the SDK — a data contract negotiated between two teams more than a library integration. The frontend was not left to others either: for eight sprints the tech lead joined that three-person team as its fourth developer — build configuration, image optimisation, features, fixes, test coverage and the e2e suite, in React and Next.js.',
      result:
        "Recurring 500s brought to zero and Time To Interactive from 17 to 3 seconds, lighter domain-focused payloads being the primary cause. Container image 1.7 GB → 200 MB, deployment from around 15 minutes to under 4, memory 1 GB → a few hundred MB, CPU 2 cores → 100 millicores — the deployment and the runtime footprint of those services are mine to own, on Kubernetes and ArgoCD, on a cluster operated alongside the devops team. A cost-reduction directive on the same scope answered by batching calls, moving to the provider's bulk endpoints and, above all, internalising part of the data with an in-house RPC client reading token information directly on-chain: €9,000 → €3,000 a year at equivalent quality. Shipped on call, incidents driven and coordinated through Rootly: work in progress stops until the mitigation lands, with tech leads, QA and product in the same room.",
    },
    {
      title: 'On-chain transactions that commit real funds',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      context:
        'In plain terms: a service that places and readjusts money on markets by itself, where an order once sent cannot be called back. Technically, DeFi operations on Solana had to be run from the platform: swaps, pool creation, opening and closing liquidity positions, claiming rewards, rebalancing. A mistake here does not cost a retry — it costs money that has already gone.',
      approach:
        'A dedicated Node.js microservice integrating the Meteora SDK, with full on-chain reads over RPC and a Fireblocks layer for custody and transaction signing — signing being an external approval workflow with its own latency and failure modes, not a library call. Rolled out progressively: devnet first, then production with real funds. Scope stated plainly: SDK integration and transaction operation, no smart contract authoring. The third-party financial partner integrations built here — digital-asset custodians, exchange protocols — were later opened to other teams as a shared service.',
      result:
        'In production on real funds. The hard part is not submitting the order: you control neither finality nor confirmation delay, and the transaction you believe lost may already have landed. Idempotent signing, transaction state tracking and reconciliation against the chain as the source of truth are designed in, not handled afterwards.',
    },
    {
      title: 'Onboarding a new enterprise account in a day',
      org: 'Kiss The Bride',
      period: 'Jan 2018 – April 2022',
      context:
        'A multi-tenant SaaS for sales-force engagement through gamification, sold to large enterprise accounts, running on a Symfony 2.7 / AngularJS monolith with no test coverage at all. Every client gets an isolated database, so every new account meant a bespoke setup.',
      approach:
        'Test coverage first: you do not migrate a monolith without a way to see the regressions. Then two migrations in parallel on a live system — Symfony 2.7 to 4 with API Platform, AngularJS to React. The contract had two consumers on separate release cycles, a web frontend and a mobile app, so payload conventions, an error taxonomy and API Platform guidelines were agreed before implementation rather than after. The deployment itself went behind an initialisation wizard written in Node.js and Jenkins orchestration.',
      result:
        'Onboarding a new enterprise account came down to one day. Sales-force rankings and results were delivered live through a Mercure integration over Server-Sent Events. Of four inherited juniors mentored over two years, one stayed and moved onto the mobile app served by the same API.',
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
        'On Ille-et-Vilaine: 332 of 353 communes resolved and 31,273 associations in 40 seconds, then 36,170 classified and 748 mail domains verified in four seconds. A measured pre-filter cut the volume that would need inference from 40.3% to 6.5% — the target was 20% — without dropping one page that had produced a contact, and before a line of inference existed.',
    },
  ],

  about: {
    kicker: 'About',
    title: 'The short story',
    paragraphs: [
      "I'm a backend engineer who likes the unglamorous parts: transaction integrity, replayable event logs, migrations nobody notices. Across twelve years the through-line isn't the stack, it's the rising criticality of what breaks — a BI dashboard going down is an incident; a wallet double-crediting a transaction is an accounting, regulatory and trust problem.",
      "Teaching is part of the job rather than adjacent to it. An architecture decision the team doesn't understand isn't a decision, it's a dependency — which is why RFCs, ADRs and review culture matter to me more than any particular framework. In practice it is what led to my writing the skills and behaviour assessments of my peers, addressed to the Head of Tech and the Head of Engineering ahead of the annual review cycle.",
      'Off-screen: the Grand Est countryside, on a property I am renovating. Fully remote since 2018 — not a recent comfort preference, eight years of practice. Written, asynchronous and traceable work is the default mode here, not a constraint I put up with.',
    ],
    mentoringKicker: 'Mentoring & teaching — a thread through all of it',
    cvLine:
      'Hiring rather than contracting? The detailed track record, the chronology and the technologies are in the CV.',
    cvCta: 'Download CV',
  },

  mentoring: [
    { year: '2016', text: 'Lectured undergraduate computer science at the University of Reims.' },
    {
      year: '2018',
      text: 'Mentored four junior developers into feature ownership at Kiss The Bride.',
    },
    {
      year: '2022',
      text: 'Ran onboarding and architecture reviews across two product teams at Socios — six people, five developers and a QA engineer.',
    },
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

  schema: {
    jobTitle: 'Senior Software Engineer — backend architecture',
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

  contact: {
    kicker: 'Contact',
    title: 'Got a system that needs to hold up?',
    blurb:
      'Available for bounded engagements: event-driven architecture audits, Symfony migrations on systems that never stop, observability rollouts, API contract redesigns without downtime, infrastructure and data-provider cost audits. Remote-first — happy to travel for the parts that need a room.',
    revealPhone: 'Show phone number',
    locationLine: 'Grand Est, France · Fully remote for 8+ years · CET',
  },

  footer: {
    legalHeading: 'Legal notice',
    hostedBy: 'Hosted by',
    siretLabel: 'SIRET',
    vatLabel: 'VAT',
    landmark: 'Site information',
  },
} satisfies ResumeContent;
