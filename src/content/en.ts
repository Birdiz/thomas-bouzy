import type { ResumeContent } from './types.ts';

/*
 * `{credit}`, `{dayRate}` and `{maxDays}` are read from prices.ts when the page
 * is built (src/lib/price-tokens.ts): a price is never copied into prose.
 */
export const en = {
  meta: {
    title: 'Thomas Bouzy — Software engineer',
    description:
      'Software engineer: I build tools for the core business of small and mid-sized companies, and I take over, stabilise and upgrade the business applications they run on, without downtime. Remote, or on site in eastern France.',
  },

  a11y: {
    skipToContent: 'Skip to content',
    languageSwitcher: 'Language',
    switchToOther: 'Lire en français',
    breadcrumb: 'Breadcrumb',
    mainNavigation: 'Main',
    portraitAlt: 'Portrait of Thomas Bouzy',
    otherHome: 'Accueil en français',
  },

  nav: {
    home: 'Home',
    offers: 'Offers and prices',
    partners: 'Partners',
    publicSector: 'Public sector',
    work: 'References',
    about: 'About',
    contact: 'Book a call',
  },

  hero: {
    role: 'Software engineer',
    region: 'Eastern France',
    title: 'I build tools for the core business of small and mid-sized companies',
    blurb: 'Starting with the software you already run, without stopping it.',
    ctaBook: 'Book a free call',
    ctaSecondary: 'See the offers',
    proof:
      'I was on the team that kept the ERP of several ArcelorMittal plants running, then on the one that made the money of 1.5 million users traceable. I taught programming at the University of Reims.',
  },

  problem: {
    audit: {
      text: 'Not sure?',
      cta: 'Start with an audit',
    },
    kicker: 'Already have the software?',
    title:
      'I take over your business software and keep it moving, even the one nobody dares touch any more.',
    lead: 'Without stopping it, without rewriting everything.',
    question: 'Do any of these sound familiar?',
  },

  failureModes: [
    {
      quote: '“The person who built our app has left, and nobody dares touch it any more.”',
      offer: 'takeover',
    },
    {
      quote: '“The upgrade is always for next quarter.”',
      offer: 'migration',
    },
    {
      quote: '“The stock never adds up, and nobody knows why.”',
      offer: 'reliability',
    },
    {
      quote: '“Our customers are the ones who find the bugs.”',
      offer: 'reliability',
    },
    {
      quote: '“The day of the big campaign, everything goes down.”',
      offer: 'scaling',
    },
  ],

  work: {
    kicker: 'References',
    title: 'Software that could not stop',
    intro: 'Industry, finance, large accounts, non-profits, a village.',
    labelPlain: 'In plain terms:',
    labelApproach: 'Approach',
    approachFor: 'for technical teams',
    labelResult: 'Result',
  },

  achievements: [
    {
      id: 'industrial-erp',
      title: 'Keeping the ERP of several ArcelorMittal plants running',
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        'Looking after the software several plants rely on every day, from suppliers to invoices.',
      approach: 'The whole chain, from suppliers to incidents: nothing went out unchecked.',
      result: 'In production throughout.',
    },
    {
      id: 'live-api-redesign',
      title: 'Rebuilding a live product without its users noticing',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'Rebuilding the foundations of a product while it runs, without a single outage for the people using it.',
      approach:
        'A slow, unstable trading product, rebuilt in steps in React and Next.js, the frontend never broken. Deployment on Kubernetes and ArgoCD was mine to own.',
      result:
        '500 errors down to zero, the page usable in 3 seconds instead of 17, deployment from 15 minutes to 4, purchased data from €9,000 to €3,000 a year. Incidents driven through Rootly.',
    },
    {
      id: 'wallet-event-sourcing',
      title: 'Tracing the money of 1.5 million users',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        "Making every movement in a wallet traceable, instead of only ever knowing today's balance.",
      approach:
        'Event Sourcing and an outbox over SNS/SQS: every movement becomes a stored, replayable fact.',
      result:
        '1,000+ transactions a minute, peaks of 10,000–20,000 users load-tested. Alerts before failure (OpenTelemetry and Datadog): reported bugs from about twenty a month to five.',
    },
    {
      id: 'on-chain-operations',
      title: 'Moving real money, with no room for error',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'A service that places and readjusts money on markets by itself, where an order once sent cannot be called back.',
      approach:
        'DeFi operations on Solana, from a Node.js microservice with the Meteora SDK and Fireblocks for signing. SDK integration and transaction operation, no smart contract authoring.',
      result:
        'In production on real funds, with idempotent signing and reconciliation against the chain.',
    },
    {
      id: 'acquired-app-migration',
      title: "Bringing an acquired application into the company's ecosystem",
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'Taking over an application written by others, and migrating it onto the systems of the company that bought it.',
    },
    {
      id: 'enterprise-onboarding',
      title: 'Onboarding a new enterprise account in a day',
      org: 'Kiss The Bride',
      period: 'Jan 2018 – April 2022',
      plain: 'Every new client used to need setting up by hand; it now takes a single day.',
      approach:
        'A Symfony 2.7 monolith with no tests at all. Tests first, then Symfony 4 with API Platform and React, without stopping; onboarding automated with Node.js and Jenkins.',
      result: 'Rankings delivered live through Mercure. Four juniors mentored over two years.',
    },
    {
      id: 'codebase-audit',
      title: "Auditing a codebase I didn't write",
      org: 'Civic projects, volunteer',
      period: '2026',
      plain:
        'Telling a team what in their code could cost them dearly, then fixing the most critical parts myself.',
      approach:
        'Three apps with no tests at all, one of them a shop taking payments. Four prioritised reports, including 17 security findings.',
      result:
        'The cart is revalidated server-side; payments and admin authentication tested, CodeQL in the pipeline.',
    },
    {
      id: 'open-data-directories',
      title: 'Rebuilding in 40 seconds a directory once compiled by hand',
      org: 'For a client',
      period: '2026',
      plain:
        'Rebuilding in seconds a directory that used to be compiled by hand, one town at a time.',
      approach:
        "Open data, enriched from the public sites of local authorities, with the provenance of every value. Local-first: one SQLite file on the user's machine.",
      result: 'On Ille-et-Vilaine, 31,273 associations from 332 communes in 40 seconds.',
      link: {
        href: 'https://github.com/Birdiz/annuaire-vie-associative/releases',
        label: 'The published releases',
      },
    },
    {
      id: 'staircase-calculator',
      title: 'Calculating a wooden staircase, from plan to cut',
      org: 'Personal product',
      period: '2026',
      plain:
        'A joiner answers six questions and gets the plan, 3D view, workshop sheet and machine files.',
      approach:
        'A calculation engine kept apart from the interface, in TypeScript. 3D in Three.js, DXF export.',
      result: 'Online, by subscription, usable without a network.',
      link: {
        href: 'https://quart-de-tour.fr',
        label: 'Try Quart de tour (in French)',
      },
    },
    {
      id: 'village-website',
      title: 'Giving a village its official website',
      org: 'Commune of Grandrupt, volunteer work',
      period: '2026',
      plain:
        'Opening hours, procedures and news in one place, and a town hall that publishes for itself.',
      approach: 'In three languages, on Next.js, with a role-based Payload CMS back office.',
      result:
        'Handed over to the commune, with its accessibility statement published: partially compliant.',
      link: {
        href: 'https://village-de-grandrupt.fr',
        label: 'See the site',
      },
    },
  ],

  references: {
    arcelormittal: {
      name: 'ArcelorMittal',
      nature: 'Employee at Quadra Informatique',
      sector: 'Industry',
      period: '2016 – 2017',
      headline: 'The ERP of several plants, kept in service, from suppliers to invoices.',
    },
    socios: {
      name: 'Socios.com (Chiliz)',
      nature: 'Employee',
      sector: 'Finance · 1.5 million users',
      period: '2022 – 2026',
      headline:
        'A product rebuilt without an outage, every money movement traced, reported bugs cut by four.',
    },
    'kiss-the-bride': {
      name: 'Kiss The Bride',
      nature: 'Freelance engagement',
      sector: 'Online software for large accounts',
      period: '2018 – 2022',
      headline:
        'A new enterprise account live in a day, on software taken over without ever stopping it.',
    },
    'civic-tech': {
      name: 'Civic projects',
      nature: 'Volunteer',
      sector: 'Non-profits',
      period: '2026',
      headline: 'Three applications audited, 17 security findings, the critical ones fixed.',
    },
    'open-data': {
      name: 'Association directory',
      nature: 'For a client',
      sector: 'Public data',
      period: '2026',
      headline: '31,273 associations listed in 40 seconds, instead of by hand.',
    },
    'quart-de-tour': {
      name: 'Quart de tour',
      nature: 'Personal product',
      sector: 'Joinery',
      period: '2026',
      headline: 'A wooden staircase worked out online, from the plan to the cutting files.',
    },
    grandrupt: {
      name: 'Village of Grandrupt',
      nature: 'Volunteer work',
      sector: 'Local government',
      period: '2026',
      headline: "A village's official website, in three languages.",
    },
  },

  about: {
    kicker: 'About',
    title: 'Who picks up',
    paragraphs: [
      'When you call, I am the one who picks up. For about twelve years, I have built and maintained software that companies depend on every day.',
      'What I enjoy is the problem: understanding what your business needs and meeting it. The tech comes second. Some find me too direct: for you, that means advice with no sugar coating. I live in the Grand Est countryside.',
    ],
    more: 'Read more',
    careerLink: 'My full career is on LinkedIn.',
  },

  languages: [
    { name: 'French', level: 'native' },
    { name: 'English', level: 'C1 — full professional' },
    { name: 'German', level: 'B1 — professional basics' },
  ],

  schema: {
    jobTitle: 'Software engineer',
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
    kicker: 'Offers',
    title: 'One offer per situation, each with its price.',
    situations: [
      { title: 'Your software is giving you trouble' },
      { title: 'You are missing a tool', sentence: '“Our whole business runs on a spreadsheet.”' },
      { title: 'Do you have a technical team?' },
    ],
    more: 'See the offer and its price',
    from: { fee: 'from', setup: 'from', plan: 'from', monthly: 'from' },
    followedBy: 'then',
    start: 'Where to start',
    inFrench: '(in French)',
    book: { text: 'Already know what you need?', cta: 'Book a free call' },
    publicSector: 'A local authority?',
    publicSectorLink: 'See the dedicated page (in French)',
    partners: 'An agency or an IT services firm?',
    partnersLink: 'See the partners page (in French)',
  },

  offers: {
    audit: {
      name: 'Audit',
      plain:
        'A written opinion, with no rewrite to sell: what could cost you dearly, and where to start.',
    },
    takeover: {
      name: 'Takeover and maintenance',
      plain:
        'I take over your application without breaking anything, then maintain it month by month, with no commitment.',
    },
    migration: {
      name: 'Migration without downtime',
      plain: 'I upgrade your software in steps, without stopping it, before the bill grows.',
      phase: 'plan',
    },
    reliability: {
      name: 'Reliability',
      plain: 'You know where a stock gap comes from, and you see a bug before your customers do.',
    },
    scaling: {
      name: 'Scaling',
      plain: 'I reproduce your peak before the big day, then fix whatever gives way first.',
      phase: 'diagnosis',
    },
    build: {
      name: 'Custom build',
      plain: 'I build the tool you are missing, designed so that you do not depend on me.',
      phase: 'framing',
    },
    reinforcement: {
      name: 'Senior reinforcement',
      plain: 'I join your team 1 to {maxDays} days a week, to settle decisions and ship.',
    },
  },

  offerPage: {
    sentences: 'Does this sound like you?',
    delivered: 'What you receive',
    disclaimer: 'An order of magnitude, not a quote.',
    tableCaption: 'Every range, excluding VAT',
    excludingVat: 'excl. VAT',
    perMonth: '/ month',
    weekOne: 'week',
    weekMany: 'weeks',
    notTheRightChoice: 'Not the right choice if…',
    achievements: 'What proves it',
    faq: 'Frequently asked questions',
    who: "I'm the one who picks up: Thomas Bouzy, software engineer in eastern France.",
    book: {
      kicker: 'First step',
      title: 'A free 30-minute call.',
      text: 'I tell you plainly whether this offer is the right one, and if not, which is.',
      cta: 'Book a call',
      orWrite: 'Would rather write?',
      serviceArea: 'On site in {towns}; remotely everywhere else.',
    },
  },

  offerPages: {
    audit: {
      meta: {
        title: 'Code audit and technical due diligence',
        description:
          'A written audit of your system: report, risk register and prioritised action plan. The express audit, at a fixed price, is credited against the next engagement.',
      },
      heading: 'A technical audit of your application',
      priceHeading: 'How much does a code audit cost?',
      sentences: [
        "“Something feels wrong, but we don't know where to start.”",
        "“Before we sign for a rewrite, we want an opinion that isn't selling the rewrite.”",
      ],
      delivered: [
        {
          title: 'A written report',
          text: 'After reading the code and talking to the team, without changing anything: what holds and what costs.',
        },
        {
          title: 'A risk register',
          text: 'Each risk, its severity, and the price of leaving it in place.',
        },
        {
          title: 'An action plan, presented to the team',
          text: 'The fixes in the order they pay back, discussed until they are understood.',
        },
      ],
      variant: {
        title: 'Variant: technical due diligence',
        text: 'Before an acquisition or a fundraise: what the software is worth, and what could surprise you after signing.',
      },
      estimator: {
        dimensions: {
          depth: {
            label: 'Depth',
            options: { express: 'Express', full: 'Full' },
            notes: {
              express:
                'Under three days, on the application that worries you most, whatever the size of the system.',
              full: 'The whole system, priced on its real size. The quote is firm before anything starts.',
            },
          },
          size: {
            label: 'Size of the system',
            options: {
              small: 'One application',
              medium: 'A few applications',
              large: 'A platform',
            },
          },
        },
        amounts: { fee: 'Audit fee' },
        duration: 'Duration',
      },
      rules: [
        'If you then entrust me with the engagement that follows, {credit} of the audit fee is deducted from it.',
      ],
      notTheRightChoice: [
        {
          text: 'Nobody is left to look after your application: start with {offer}.',
          offer: 'takeover',
        },
        {
          text: 'You want a decision already taken to be validated: the audit will say what it finds.',
        },
      ],
      faq: [
        {
          question: 'What if the audit concludes everything has to be rewritten?',
          answer:
            'It will say so, with what it costs not to. It is rare: a system can almost always be taken back piece by piece.',
        },
        {
          question: 'Why a fixed price for the express audit, and a range for the full one?',
          answer:
            'The express audit is capped at under three days, on the application that worries you most. The full one depends on the real size of the system; its quote is firm before anything starts.',
        },
        {
          question: 'Which technologies?',
          answer:
            'An architecture and its risks read the same in any stack. My home ground is PHP and Symfony; I also work in Node.js, TypeScript and React. Python, so far in personal projects.',
        },
      ],
    },
    migration: {
      meta: {
        title: 'Zero-downtime Symfony & PHP upgrades',
        description:
          'Upgrading Symfony or PHP on a system that cannot stop: a fixed-price plan, then execution alongside your team. Public prices.',
      },
      heading: 'Symfony and PHP upgrades without downtime',
      priceHeading: 'How much does a Symfony upgrade cost?',
      sentences: ["“We're stuck on a PHP version that no longer gets security fixes.”"],
      delivered: [
        {
          title: 'Phase 1: a costed plan',
          text: 'The steps of your PHP or Symfony upgrade, their risks and how to roll each one back. The plan is yours.',
        },
        {
          title: 'Phase 2: the migration, with your team',
          text: 'Step by step, missing tests first; old and new coexist for as long as needed.',
        },
        {
          title: 'A team that can do it again',
          text: "The old code removed, and a team that won't need me next time.",
        },
      ],
      estimator: {
        dimensions: {
          gap: {
            label: 'Symfony version gap',
            options: {
              one: 'One major version',
              two: 'Two major versions',
              'three-plus': 'Three or more',
            },
          },
          coverage: {
            label: 'Existing test coverage',
            options: { good: 'Good', partial: 'Partial', none: 'None' },
            help: 'The share of the software checked by automated tests. Not sure? Choose “None”: that is the high estimate.',
          },
        },
        amounts: { plan: 'Plan, phase 1 at a fixed price' },
        duration: 'Execution, with your team',
        total: {
          label: 'Total budget, at most',
          note: 'The plan, then execution at {maxDays} days a week.',
        },
      },
      rules: [
        'A Migration is sold in two phases: a fixed-price plan, firm before work starts, then execution at {dayRate} excl. VAT a day. You decide on the second with the plan and a written ceiling in hand.',
        'During execution, I work up to {maxDays} days a week with your team.',
      ],
      notTheRightChoice: [
        {
          text: 'Your application can stop for a weekend without harm: its upgrade fits into {offer}, for less.',
          offer: 'takeover',
        },
        {
          text: 'You want to replace it rather than evolve it: an {offer} will inform that choice.',
          offer: 'audit',
        },
      ],
      proof: {
        'enterprise-onboarding':
          'Software with no tests at all, upgraded two major versions without ever stopping it: tests first.',
      },
      faq: [
        {
          question: 'Why does test coverage weigh so much on the price of a Symfony upgrade?',
          answer:
            'Without tests, every step is checked by hand. It is the first cost driver, ahead of the version gap.',
        },
        {
          question: 'What if a step breaks something?',
          answer:
            'Every step has its rollback, written in the plan. We go back, fix it, and go again.',
        },
      ],
    },
    reliability: {
      meta: {
        title: 'Reliable systems: traceable flows, observability',
        description:
          "A balance, a stock or an invoice that won't reconcile? Traceable flows, idempotent processing and observability to explain it. Public prices.",
      },
      heading: 'Knowing where each gap comes from, instead of guessing',
      priceHeading: 'How much does reliability work cost?',
      sentences: ['“We billed the same customer twice, and nobody noticed.”'],
      delivered: [
        {
          title: 'The flows that matter, chosen together',
          text: 'The ones where a discrepancy costs: stock, invoicing, payments.',
        },
        {
          title: 'Every movement kept and dated',
          text: 'For each gap, you find the operation that caused it.',
        },
        {
          title: 'No more duplicates',
          text: 'An order or a payment received twice is recorded once.',
        },
        {
          title: 'Alerts before your customers',
          text: 'And teams that can read them once I leave.',
        },
      ],
      estimator: {
        dimensions: {
          flows: {
            label: 'Flows to make reliable',
            options: { few: '1 to 2', some: '3 to 5', many: '6 to 10' },
            notes: {
              few: 'A flow is the path a movement takes from end to end: from the order to the stock, from the payment to the balance.',
              some: 'The flows of one line of business, for instance the order, the stock and the invoice.',
              many: 'The money and goods flows of a whole system, often spread over several services.',
            },
          },
        },
        amounts: { fee: 'Price' },
        duration: 'Duration',
      },
      rules: [
        'The price is fixed before the work starts, once we have chosen the flows together.',
        'If an Audit located the problem, {credit} of its fee is deducted.',
      ],
      notTheRightChoice: [
        {
          text: "You don't know yet where the problem is: an {offer} will locate it first.",
          offer: 'audit',
        },
        {
          text: 'Your figures are right, but the system slows down or falls over at the peak: {offer} deals with that.',
          offer: 'scaling',
        },
        {
          text: 'You only want a monitoring tool installed: that is only a means.',
        },
      ],
      faq: [
        {
          question: 'What is a double execution, concretely?',
          answer:
            'A transfer credited twice, a batch taken out of stock twice. It can be fixed on a running system: each process learns to recognise what it has already done.',
        },
        {
          question: 'Do we have to change monitoring tools?',
          answer: 'Rarely. We start from what you have: what matters is knowing what to observe.',
        },
        {
          question: 'Which technologies?',
          answer:
            'Tracing a flow does not depend on the language. My home ground is PHP and Symfony; I also work in Node.js, TypeScript and React. Python, so far in personal projects.',
        },
      ],
    },
    scaling: {
      meta: {
        title: 'Scaling an application under load, with high availability',
        description:
          'Does your application slow down or fall over at peak traffic? Load test, bottleneck found, measured fixes: a fixed-price diagnosis. Public prices.',
      },
      heading: 'Scaling and high availability for your application',
      priceHeading: 'How much does a load diagnosis cost?',
      sentences: [
        '“It crawls as soon as we get busy.”',
        '“We doubled the servers, and nothing changed.”',
      ],
      delivered: [
        {
          title: 'Phase 1: a load test that reproduces your peak',
          text: 'Before changing anything: we start from a number, not an impression.',
        },
        {
          title: 'The bottleneck, found and costed',
          text: 'Database, cache, message queues or code: what gives way first, and what each fix buys.',
        },
        {
          title: 'Phase 2: the fixes, measured',
          text: 'Each one goes back under the same load test.',
        },
        {
          title: 'A system that fails gracefully',
          text: 'If one part fails, the rest keeps running, in a reduced mode. You keep the load test and the steps to follow in an incident.',
        },
      ],
      estimator: {
        dimensions: {
          services: {
            label: 'Services involved',
            options: { one: 'One service', some: '2 to 5', many: '6 or more' },
          },
          observability: {
            label: 'Existing monitoring',
            options: { good: 'Good', partial: 'Partial', none: 'None' },
            help: 'What you already measure of the running software: errors, slowness, alerts. Not sure? Choose “None”: that is the high estimate.',
          },
        },
        amounts: { plan: 'Diagnosis, phase 1 at a fixed price' },
        duration: 'Duration of the fixes',
        total: {
          label: 'Total budget, at most',
          note: 'The diagnosis, then the fixes at {maxDays} days a week.',
        },
      },
      rules: [
        'Scaling always starts with a load test that reproduces the peak, before any change.',
        'It is sold in two phases: the fixed-price diagnosis, then the fixes at {dayRate} excl. VAT a day. You decide on the second with the diagnosis and a written ceiling in hand.',
      ],
      notTheRightChoice: [
        {
          text: 'The problem is a wrong figure, not a slow system: {offer} deals with that.',
          offer: 'reliability',
        },
        {
          text: "You don't know yet where the problem is: an {offer} will locate it first.",
          offer: 'audit',
        },
      ],
      proof: {
        'wallet-event-sourcing':
          'More than 1,000 transactions a minute, peaks of 10,000 to 20,000 users load-tested.',
      },
      faq: [
        {
          question: "Isn't adding servers enough?",
          answer:
            'Rarely. If the bottleneck is the database or an external service, ten servers wait for it together. The load test says where it is.',
        },
        {
          question: 'Why does existing monitoring weigh on the price?',
          answer:
            'Without metrics, the system has to be instrumented before we can see what gives way. That is work before the first number, and to measure each fix.',
        },
        {
          question: 'Could the load test bring production down?',
          answer:
            'It runs on a faithful copy, or on production in steps, outside peak hours, with a stop ready.',
        },
        {
          question: 'And technically?',
          answer:
            'Backpressure on queues, circuit breakers, a degraded mode: in a distributed system, one part failing no longer takes the rest down. The load scenario stays in your CI, with an incident runbook.',
        },
        {
          question: 'Which technologies?',
          answer:
            'A load test does not depend on the language. My home ground is PHP and Symfony; I also work in Node.js, TypeScript and React. Python, so far in personal projects.',
        },
      ],
    },
    build: {
      meta: {
        title: 'Custom business application development, front end and back end',
        description:
          'A custom business application, front end and back end, built to be taken over: a fixed-price framing, then development by the day. Public prices.',
      },
      heading: 'Custom build: the business tool you are missing',
      priceHeading: 'How much does a new business tool cost?',
      sentences: [
        '“Our whole business runs on a spreadsheet everyone edits at the same time.”',
        '“We have the idea for the service, not the team to build it.”',
      ],
      delivered: [
        {
          title: 'Phase 1: the framing, at a fixed price',
          text: 'The architecture, the decisions written down, and a first skeleton that runs end to end. It is yours.',
        },
        {
          title: 'Phase 2: the build, tested from the first week',
          text: 'Delivered in steps you use, not in one block at the end.',
        },
        {
          title: 'A handover, not a dependency',
          text: 'The code, the tests and the written decisions: another team can take over without me. It is what the applications I take over are missing.',
        },
      ],
      estimator: {
        dimensions: {
          size: {
            label: 'What needs building',
            options: {
              small: 'An internal tool',
              medium: 'Business software',
              large: 'A critical service',
            },
          },
          integrations: {
            label: 'Systems to connect',
            options: { none: 'None', few: '1 or 2', many: '3 or more' },
          },
        },
        amounts: { plan: 'Framing, phase 1 at a fixed price' },
        duration: 'Build duration, by the day',
        total: {
          label: 'Total budget, at most',
          note: 'The framing, then the build at {maxDays} days a week.',
        },
      },
      rules: [
        'A Custom build never replaces a running system: that is a Migration, or first an Audit.',
        'It is sold in two phases: the fixed-price framing, then the build at {dayRate} excl. VAT a day. You decide on the second with the framing and a written ceiling in hand.',
      ],
      notTheRightChoice: [
        {
          text: 'Your application already exists and runs: a {offer} will bring it up to date step by step, instead of replacing it.',
          offer: 'migration',
        },
        {
          text: 'An off-the-shelf product already does the job: take it. If you are unsure, the free call is there to settle that too.',
        },
      ],
      faq: [
        {
          question: 'How much does the build cost?',
          answer:
            "It is billed at {dayRate} excl. VAT a day, {maxDays} days a week at most: the estimator's total budget is therefore a ceiling. The framing narrows it down in writing before you decide on the rest.",
        },
        {
          question: "Our ERP comes from a vendor and we don't have its code. Is that a problem?",
          answer: 'No. I work around it: its exports, links to your other tools, automation.',
        },
        {
          question: 'Why does the number of systems to connect weigh on the price?',
          answer:
            'Each system to connect (ERP, payments, accounting) has its own rules, failures and delays. That is where a project overruns, more often than in the screens.',
        },
        {
          question: 'And once the application is delivered?',
          answer:
            'Your team or another one takes it over with the tests and the written decisions, or I maintain it monthly, under a Takeover.',
        },
        {
          question: 'Which technologies?',
          answer:
            'We choose together what a team will be able to take over after me. My home ground is PHP and Symfony; I also work in Node.js, TypeScript and React. Python, so far in personal projects.',
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Part-time tech lead / architect, PHP/Symfony and Node.js',
        description:
          'A senior lead or architect inside your team, one to four days a week: PHP/Symfony, Node.js/TypeScript, React. Published day rate.',
      },
      heading: 'A part-time senior lead inside your team',
      priceHeading: 'How much does a part-time tech lead cost?',
      sentences: [
        '“We need someone senior, but not full time.”',
        "“The team is good; it's missing someone to settle the architecture.”",
      ],
      delivered: [
        {
          title: 'The first days to understand',
          text: 'I read the system and meet the team before proposing anything.',
        },
        {
          title: 'A lead inside the team',
          text: 'Reviews, written decisions, priorities settled, on the same days every week.',
        },
        {
          title: 'Code shipped',
          text: 'Not only opinions: I ship, and have my work reviewed.',
        },
        {
          title: 'A clean exit',
          text: 'I leave the written trail that lets you carry on without me.',
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
            },
          },
        },
        amounts: { monthly: 'Your budget' },
        daysIncluded: 'About {days} days at the day rate',
      },
      rules: ['{maxDays} days a week at most, whoever the client.'],
      dayRate: {
        label: 'Day rate:',
        note: 'the same for a direct client and for an agency.',
      },
      notTheRightChoice: [
        {
          text: 'The work is a well-bounded project: a {offer} will be clearer.',
          offer: 'migration',
        },
        {
          text: 'You have no technical team: {offer} is made for that.',
          offer: 'takeover',
        },
      ],
      proof: {
        'enterprise-onboarding':
          'Four junior developers mentored over two years, on software for large accounts.',
      },
      faq: [
        {
          question: 'What is the minimum?',
          answer: "One day a week. Below that, you can't keep up with the team's pace.",
        },
        {
          question: 'Do you work remotely?',
          answer:
            'Yes, by default, for eight years now. And I am glad to come to you: a day on site is often worth a week of messages.',
        },
        {
          question: 'Which technologies?',
          answer:
            'My home ground is PHP and Symfony; I also work in Node.js, TypeScript and React. Python, so far in personal projects.',
        },
      ],
    },
  },

  aboutPage: {
    meta: {
      title: 'About Thomas Bouzy, software engineer in eastern France',
      description:
        'Who picks up when you call: a software engineer who likes racking his brains over your problem. Direct, keen to explain, based in the French countryside.',
    },
    kicker: 'About',
    title: 'Thomas Bouzy, software engineer in eastern France',
    plain: 'With a taste for understanding what others demand.',
    paragraphs: [
      "A stock count that never adds up, an app nobody dares touch any more: give me that and I won't let go.",
      'I have spent my career on software that could not stop: the ERP of several ArcelorMittal plants, software for large accounts taken over without ever stopping it, an application with 1.5 million users where every money movement had to stay traceable.',
      'Tech is my tool. What interests me is what your business needs, and how to put it in place without overengineering it.',
      'People say I am sometimes too direct. It is true. If something is off in your project, you will know. (I sugar-coat a little better than I used to, promise.)',
      'I also like explaining. For many people, software is still a black box. I have taught programming at the University of Reims and trained junior developers. I still love lifting the lid.',
      [
        'I live in the countryside, in the Grand Est. I have worked remotely for eight years. And I am glad to come to you: nothing beats a day on site to understand how you work. The rest of the time, I tinker. ',
        { href: 'https://quart-de-tour.fr', label: 'Quart de tour' },
        ', my software for joiners, was born that way.',
      ],
    ],
    book: {
      kicker: 'First step',
      title: 'A free 30-minute call.',
      text: 'Now you know who picks up. I tell you plainly whether I can help.',
      cta: 'Book a call',
      orWrite: 'Would rather write?',
      serviceArea: 'On site in {towns}; remotely everywhere else.',
    },
  },

  contact: {
    kicker: 'Contact',
    title: "Let's talk about your business.",
    blurb:
      'A free 30-minute call: I tell you plainly whether I can help. Worst case, you lose half an hour.',
    cta: 'Book a call',
    orReach: 'Or, if you prefer:',
    revealPhone: 'Show phone number',
    locationLine: 'I come to you in {towns}. Elsewhere, we work remotely.',
  },

  footer: {
    role: 'Software engineer',
    pages: 'Site pages',
    legalHeading: 'Legal notice',
    hostedBy: 'Hosted by',
    siretLabel: 'SIRET',
    vatLabel: 'VAT',
    landmark: 'Site information',
  },
} satisfies ResumeContent;
