/**
 * Single source of truth for portfolio content.
 * Every fact here is taken from the public GitHub profile README and
 * repository metadata of github.com/maheshpcse. Nothing is invented; where a
 * fact is unavailable it is omitted or explicitly flagged.
 */

export interface DiagramNode {
  id: string;
  label: string;
  x: number; // 0..100 (percent of width)
  y: number; // 0..100 (percent of height)
  kind?: 'client' | 'service' | 'data' | 'infra';
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: Array<[string, string]>;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  purpose: string;
  role: string;
  stack: string[];
  architecture: string[];
  features: string[];
  repo: string;
  status: string;
  language: string;
  diagram: Diagram;
}

export const projects: Project[] = [
  {
    slug: 'chat-system',
    title: 'Chat System',
    tagline: 'Microservice real-time messaging backend',
    description:
      'Dual-service Node.js backend for real-time chat: a primary service on MySQL with Socket.IO and Redis pub/sub, and a separate analytics service on MongoDB.',
    purpose:
      'Demonstrate a production-shaped distributed backend — service boundaries, dual-database pattern, caching, real-time delivery and cloud integration — rather than a single monolithic Express app.',
    role: 'Sole author · architecture, API design, data modelling, infrastructure integration',
    stack: ['Node.js 18', 'Express', 'Socket.IO', 'MySQL', 'MongoDB', 'Redis', 'AWS SDK v3', 'Docker'],
    architecture: [
      'Primary service (MySQL) and analytics service (MongoDB) as independent processes',
      'Redis for caching and pub/sub fan-out between Socket.IO instances',
      'Feature modules with controller / service / repository / validation layers',
      'Worker threads for CPU-bound file processing, chat export and analytics',
      'MySQL stored procedures for transactional integrity',
      'AWS S3, SNS, SQS, Secrets Manager and Parameter Store integrations',
    ],
    features: [
      'JWT authentication with refresh-token rotation',
      'Private conversations and group messaging',
      'Presence, typing indicators and unread counts in real time',
      'File uploads to S3 with metadata persistence',
      'Rate limiting, request tracking and structured Winston logging',
      'Graceful shutdown and unhandled-rejection handling',
    ],
    repo: 'https://github.com/maheshpcse/chat-system',
    status: 'Public repository · no verified live deployment',
    language: 'JavaScript',
    diagram: {
      nodes: [
        { id: 'client', label: 'Clients', x: 10, y: 50, kind: 'client' },
        { id: 'primary', label: 'Primary svc', x: 42, y: 30, kind: 'service' },
        { id: 'analytics', label: 'Analytics svc', x: 42, y: 74, kind: 'service' },
        { id: 'redis', label: 'Redis', x: 72, y: 14, kind: 'data' },
        { id: 'mysql', label: 'MySQL', x: 72, y: 44, kind: 'data' },
        { id: 'mongo', label: 'MongoDB', x: 72, y: 74, kind: 'data' },
        { id: 'aws', label: 'AWS S3 / SQS', x: 92, y: 44, kind: 'infra' },
      ],
      edges: [
        ['client', 'primary'],
        ['primary', 'redis'],
        ['primary', 'mysql'],
        ['primary', 'analytics'],
        ['analytics', 'mongo'],
        ['mysql', 'aws'],
      ],
    },
  },
  {
    slug: 'banking-system-server',
    title: 'NovaBank API',
    tagline: 'Fintech backend with money controls',
    description:
      'Banking system API covering accounts, transfers, role-based access, encrypted card data, channel-level money controls and a billing module.',
    purpose:
      'Model a secure money-flow domain end to end: authentication, authorization tiers, limits, audit trails and card security, with the operational workflows a bank back office needs.',
    role: 'Sole author · domain modelling, security design, API surface',
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'AES-256-GCM'],
    architecture: [
      'Role hierarchy: Customer, Manager, Admin, Super Admin',
      'Card PAN/CVV encrypted at rest with AES-256-GCM; combo hash for uniqueness',
      'Per-channel money controls (online, ATM, contactless, international)',
      'Rolling 24-hour limit enforcement with approval workflow',
      'Audit logging across sensitive operations',
      'In-memory MongoDB replica set for transactional tests',
    ],
    features: [
      'Registration, login and JWT session handling',
      'Deposit, withdraw and peer-to-peer transfers',
      'Paginated transaction history',
      'Billing APIs: products, customers, bills, payments, complaints, gateway settings',
      'Staff onboarding with Super Admin approval',
    ],
    repo: 'https://github.com/maheshpcse/banking-system-server',
    status: 'Public repository · no verified live deployment',
    language: 'JavaScript',
    diagram: {
      nodes: [
        { id: 'ui', label: 'Angular UI', x: 10, y: 50, kind: 'client' },
        { id: 'auth', label: 'Auth / RBAC', x: 40, y: 22, kind: 'service' },
        { id: 'money', label: 'Money controls', x: 40, y: 50, kind: 'service' },
        { id: 'billing', label: 'Billing', x: 40, y: 78, kind: 'service' },
        { id: 'crypto', label: 'AES-256-GCM', x: 70, y: 22, kind: 'infra' },
        { id: 'mongo', label: 'MongoDB', x: 78, y: 62, kind: 'data' },
      ],
      edges: [
        ['ui', 'auth'],
        ['ui', 'money'],
        ['ui', 'billing'],
        ['auth', 'crypto'],
        ['money', 'mongo'],
        ['billing', 'mongo'],
        ['crypto', 'mongo'],
      ],
    },
  },
  {
    slug: 'banking-system',
    title: 'NovaBank UI',
    tagline: 'Angular fintech frontend',
    description:
      'Angular 14 client for the banking API: dashboards with limit meters, transfers with recipient autocomplete, staff approvals and a billing interface.',
    purpose:
      'Show a role-aware Angular architecture — lazy-loaded feature modules, guards, interceptors and reactive forms — applied to a fintech domain with real workflow depth.',
    role: 'Sole author · Angular architecture, UI system, state and routing',
    stack: ['Angular 14', 'TypeScript', 'Angular Material', 'RxJS', 'Bootstrap', 'JWT'],
    architecture: [
      'Feature modules with lazy loading per domain area',
      'Auth guards and role-based routing',
      'HTTP interceptors for JWT attach, error handling and loading state',
      'Reactive forms with domain validators',
    ],
    features: [
      'Dashboard: balance, transaction totals, rolling-limit meters',
      'Deposit / withdraw with card controls',
      'Instant transfers with recipient autocomplete and usage meters',
      'Transaction history with pagination',
      'Staff signup and Super Admin approval workflow',
      'Manager analytics and billing system UI',
    ],
    repo: 'https://github.com/maheshpcse/banking-system',
    status: 'Public repository · no verified live deployment',
    language: 'TypeScript',
    diagram: {
      nodes: [
        { id: 'shell', label: 'App shell', x: 12, y: 50, kind: 'client' },
        { id: 'guards', label: 'Guards', x: 38, y: 22, kind: 'service' },
        { id: 'intercept', label: 'Interceptors', x: 38, y: 78, kind: 'service' },
        { id: 'dash', label: 'Dashboard', x: 64, y: 16, kind: 'client' },
        { id: 'transfer', label: 'Transfers', x: 64, y: 40, kind: 'client' },
        { id: 'billing', label: 'Billing', x: 64, y: 64, kind: 'client' },
        { id: 'api', label: 'NovaBank API', x: 90, y: 78, kind: 'data' },
      ],
      edges: [
        ['shell', 'guards'],
        ['shell', 'intercept'],
        ['guards', 'dash'],
        ['guards', 'transfer'],
        ['guards', 'billing'],
        ['intercept', 'api'],
      ],
    },
  },
  {
    slug: 'chat-app',
    title: 'Chat Application',
    tagline: 'Angular real-time chat client',
    description:
      'Angular 10 client for the chat system: private and group messaging over Socket.IO with presence, typing indicators, unread badges and notifications.',
    purpose:
      'Pair the microservice backend with a modular Angular frontend that exercises a broad set of framework patterns in one coherent product.',
    role: 'Sole author · module architecture, real-time integration, UI',
    stack: ['Angular 10', 'TypeScript', 'Angular Material', 'RxJS', 'Socket.IO', 'Bootstrap 5'],
    architecture: [
      'Lazy-loaded feature modules: Auth, Chat, Conversation, Group, User, Notification',
      'Core module for singletons; Shared module for pipes, directives and validators',
      'HTTP interceptors for JWT, errors and loader state',
      'Custom directives (auto-scroll, click-outside) and pipes',
    ],
    features: [
      'Login and registration with JWT',
      'Real-time private messaging and group chats',
      'Online status, typing indicators and unread count badges',
      'File upload and notifications',
      'User search with autocomplete and profile management',
    ],
    repo: 'https://github.com/maheshpcse/chat-app',
    status: 'Public repository · no verified live deployment',
    language: 'TypeScript',
    diagram: {
      nodes: [
        { id: 'core', label: 'Core module', x: 14, y: 50, kind: 'client' },
        { id: 'auth', label: 'Auth', x: 42, y: 16, kind: 'client' },
        { id: 'chat', label: 'Chat', x: 42, y: 40, kind: 'client' },
        { id: 'group', label: 'Group', x: 42, y: 64, kind: 'client' },
        { id: 'notify', label: 'Notification', x: 42, y: 88, kind: 'client' },
        { id: 'socket', label: 'Socket.IO', x: 74, y: 34, kind: 'service' },
        { id: 'api', label: 'Chat System API', x: 74, y: 70, kind: 'data' },
      ],
      edges: [
        ['core', 'auth'],
        ['core', 'chat'],
        ['core', 'group'],
        ['core', 'notify'],
        ['chat', 'socket'],
        ['group', 'socket'],
        ['auth', 'api'],
        ['socket', 'api'],
      ],
    },
  },
];

export interface JourneyItem {
  index: string;
  /** Where this chapter's facts are verified from. */
  evidence: string;
  role: string;
  /** Employer. `null` when the résumé is not available to verify it. */
  organisation: string | null;
  summary: string;
  points: string[];
  stack: string[];
}

/**
 * Professional experience, presented as domain chapters rather than a dated
 * timeline. The résumé PDF was not available at build time, so employer names
 * and dates are intentionally omitted (`organisation: null`) instead of
 * guessed. The engineering scope comes from the verified public profile.
 * Fill `organisation` (and add a `period` if desired) from the résumé once it
 * is placed in `public/assets/resume/`.
 */
export const journey: JourneyItem[] = [
  {
    index: '01',
    evidence: 'Profile · résumé',
    role: 'Fintech platforms',
    organisation: null,
    summary:
      'Merchant onboarding, billing workflows and secure money flows — the domain where API design, authorization tiers and audit trails matter most.',
    points: [
      'REST and GraphQL API design for onboarding and billing services',
      'Authentication, role-based authorization and audit logging',
      'Database query optimisation and Redis caching on hot read paths',
      'Docker containerisation with CI/CD delivery to AWS',
    ],
    stack: ['Node.js', 'TypeScript', 'Angular', 'PostgreSQL', 'Redis', 'Kafka', 'AWS'],
  },
  {
    index: '02',
    evidence: 'Profile · résumé',
    role: 'Real-time & enterprise systems',
    organisation: null,
    summary:
      'Socket-based messaging, Angular application architecture and Node.js service layers for enterprise web applications.',
    points: [
      'Angular front-ends with RxJS, NgRx state and Angular Material',
      'WebSocket features — presence, notifications, live updates',
      'Third-party API integrations and message brokers (Kafka, RabbitMQ)',
      'Unit and integration testing with Jest, Jasmine and Mocha',
    ],
    stack: ['Angular', 'RxJS', 'NgRx', 'Node.js', 'Express', 'MongoDB', 'RabbitMQ'],
  },
  {
    index: '03',
    evidence: 'GitHub · 2017 →',
    role: 'MEAN stack foundations',
    organisation: null,
    summary:
      'End-to-end MEAN applications visible on GitHub since 2017 — management systems for users, students, employees and expenses — each split into an Angular client and a Node.js server.',
    points: [
      'Angular 6–10 clients paired with Express / Hapi servers',
      'Relational and document data models for CRUD-heavy products',
      'Git workflows across GitHub, Bitbucket and GitLab',
    ],
    stack: ['Angular', 'JavaScript', 'Node.js', 'Hapi', 'MySQL', 'MongoDB'],
  },
];

export const experienceNote =
  'Employer names and dates are published in the résumé, which is the authoritative record. This section summarises verified engineering scope by domain.';

export interface StackGroup {
  id: string;
  label: string;
  title: string;
  description: string;
  items: Array<{ name: string; note: string }>;
}

export const stackGroups: StackGroup[] = [
  {
    id: 'core',
    label: 'Core',
    title: 'Language layer',
    description: 'The daily foundation for application logic, services, tooling and automation.',
    items: [
      { name: 'JavaScript', note: 'ES6+' },
      { name: 'TypeScript', note: 'Strict' },
      { name: 'Node.js', note: 'Runtime' },
      { name: 'Python', note: 'Services · scripts' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Angular application architecture',
    description: 'Feature modules, reactive data flow, state management and accessible component systems.',
    items: [
      { name: 'Angular', note: 'v6 → v14+' },
      { name: 'RxJS', note: 'Reactive patterns' },
      { name: 'NgRx', note: 'State' },
      { name: 'Angular Material', note: 'Components' },
      { name: 'HTML5', note: 'Semantics' },
      { name: 'CSS3', note: 'Modern layout' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Services and API contracts',
    description: 'HTTP services, authentication, real-time transports and API surfaces designed for change.',
    items: [
      { name: 'Node.js', note: 'Services' },
      { name: 'Express.js', note: 'HTTP' },
      { name: 'Hapi', note: 'HTTP' },
      { name: 'REST APIs', note: 'Contracts' },
      { name: 'GraphQL', note: 'Schema-first' },
      { name: 'WebSockets', note: 'Socket.IO' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    title: 'Relational, document and cache',
    description: 'Data modelling, query optimisation, stored procedures and cache-backed read paths.',
    items: [
      { name: 'PostgreSQL', note: 'Relational' },
      { name: 'MySQL', note: 'Relational' },
      { name: 'MSSQL', note: 'Relational' },
      { name: 'MongoDB', note: 'Document' },
      { name: 'Redis', note: 'Cache · pub/sub' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    title: 'Deployment and delivery',
    description: 'Cloud infrastructure, containers and pipelines that turn commits into monitored releases.',
    items: [
      { name: 'AWS', note: 'EC2 · S3 · Lambda · CloudWatch' },
      { name: 'GCP', note: 'Cloud' },
      { name: 'Docker', note: 'Containers' },
      { name: 'Jenkins', note: 'CI/CD' },
      { name: 'GitHub Actions', note: 'CI/CD' },
      { name: 'Heroku', note: 'PaaS' },
    ],
  },
  {
    id: 'architecture',
    label: 'Messaging & Architecture',
    title: 'Distributed system patterns',
    description: 'Service decomposition, asynchronous messaging and the reliability patterns that hold them together.',
    items: [
      { name: 'Microservices', note: 'Boundaries' },
      { name: 'Kafka', note: 'Streams' },
      { name: 'RabbitMQ', note: 'Queues' },
      { name: 'Event-Driven', note: 'Architecture' },
      { name: 'Distributed Systems', note: 'Consistency · reliability' },
    ],
  },
  {
    id: 'quality',
    label: 'Quality & Tools',
    title: 'Testing and collaboration',
    description: 'Test frameworks, API tooling and the collaboration stack used across teams.',
    items: [
      { name: 'Jest', note: 'Unit' },
      { name: 'Jasmine', note: 'Unit' },
      { name: 'Mocha', note: 'Unit · integration' },
      { name: 'Swagger', note: 'API docs' },
      { name: 'Postman', note: 'API testing' },
      { name: 'GitHub · Bitbucket · GitLab', note: 'Source control' },
      { name: 'Jira', note: 'Delivery' },
      { name: 'Figma', note: 'Design handoff' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Workflow',
    title: 'AI-assisted engineering',
    description: 'Assistants and agent tooling used to explore, scaffold, document and review faster.',
    items: [
      { name: 'ChatGPT', note: 'Model' },
      { name: 'Claude', note: 'Model' },
      { name: 'Grok', note: 'Model' },
      { name: 'GitHub Copilot', note: 'In-editor' },
      { name: 'AI Agents', note: 'Autonomous tasks' },
      { name: 'AI Skills · Plugins', note: 'Extensibility' },
      { name: 'MCP Servers', note: 'Tool integration' },
    ],
  },
];

export interface Capability {
  title: string;
  body: string;
  tags: string[];
}

export const capabilities: Capability[] = [
  {
    title: 'Architecture',
    body: 'Microservices, event-driven systems, distributed systems and clean architecture — deciding where boundaries go and what crosses them.',
    tags: ['Microservices', 'Event-driven', 'Clean architecture', 'Distributed systems'],
  },
  {
    title: 'Backend',
    body: 'REST and GraphQL API design, authentication and authorization, and third-party integrations that stay maintainable.',
    tags: ['REST', 'GraphQL', 'Auth', 'Integrations'],
  },
  {
    title: 'Performance',
    body: 'Database query optimisation, Redis caching strategy and API performance tuning driven by measurement.',
    tags: ['Query optimisation', 'Redis', 'API tuning'],
  },
  {
    title: 'Cloud',
    body: 'AWS deployment, Docker containerisation, CI/CD pipelines, monitoring and observability.',
    tags: ['AWS', 'Docker', 'CI/CD', 'Observability'],
  },
  {
    title: 'Frontend systems',
    body: 'Angular architecture, RxJS reactive patterns, NgRx state management and responsive design that survives product growth.',
    tags: ['Angular', 'RxJS', 'NgRx', 'Responsive'],
  },
  {
    title: 'Quality',
    body: 'Unit and integration testing, application reliability and security hardening as part of delivery, not after it.',
    tags: ['Jest', 'Jasmine', 'Mocha', 'Security'],
  },
];

export const pinnedRepos = [
  { name: 'banking-system', language: 'TypeScript', description: 'Angular banking UI' },
  { name: 'banking-system-server', language: 'JavaScript', description: 'Node.js banking API' },
  { name: 'chat-app', language: 'TypeScript', description: 'Angular real-time chat client' },
  { name: 'chat-system', language: 'JavaScript', description: 'Microservice chat backend' },
  { name: 'miniHrmsUI', language: 'CSS', description: 'Angular HRMS client' },
  { name: 'miniHrmsServer', language: 'JavaScript', description: 'Node.js HRMS server' },
];

export const ribbonItems = [
  'JavaScript', 'TypeScript', 'Node.js', 'Angular', 'RxJS', 'NgRx', 'Express', 'GraphQL', 'PostgreSQL',
  'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'AWS', 'Docker', 'Microservices', 'Event-driven',
];

export const RESUME_PATH = './assets/resume/Mahesh-FullStack-JavaScript-Developer-6.9yrs.pdf';
export const GITHUB_USER = 'maheshpcse';
