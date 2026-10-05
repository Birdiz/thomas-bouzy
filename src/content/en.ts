import type { ResumeContent } from './types.ts';

/*
 * `{credit}`, `{dayRate}` and `{maxDays}` are read from prices.ts when the page
 * is built (src/lib/price-tokens.ts): a price is never copied into prose.
 */
export const en = {
  meta: {
    title: 'Thomas Bouzy — Freelance Symfony & PHP backend consultant',
    description:
      'I take over, stabilise and upgrade the PHP/Symfony business applications your company runs on, without downtime. Grand Est or remote. Public prices.',
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
    offers: 'Offers',
    partners: 'Partners',
    work: 'Achievements',
    approach: 'Approach',
    about: 'About',
    contact: 'Get in touch',
  },

  hero: {
    availability: "First engagements in preparation — let's talk now",
    title: 'I take over your business software, make it reliable and keep it moving forward.',
    blurb:
      'Even the one nobody dares touch any more. Without stopping it, without rewriting everything, at published prices.',
    ctaOffers: 'See the offers',
  },

  problem: {
    audit: {
      text: 'Not sure which one is yours?',
      cta: 'Start with an audit',
    },
    kicker: 'The problem',
    title: 'Do any of these sound familiar?',
  },

  failureModes: [
    {
      quote: '“The person who built our app has left, and nobody dares touch it any more.”',
      text: 'The orphan application. Nobody knows it any more, and every change becomes a bet.',
      offer: 'takeover',
    },
    {
      quote: '“The version upgrade is always for next quarter.”',
      text: 'The migration that never happens. The system cannot stop, so the work keeps slipping, and the bill keeps growing.',
      offer: 'migration',
    },
    {
      quote: '“The stock never adds up, and nobody knows why.”',
      text: "The discrepancy nobody can explain. The software gives today's figure, never the movements that led to it.",
      offer: 'reliability',
    },
    {
      quote: '“Our customers are the ones who find the bugs.”',
      text: 'Defects found by users. The bug was visible hours earlier; nobody was watching.',
      offer: 'reliability',
    },
    {
      quote: '“The day of the big campaign, everything goes down.”',
      text: 'The peak that brings everything down. The system holds every day, and gives way the day everyone shows up.',
      offer: 'scaling',
    },
  ],

  position: {
    kicker: 'Approach',
    title: 'What I stand for, and what it costs.',
    intro: 'Every recommendation comes with what it gives up.',
    costLabel: 'The cost',
  },

  principles: [
    {
      title: 'Migrate in steps, never rewrite everything.',
      text: 'Three major Symfony migrations on a system in continuous service, none of them a big bang.',
      cost: 'A period where old and new run side by side, which must not be allowed to drag on.',
    },
    {
      title: 'What is not instrumented is not reliable.',
      text: 'OpenTelemetry and Datadog across every backend service, with alerts before the failure: reported bugs went from around twenty a month to five.',
      cost: 'Time taken from delivery, and choosing what to watch.',
    },
    {
      title: 'Three honesty levels, never compressed.',
      text: 'Production, personal projects, currently learning: I state them apart, so you know what you are buying.',
      cost: 'A shorter list, and saying “not in production” when that is the case.',
    },
  ],

  work: {
    kicker: 'Achievements',
    title: 'Work worth opening',
    intro: 'Open a card: what I did, and what it changed.',
    labelPlain: 'In plain terms:',
    labelApproach: 'Approach',
    labelResult: 'Result',
  },

  achievements: [
    {
      id: 'industrial-erp',
      title: 'Keeping an industrial ERP running in production',
      org: 'Quadra Informatique',
      period: '2016 – 2017',
      plain:
        'Looking after the software a manufacturer relies on every day, from suppliers to invoices.',
      approach:
        'Fixes and changes on software the business could not do without for a single day: nothing went out without being checked.',
      result:
        'The ERP stayed in production throughout. It is exactly the case the Takeover exists for.',
    },
    {
      id: 'live-api-redesign',
      title: 'Rebuilding a live API without users noticing',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'Rebuilding the foundations of a product while it runs, without a single outage for the people using it.',
      approach:
        'A slow, unstable trading product, rebuilt in steps: API contracts refocused on the business, the frontend never broken. Eight sprints alongside the frontend team, in React and Next.js; deployment on Kubernetes and ArgoCD was mine to own.',
      result:
        '500 errors down to zero, the page usable in 3 seconds instead of 17, deployment from 15 minutes to 4, purchased data from €9,000 to €3,000 a year. Shipped on call, incidents driven through Rootly.',
    },
    {
      id: 'wallet-event-sourcing',
      title: 'Event Sourcing on wallet transactions',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        "Making every movement in a wallet traceable, instead of only ever knowing today's balance.",
      approach:
        'Wallets holding real assets, for 1.5M+ active users. Event Sourcing and an outbox over SNS/SQS: every movement becomes a stored, replayable fact.',
      result:
        '1,000+ transactions a minute with a complete audit trail, and peaks of 10,000–20,000 users within minutes, load-tested.',
    },
    {
      id: 'on-chain-operations',
      title: 'On-chain transactions that commit real funds',
      org: 'Socios.com (Chiliz)',
      period: 'May 2022 – April 2026',
      plain:
        'A service that places and readjusts money on markets by itself, where an order once sent cannot be called back.',
      approach:
        'DeFi operations on Solana, from a Node.js microservice with the Meteora SDK and Fireblocks for signing. SDK integration and transaction operation, no smart contract authoring.',
      result:
        'In production on real funds. Idempotent signing and reconciliation against the chain designed in from the start, then opened to other teams as a shared service.',
    },
    {
      id: 'enterprise-onboarding',
      title: 'Onboarding a new enterprise account in a day',
      org: 'Kiss The Bride',
      period: 'Jan 2018 – April 2022',
      plain: 'Every new client used to need a bespoke setup; it now takes a single day.',
      approach:
        'A SaaS for large accounts, on a Symfony 2.7 / AngularJS monolith with no tests at all. Tests first, then Symfony 4 with API Platform and React, without stopping; onboarding automated with Node.js and Jenkins.',
      result:
        'A new enterprise account goes live in a day. Rankings delivered live through Mercure. Four juniors mentored over two years.',
    },
    {
      id: 'codebase-audit',
      title: "Auditing a codebase I didn't write",
      org: 'Civic tech, volunteer',
      period: '2026',
      plain:
        'Telling a team what in their code could cost them dearly, then fixing the most critical parts myself.',
      approach:
        'Three volunteer apps, one of them a shop taking payments, with no tests at all. Read-only first: four prioritised reports, including 17 security findings. Then I fixed the critical ones myself.',
      result:
        'The cart that trusted the browser is now revalidated server-side. Payments and admin authentication covered by tests, CodeQL in the pipeline.',
    },
    {
      id: 'open-data-directories',
      title: 'Association directories from open data',
      org: 'For a client',
      period: '2026',
      plain:
        'Rebuilding in seconds a directory that used to be compiled by hand, one town at a time.',
      approach:
        "Open data, enriched from the public sites of local authorities, with the provenance of every value. Local-first: one SQLite file on the user's machine.",
      result:
        'On Ille-et-Vilaine, 31,273 associations from 332 communes in 40 seconds. A measured pre-filter cut the pages to analyse from 40% to 6.5%.',
      link: {
        href: 'https://github.com/Birdiz/annuaire-vie-associative/releases',
        label: 'The published releases',
      },
    },
  ],

  about: {
    kicker: 'About',
    title: 'In short',
    paragraphs: [
      'I work in PHP and Symfony, and I also take on the React, TypeScript and Node.js that come with them. I like the unglamorous parts: transactions that stay correct, histories you can replay, migrations nobody notices. And I write my decisions down, so the team can carry on without me.',
      'I live in the Grand Est countryside. Written, asynchronous work is my default; I travel when the work needs a room.',
    ],
    mentoringKicker: 'Passing it on — a thread through all of it',
    careerLine: 'Hiring rather than contracting?',
    careerLink: 'My career is on LinkedIn.',
  },

  mentoring: [
    { year: '2016', text: 'Undergraduate lecturer at the University of Reims.' },
    { year: '2018', text: 'Four juniors brought to autonomy at Kiss The Bride.' },
    {
      year: '2022',
      text: 'Architecture reviews for two teams at Socios: five developers and a QA engineer.',
    },
    { year: '2024', text: 'Founded the backend community of practice: RFCs, ADRs, standards.' },
  ],

  languages: [
    { name: 'French', level: 'native' },
    { name: 'English', level: 'C1 — full professional' },
    { name: 'German', level: 'B1 — professional basics' },
  ],

  schema: {
    jobTitle: 'Senior Software Engineer — backend architecture',
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
    title: 'Offers for your business applications, each with its price.',
    from: 'from',
    see: 'See the offer',
    inFrench: '(in French)',
    partners: 'An agency or an IT services firm?',
    partnersLink: 'See the partners page (in French)',
  },

  offers: {
    audit: {
      name: 'Audit',
      plain: 'An outside look, written down: what could cost you dearly, and where to start.',
    },
    takeover: {
      name: 'Takeover and maintenance',
      plain:
        'Taking over the application nobody dares touch any more, without breaking anything, then keeping it alive every month.',
    },
    migration: {
      name: 'Migration without downtime',
      plain: 'Moving a running system to a new version without stopping it, one step at a time.',
    },
    reliability: {
      name: 'Reliability',
      plain: 'Being able to explain a stock gap, a balance or a bug, instead of guessing.',
    },
    scaling: {
      name: 'Scaling',
      plain:
        'Keeping your system standing on the day everyone shows up, and back on its feet when a part fails.',
    },
    build: {
      name: 'Custom build',
      plain:
        'Building the application you are missing, designed from day one so that someone else can take it over.',
    },
    reinforcement: {
      name: 'Senior reinforcement',
      plain: 'A senior lead or architect inside your team, part time, billed by the day.',
    },
  },

  offerPage: {
    kicker: 'Offer',
    sentences: 'Does this sound like you?',
    delivered: 'What you receive, in order',
    disclaimer: 'An order of magnitude, not a quote.',
    tableCaption: 'Every range, excluding VAT',
    excludingVat: 'excl. VAT',
    perMonth: '/ month',
    weekOne: 'week',
    weekMany: 'weeks',
    notTheRightChoice: 'Not the right choice if…',
    achievements: 'What proves it',
    faq: 'Frequently asked questions',
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
        title: 'Symfony & PHP code audit and technical due diligence',
        description:
          'A written audit of your PHP/Symfony system: report, risk register and prioritised action plan. Public prices, credited against the next engagement.',
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
          text: "The old path removed, and a team that won't need me next time.",
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
        'A Migration is sold in two phases: a fixed-price plan, then execution at {dayRate} excl. VAT a day. You decide on the second with the plan in hand.',
      ],
      notTheRightChoice: [
        {
          text: 'The system can stop for a weekend without harm: a conventional migration will cost less.',
        },
        {
          text: 'You want to replace it rather than evolve it: an {offer} will inform that choice.',
          offer: 'audit',
        },
      ],
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
        title: 'Observability and traceable flows for critical systems',
        description:
          "A balance, a stock or an invoice that won't reconcile? Traceable flows, idempotent processing and observability to explain it. Public prices.",
      },
      heading: 'Reliability: trace the flows, explain the gaps',
      priceHeading: 'How much does reliability work cost?',
      sentences: ['“We credited the same payout twice, and only saw it at reconciliation.”'],
      delivered: [
        {
          title: 'The flows that matter, chosen together',
          text: 'The ones where a discrepancy costs: stock, invoicing, payments.',
        },
        {
          title: 'Traceable flows',
          text: 'Every movement kept as a dated fact: the history replays.',
        },
        {
          title: 'Double execution, dealt with',
          text: 'A message received twice is applied once.',
        },
        {
          title: 'Alerts before your customers',
          text: 'And teams that can read them once I leave.',
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
      notTheRightChoice: [
        {
          text: "You don't know yet where the problem is: an {offer} will locate it first.",
          offer: 'audit',
        },
        {
          text: 'You only want a monitoring tool installed: that is only a means.',
        },
      ],
      faq: [
        {
          question: 'What is a double execution, concretely?',
          answer:
            'A transfer credited twice, a batch taken out of stock twice. It is prevented in the design.',
        },
        {
          question: 'Do we have to change monitoring tools?',
          answer: 'Rarely. We start from what you have: what matters is knowing what to observe.',
        },
      ],
    },
    scaling: {
      meta: {
        title: 'Scaling PHP/Symfony under load, with high availability',
        description:
          'Does your application slow down or fall over at peak traffic? Load test, bottleneck found, measured fixes: a fixed-price diagnosis. Public prices.',
      },
      heading: 'Scaling and high availability for your PHP/Symfony application',
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
          text: 'Backpressure on queues, circuit breakers, a degraded mode: in a distributed system, one part failing no longer takes the rest down. The load scenario stays in your CI, with an incident runbook.',
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
          },
        },
        amounts: { plan: 'Diagnosis, phase 1 at a fixed price' },
        duration: 'Fixes, by the day',
      },
      rules: [
        'Scaling always starts with a load test that reproduces the peak, before any change.',
        'It is sold in two phases: the fixed-price diagnosis, then the fixes at {dayRate} excl. VAT a day.',
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
      faq: [
        {
          question: "Isn't adding servers enough?",
          answer:
            'Rarely. If the bottleneck is the database or an external service, ten servers wait for it together. The load test says where it is.',
        },
        {
          question: 'Could the load test bring production down?',
          answer:
            'It runs on a faithful copy, or on production in steps, outside peak hours, with a stop ready.',
        },
      ],
    },
    build: {
      meta: {
        title: 'Custom PHP/Symfony business application development',
        description:
          'A custom PHP/Symfony business application, built to be taken over: a fixed-price framing, then development by the day. Public prices.',
      },
      heading: 'Custom application development in PHP/Symfony',
      priceHeading: 'How much does a custom application cost?',
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
              medium: 'A business application',
              large: 'A critical service',
            },
          },
          integrations: {
            label: 'Systems to connect',
            options: { none: 'None', few: '1 or 2', many: '3 or more' },
          },
        },
        amounts: { plan: 'Framing, phase 1 at a fixed price' },
        duration: 'Build, by the day',
      },
      rules: [
        'A Custom build never replaces a running system: that is a Migration, or first an Audit.',
        'It is sold in two phases: the fixed-price framing, then the build at {dayRate} excl. VAT a day. You decide on the second with the framing in hand.',
      ],
      notTheRightChoice: [
        {
          text: 'Your application already exists and runs: a {offer} will evolve it without replacing it.',
          offer: 'migration',
        },
        {
          text: 'An off-the-shelf product already does the job: an {offer} will tell you whether it is the right call.',
          offer: 'audit',
        },
      ],
      faq: [
        {
          question: 'Why does the number of systems to connect weigh on the price?',
          answer:
            'Each system to connect (ERP, payments, accounting) has its own rules, failures and delays. That is where a project overruns, more often than in the screens.',
        },
        {
          question: 'And once the application is delivered?',
          answer:
            'Your team takes it over with the tests and the written decisions, or I maintain it monthly, under a Takeover.',
        },
      ],
    },
    reinforcement: {
      meta: {
        title: 'Part-time Symfony tech lead / architect, freelance',
        description:
          'A senior PHP/Symfony lead or architect inside your team, one to four days a week. Published day rate.',
      },
      heading: 'A part-time senior lead inside your team',
      priceHeading: 'How much does a part-time tech lead cost?',
      sentences: [
        '“We need someone senior, but not full time.”',
        "“The team is good; it's missing someone to settle the architecture.”",
      ],
      delivered: [
        {
          title: 'Two weeks to understand',
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
        amounts: { monthly: 'Per month' },
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
      faq: [
        {
          question: 'What is the minimum?',
          answer: "One day a week. Below that, you can't keep up with the team's pace.",
        },
        {
          question: 'Do you work remotely?',
          answer: 'Yes, by default, with travel when the work needs a room.',
        },
      ],
    },
  },

  contact: {
    kicker: 'Contact',
    title: "Let's talk about your application.",
    blurb: 'A free 30-minute call: I tell you plainly whether I can help.',
    cta: 'Book a call',
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
