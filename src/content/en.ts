import type { ResumeContent } from './types.ts';

export const en = {
  meta: {
    title: 'Thomas Bouzy — Senior Software Engineer, backend architecture',
    description:
      'I design transactional systems that have to stay correct while they stay up. Twelve years of backend architecture — event-sourced wallets at 1,000+ transactions a minute, observability that took reported bugs from 20 a month to 5, and DeFi operations in production on real funds.',
    ogImageAlt:
      'Thomas Bouzy — I design transactional systems that have to stay correct while they stay up. Backend & architecture.',
  },

  a11y: {
    skipToContent: 'Skip to content',
    languageSwitcher: 'Language',
    switchToOther: 'Lire en français',
    mainNavigation: 'Main',
    portraitAlt: 'Portrait of Thomas Bouzy',
  },

  nav: {
    work: 'Achievements',
    approach: 'Approach',
    about: 'About',
    contact: 'Get in touch',
  },

  hero: {
    availability: "First engagements in preparation — let's talk now",
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
      quote: '“We credited the same payout twice, and only saw it at reconciliation.”',
      text: 'Double execution. A consumer replays a message, and nothing in the code tells the second pass from the first. By then it is not a technical incident: it is an accounting discrepancy, with a regulator attached.',
    },
    {
      quote: '“We cannot explain how this balance got there.”',
      text: 'A state-based model. It answers what the balance is today, never the sequence of facts that produced it — the only thing finance, support and auditors actually ask for.',
    },
    {
      quote: '“The migration has been on the roadmap for two years.”',
      text: 'The rewrite that needs a stop window. On a system that cannot stop, that window never comes: the work slips from one quarter to the next for good reasons, while the cost of the old model keeps running.',
    },
    {
      quote: '“We find out about our own bugs from customer tickets.”',
      text: 'Defects found by users. A bug you learn about from a ticket was detectable hours earlier. What is not instrumented is not reliable: it is only untested in production, and the customer is doing your acceptance testing.',
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
    kicker: 'Achievements',
    title: 'Work worth opening',
    intro:
      'Each one is a real system in production. Open a card for the context, the approach and what it actually changed.',
    labelPlain: 'In plain terms:',
    labelContext: 'Context',
    labelApproach: 'Approach',
    labelResult: 'Result',
  },

  achievements: [
    {
      id: 'wallet-event-sourcing',
      title: 'Event Sourcing on wallet transactions',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        "Making every movement in a wallet traceable one by one, instead of only ever knowing today's balance.",
      context:
        'Fan-token wallets moved real money and real assets, on a global digital sports platform with 1.5M+ active users. The existing state-based model made it impossible to answer "how did this balance get here?" — a hard problem when finance, support and regulators all ask that question.',
      approach:
        'Introduced Event Sourcing on the transaction flows with an outbox pattern over SNS/SQS, so every balance change is a stored, replayable fact rather than an overwritten row. Projections rebuild read models from the log.',
      result:
        '1,000+ financial transactions a minute with a complete audit trail, reconciliation that stopped being archaeology, and bug investigations that replay instead of guess. The same flow absorbs the Fan Token Offerings — peaks of 10,000–20,000 users within minutes — on load tests designed for it (BlazeMeter).',
    },
    {
      id: 'live-api-redesign',
      title: 'Rebuilding a live API without users noticing',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'Rebuilding the foundations of a product while it runs, with no downtime and no broken screens for the people using it.',
      context:
        'The trader-facing FanTokens product was slow, unstable and expensive. Endpoints shipped payloads that were too heavy and not domain-oriented enough, 500 errors were recurring, and the page took 17 seconds to become usable. On this kind of product an inconsistent number is not a display defect — it is an investment decision taken on false information.',
      approach:
        'A full redesign of the API contracts around the business domain, run as an incremental migration rather than a rewrite: the hard constraint was that the rollout stay invisible to users, without breaking the frontend during the transition. On the same scope, making the token data served to traders consistent, redesigning the aggregation, and a TradingView integration where the backend produces clean datasets and the frontend injects them through the SDK — a data contract negotiated between two teams more than a library integration. The frontend was not left to others either: for eight sprints the tech lead joined that three-person team as its fourth developer — build configuration, image optimisation, features, fixes, test coverage and the e2e suite, in React and Next.js.',
      result:
        "Recurring 500s brought to zero and Time To Interactive from 17 to 3 seconds, lighter domain-focused payloads being the primary cause. Container image 1.7 GB → 200 MB, deployment from around 15 minutes to under 4, memory 1 GB → a few hundred MB, CPU 2 cores → 100 millicores — the deployment and the runtime footprint of those services are mine to own, on Kubernetes and ArgoCD, on a cluster operated alongside the devops team. A cost-reduction directive on the same scope answered by batching calls, moving to the provider's bulk endpoints and, above all, internalising part of the data with an in-house RPC client reading token information directly on-chain: €9,000 → €3,000 a year at equivalent quality. Shipped on call, incidents driven and coordinated through Rootly: work in progress stops until the mitigation lands, with tech leads, QA and product in the same room.",
    },
    {
      id: 'on-chain-operations',
      title: 'On-chain transactions that commit real funds',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'A service that places and readjusts money on markets by itself, where an order once sent cannot be called back.',
      context:
        'DeFi operations on Solana had to be run from the platform: swaps, pool creation, opening and closing liquidity positions, claiming rewards, rebalancing. A mistake here does not cost a retry — it costs money that has already gone.',
      approach:
        'A dedicated Node.js microservice integrating the Meteora SDK, with full on-chain reads over RPC and a Fireblocks layer for custody and transaction signing — signing being an external approval workflow with its own latency and failure modes, not a library call. Rolled out progressively: devnet first, then production with real funds. Scope stated plainly: SDK integration and transaction operation, no smart contract authoring. The third-party financial partner integrations built here — digital-asset custodians, exchange protocols — were later opened to other teams as a shared service.',
      result:
        'In production on real funds. The hard part is not submitting the order: you control neither finality nor confirmation delay, and the transaction you believe lost may already have landed. Idempotent signing, transaction state tracking and reconciliation against the chain as the source of truth are designed in, not handled afterwards.',
    },
    {
      id: 'enterprise-onboarding',
      title: 'Onboarding a new enterprise account in a day',
      org: 'Kiss The Bride',
      period: 'Jan 2018 – April 2022',
      plain:
        'Opening a new client account meant bespoke setup every time; it now fits inside a single day.',
      context:
        'A multi-tenant SaaS for sales-force engagement through gamification, sold to large enterprise accounts, running on a Symfony 2.7 / AngularJS monolith with no test coverage at all. Every client gets an isolated database, so every new account meant a bespoke setup.',
      approach:
        'Test coverage first: you do not migrate a monolith without a way to see the regressions. Then two migrations in parallel on a live system — Symfony 2.7 to 4 with API Platform, AngularJS to React. The contract had two consumers on separate release cycles, a web frontend and a mobile app, so payload conventions, an error taxonomy and API Platform guidelines were agreed before implementation rather than after. The deployment itself went behind an initialisation wizard written in Node.js and Jenkins orchestration.',
      result:
        'Onboarding a new enterprise account came down to one day. Sales-force rankings and results were delivered live through a Mercure integration over Server-Sent Events. Of four inherited juniors mentored over two years, one stayed and moved onto the mobile app served by the same API.',
    },
    {
      id: 'industrial-erp',
      title: 'Keeping an industrial ERP running in production',
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        'Looking after the software a manufacturer runs its whole business on, from suppliers to invoices, while it stayed in daily use.',
      context:
        'A complete ERP for industrial clients: suppliers, the production line, stock, invoicing and incident tracking, in one application the business could not do without for a single day.',
      approach:
        'Maintenance and change on a system in daily production use. Every correction and every evolution went into the application that held the stock and the invoices, where a regression reached the shop floor or the accounts the same day — so nothing was changed that could not first be checked.',
      result:
        'The ERP stayed in production throughout. It is the kind of application the Takeover is for: one a business depends on every day, and that has to keep running while it is looked after.',
    },
    {
      id: 'codebase-audit',
      title: "Auditing a codebase I didn't write",
      org: 'Civic tech, volunteer',
      period: '2026',
      plain:
        'Telling a team what in their code could cost them dearly — then fixing the critical parts myself.',
      context:
        'A volunteer team shipping fast across a three-app monorepo — a public site, a shop taking real payments, a back-office. No automated tests anywhere, a CI that only checked the build, and no map of what that was costing.',
      approach:
        'Read-only first, fixing nothing: four prioritised reports — 17 security findings, 11 on quality and debt, 6 on deployment weight, and an SEO audit scoring 56/100 across 34 findings — each item written as a card the team could pick up, with severity, effort and acceptance criteria. Then I took the critical ones myself.',
      result:
        'A free-cart path that trusted the client is now revalidated server-side, editorial content injected into structured data is escaped, security headers are global, and both the CI actions and the base image are pinned. The platform went from zero automated tests to covering its payment flows and admin authentication, with CodeQL in the pipeline.',
    },
    {
      id: 'open-data-directories',
      title: 'Association directories from open data',
      org: 'Personal project',
      period: '2026',
      plain:
        'Rebuilding by machine, in seconds, a directory that used to be compiled by hand, one town at a time.',
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
    careerLine: 'Hiring rather than contracting?',
    careerLink: 'My career is on LinkedIn.',
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

  offers: {
    audit: {
      name: 'Audit',
      plain:
        'An outside look at your application, written down: what could cost you dearly, and in what order to deal with it.',
    },
    takeover: {
      name: 'Takeover and maintenance',
      plain:
        'Taking back control of the application nobody dares touch any more, without breaking it, then keeping it alive every month.',
    },
    migration: {
      name: 'Migration without downtime',
      plain:
        'Moving a running system to a new version without stopping it, starting with a fixed-price plan.',
    },
    reliability: {
      name: 'Reliability',
      plain:
        'Making what your system does visible, so that a stock gap, a balance or a bug can be explained instead of guessed.',
    },
    reinforcement: {
      name: 'Senior reinforcement',
      plain: 'A part-time lead or architect inside your team, billed by the day.',
    },
  },

  offerPage: {
    kicker: 'Offer',
    sentences: 'What you say about it',
    delivered: 'What you get',
    steps: 'How it works',
    price: 'What it costs',
    disclaimer: 'An order of magnitude, not a quote.',
    tableCaption: 'Every range, excluding VAT',
    excludingVat: 'excl. VAT',
    perMonth: '/ month',
    weekOne: 'week',
    weekMany: 'weeks',
    fit: 'Is it the right choice?',
    goodChoice: 'A good choice when',
    notTheRightChoice: 'Not the right choice when',
    achievements: 'What proves it',
    faq: 'Questions',
    concepts: 'In two words',
    book: {
      kicker: 'First step',
      title: 'A 30-minute call, to see whether I can help.',
      text: 'Free and with no commitment: you describe the situation, and I tell you plainly whether this Offer is the right one, and if not, which is.',
      cta: 'Book a call',
      orWrite: 'Would rather write?',
      serviceArea: 'On site in {towns}; remotely everywhere else.',
    },
  },

  offerPages: {
    audit: {
      meta: {
        title: 'Application audit — Thomas Bouzy',
        description:
          'A written audit of your application: a report, a risk register and a prioritised action plan. Public prices, deducted from the engagement that follows.',
      },
      sentences: [
        "“Something is wrong, but we don't know where to start.”",
        "“Before we sign for a rewrite, we would like an opinion that isn't selling the rewrite.”",
        '“We are about to buy this company: what is its software actually worth?”',
      ],
      concepts: [
        {
          label: 'Footprint',
          gloss: 'Memory, CPU, image size and deployment treated as design, not as weather.',
        },
        {
          label: 'Build-vs-buy',
          gloss: 'What you keep buying, what you bring in-house, and where the line falls.',
        },
      ],
      delivered: [
        {
          title: 'A written report',
          text: 'What holds, what is fragile and what it costs, from the architecture to operations, read by someone with nothing in it to defend.',
        },
        {
          title: 'A risk register',
          text: 'Each risk with its severity, its likelihood and what it costs to leave in place, so that decisions are taken knowingly.',
        },
        {
          title: 'An action plan',
          text: 'The fixes in the order they pay back, each ready to pick up, with its estimated effort. The structural decisions are written as ADRs, so your team can argue with them.',
        },
      ],
      variant: {
        title: 'Variant: technical due diligence',
        text: 'Before an acquisition or a fundraise, the same work written for someone who is not the team: what the system is worth, what it will cost to evolve, and what could surprise you after signing.',
      },
      steps: [
        {
          title: 'A 30-minute call',
          text: 'You describe the system and what worries you. I tell you whether an audit is the right answer, and how deep it should go.',
        },
        {
          title: 'Read-only access',
          text: 'To the code, the documentation and, where possible, production metrics. Nothing is changed during the audit.',
        },
        {
          title: 'Reading and interviews',
          text: 'I read the system and talk to the people who run it: the risks the code does not show are often found there.',
        },
        {
          title: 'The read-out',
          text: 'The report, the register and the plan, presented and discussed with you and your team until every point is understood.',
        },
      ],
      estimator: {
        dimensions: {
          size: {
            label: 'Size of the system',
            options: {
              small: 'One application',
              medium: 'A few applications',
              large: 'A platform',
            },
          },
          depth: {
            label: 'Depth',
            options: { express: 'Express', full: 'Full' },
          },
        },
        amounts: { fee: 'Audit fee' },
        duration: 'Duration',
      },
      rules: [
        'If you then entrust me with the engagement that follows from it, the audit fee is deducted from it: an audit is never a sunk cost.',
      ],
      goodChoice: [
        'You sense a risk without being able to name it.',
        'You have to decide on a rewrite, a migration or an acquisition, and want an independent opinion first.',
        'Your team needs a prioritised list rather than a general impression.',
      ],
      notTheRightChoice: [
        'You already know what is wrong: Reliability, or a takeover, gets there more directly.',
        'The system is down right now: service has to come back first, the audit comes after.',
        'You are looking for a decision already taken to be validated: the audit will say what it finds.',
      ],
      faq: [
        {
          question: 'Do I have to give you access to production?',
          answer:
            'No. Read access to the code is enough for the express audit. For the full audit, production metrics or logs make the diagnosis much sharper, and stay read-only.',
        },
        {
          question: 'What if the audit concludes everything has to be rewritten?',
          answer:
            'It will say so, with what it costs not to. It is rarely the conclusion: most systems can be taken back piece by piece, without stopping everything.',
        },
        {
          question: 'Why a range rather than a price?',
          answer:
            'Because the price depends on the real size of the system, which we measure during the first call. The quote itself is firm before anything starts.',
        },
      ],
    },
    migration: {
      meta: {
        title: 'Migration without downtime — Thomas Bouzy',
        description:
          'Moving a production system to a new version without stopping it: a fixed-price plan, then execution alongside your team. Public prices.',
      },
      sentences: [
        '“The version upgrade is always for next quarter.”',
        "“We're stuck on a version that no longer gets security fixes.”",
      ],
      concepts: [
        {
          label: 'Invisible redesign',
          gloss: 'Payloads rebuilt underneath their consumers, without breaking a single one.',
        },
      ],
      delivered: [
        {
          title: 'A migration plan',
          text: 'The order of the steps, what each one risks and how to roll it back, costed: enough to decide before spending more.',
        },
        {
          title: 'A migration in steps',
          text: 'The system changes underneath the people using it, with no stop window: two versions coexist for as long as needed, and no longer.',
        },
        {
          title: 'A team that can do it again',
          text: "Execution happens with your team, not instead of it: the next upgrade won't depend on me.",
        },
      ],
      steps: [
        {
          title: 'Phase 1: the plan, at a fixed price',
          text: 'I read the system, measure the version gap and the test coverage, and write the plan. You can stop there: the plan is yours.',
        },
        {
          title: 'The safety net, where it is missing',
          text: 'Where tests are missing, they are written first: that is what lets you see a regression before your users do.',
        },
        {
          title: 'Phase 2: execution',
          text: 'Step by step with your team, each step shipped to production before the next, billed by the day.',
        },
        {
          title: 'The end of coexistence',
          text: 'The old path is removed as soon as the new one has proved itself, so the transition does not become the permanent state.',
        },
      ],
      estimator: {
        dimensions: {
          gap: {
            label: 'Version gap',
            options: {
              one: 'One major version',
              two: 'Two major versions',
              'three-plus': 'Three or more',
            },
          },
          coverage: {
            label: 'Existing test coverage',
            options: { good: 'Good', partial: 'Partial', none: 'None' },
          },
        },
        amounts: { plan: 'Plan, phase 1 at a fixed price' },
        duration: 'Execution, with your team',
      },
      rules: [
        'A Migration is sold in two phases: a fixed-price plan first, then execution alongside your team, billed by the day. You decide on the second with the plan in hand.',
      ],
      goodChoice: [
        'Your system runs continuously and cannot stop to migrate.',
        'The upgrade slips from quarter to quarter, for good reasons.',
        'You want a serious estimate before committing to the bulk of the work.',
      ],
      notTheRightChoice: [
        'The system can stop for a weekend without harm: a conventional migration will cost less.',
        'You want to replace the system rather than evolve it: that is another decision, which an Audit can inform.',
        'Nobody on your side will be able to take the system on afterwards: look at a takeover instead.',
      ],
      faq: [
        {
          question: 'Why does test coverage move the price so much?',
          answer:
            'Because without tests, every step has to be checked by hand, or the tests written first. It is the first cost driver of a migration, well ahead of the version gap.',
        },
        {
          question: 'Does the plan commit me to doing the rest with you?',
          answer: 'No. It is yours: you can follow it with your own team, or with someone else.',
        },
        {
          question: 'What does execution cost?',
          answer:
            'It is billed by the day, at the published rate; the estimator gives its duration. The plan costs it precisely for your system.',
        },
      ],
    },
    reliability: {
      meta: {
        title: 'Reliability — Thomas Bouzy',
        description:
          'Making a system observable and its flows traceable, so a stock gap, a balance or a bug can be explained instead of guessed. Public prices.',
      },
      sentences: [
        "“The stock (or the balance) doesn't add up, and nobody knows why.”",
        '“Our customers are the ones who find the bugs.”',
        '“We credited the same payout twice, and only saw it at reconciliation.”',
      ],
      concepts: [
        {
          label: 'Traceable',
          gloss:
            'Every movement kept as a dated fact; the balance replays instead of being guessed.',
        },
      ],
      delivered: [
        {
          title: 'Traceable flows',
          text: 'Every movement of stock, of a batch or of money kept as a dated fact: you replay the history instead of reconstructing what must have happened.',
        },
        {
          title: 'An observable system',
          text: 'Dashboards per service and alerts on the signals that precede a failure, so you learn about a problem before your customers do.',
        },
        {
          title: 'Double execution, dealt with',
          text: 'A replayed job must not have two effects. The flows that matter become idempotent: a message received twice is applied once.',
        },
      ],
      steps: [
        {
          title: 'The flows that matter',
          text: 'We pick together the ones where a discrepancy really costs: stock, batches, invoicing, payments.',
        },
        {
          title: 'Instrumentation',
          text: 'Those flows are traced end to end, and discrepancies become visible the moment they happen.',
        },
        {
          title: 'Fixes',
          text: 'The causes found are fixed, starting with the ones that cost most, double execution included.',
        },
        {
          title: 'Handover',
          text: 'Your teams can read the dashboards and act on the alerts: the tooling stays when I leave.',
        },
      ],
      estimator: {
        dimensions: {
          flows: {
            label: 'Flows or services to make reliable',
            options: { few: '1 to 2', some: '3 to 5', many: '6 to 10' },
          },
        },
        amounts: { fee: 'Price' },
        duration: 'Duration',
      },
      rules: [],
      goodChoice: [
        'A figure does not add up, and explaining it takes days.',
        'You learn about your incidents from your customers.',
        'A job has already run twice, and you want it never to happen again.',
      ],
      notTheRightChoice: [
        "You don't know yet where the problem is: an Audit will locate it first.",
        'Nobody is left to maintain the application: a takeover starts there.',
        'You only want a monitoring tool installed: that is one means, not reliability.',
      ],
      faq: [
        {
          question: 'Do we have to change monitoring tools?',
          answer:
            'Rarely. We start from what you have: what matters is knowing what to observe, not the tool.',
        },
        {
          question: 'What is a double execution, concretely?',
          answer:
            'The same job applied twice: a payout credited twice, a batch taken out of stock twice. It nearly always comes from a replayed message, and is prevented in the design rather than after the fact.',
        },
        {
          question: 'What about stock rather than money?',
          answer:
            'It is the same problem: a discrepancy nobody can explain. The same methods apply to stock, to batches or to invoicing.',
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Senior reinforcement — Thomas Bouzy',
        description:
          'A part-time lead or architect inside your team, billed by the day. A published day rate, and two clients at a time, never more.',
      },
      sentences: [
        '“We need someone senior, but not full time.”',
        "“The team is good; it's missing someone to settle the architecture.”",
      ],
      concepts: [
        {
          label: 'Shared service',
          gloss: "Born of one squad's need, opened to the other teams that turned out to have it.",
        },
        {
          label: 'Handover',
          gloss: 'Architecture reviews, onboarding, a written trail a newcomer can argue with.',
        },
      ],
      delivered: [
        {
          title: 'A lead inside the team',
          text: 'Code and architecture reviews, decisions written as ADRs, technical priorities settled: the role, without the hire.',
        },
        {
          title: 'Code shipped',
          text: 'Not only opinions: I take on work, ship it, and have it reviewed like everyone else.',
        },
        {
          title: 'A team that grows',
          text: 'Onboarding, reviews, a written trail a newcomer can argue with: what I know stays when I leave.',
        },
      ],
      steps: [
        {
          title: 'A 30-minute call',
          text: 'Your team, your system, what is missing. We agree on the number of days a week.',
        },
        {
          title: 'The first two weeks',
          text: 'I read the system and meet the team before proposing anything.',
        },
        {
          title: 'Cruising speed',
          text: 'The same days every week, in your tools and your rituals, like a member of the team.',
        },
        {
          title: 'The exit',
          text: 'When the need is covered, I leave behind the written trail that lets you carry on without me.',
        },
      ],
      estimator: {
        dimensions: {
          days: {
            label: 'Days per week',
            options: {
              '1': '1 day',
              '2': '2 days',
              '3': '3 days',
              '4': '4 days',
              '5': '5 days, full time',
            },
          },
        },
        amounts: { monthly: 'Per month' },
      },
      rules: [
        'I work with two clients at a time, never more: each gets my attention, not a place in a queue.',
      ],
      dayRate: {
        label: 'Day rate:',
        note: 'lower for long full-time engagements.',
      },
      goodChoice: [
        'Your team needs someone senior, but not a full-time hire.',
        'An architecture decision is waiting for someone to settle it and write it down.',
        'You want your developers to grow, not only to ship.',
      ],
      notTheRightChoice: [
        'You are looking for someone full time for years: a hire will serve you better.',
        'The work is a well-bounded project: a fixed-price Migration or Reliability engagement will be clearer.',
        'You have no technical team: a takeover is made for that case.',
      ],
      faq: [
        {
          question: 'What is the minimum?',
          answer: 'One day a week. Below that, you cannot keep up with the team.',
        },
        {
          question: 'Why two clients at most?',
          answer:
            'Because beyond that, each one gets a distracted consultant. The rule does not move, whatever the demand.',
        },
        {
          question: 'Do you work remotely?',
          answer: 'Yes, it is the default, with travel when the work needs a room.',
        },
      ],
    },
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
