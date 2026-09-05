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

export interface LiveLink {
  url: string;
  /** Short label for the button, e.g. "Open app" or "API health". */
  label: string;
  /** Hosting platform, shown as metadata. */
  host: string;
  /** ISO date the URL was last verified to respond. */
  verified: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Frontend / Backend within its application group. */
  layer: 'Frontend' | 'Backend';
  /** Verified production deployment, if any. */
  live?: LiveLink;
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

export interface ProjectGroup {
  slug: string;
  title: string;
  summary: string;
  /** Verified production URL of the application's home page. */
  live: LiveLink;
  /** Home-page screenshot (in public/assets/images/projects). */
  screenshot: { src: string; srcSmall: string; alt: string; width: number; height: number };
  projects: Project[];
}

/**
 * Selected work, grouped by application. Each application has an Angular
 * frontend and a Node.js backend repository.
 */
export const projectGroups: ProjectGroup[] = [
  {
    slug: 'chat-application',
    title: 'Chat Application',
    summary: 'Real-time messaging platform: an Angular client over a microservice Node.js backend with Socket.IO, Redis pub/sub and dual databases.',
    live: { url: 'https://maheshpcse.github.io/chat-app/', label: 'Open live app', host: 'GitHub Pages', verified: '2026-09-04' },
    screenshot: {
      src: './assets/images/projects/chat-app-home.webp',
      srcSmall: './assets/images/projects/chat-app-home-800.webp',
      alt: 'Chat App home page: "Talk freely. Connect instantly." headline with sample conversation bubbles and Get Started button',
      width: 1600,
      height: 757,
    },
    projects: [
      {
        slug: 'chat-app',
        title: 'Chat App',
        layer: 'Frontend',
        live: { url: 'https://maheshpcse.github.io/chat-app/', label: 'Open live app', host: 'GitHub Pages', verified: '2026-09-04' },
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
        status: 'Live · GitHub Pages',
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
      {
        slug: 'chat-system',
        title: 'Chat System',
        layer: 'Backend',
        live: { url: 'https://chat-system-production-83db.up.railway.app/api/v1/health', label: 'API health', host: 'Railway', verified: '2026-09-04' },
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
        status: 'Live · Railway',
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
    ],
  },
  {
    slug: 'novabank-application',
    title: 'NovaBank Application',
    summary: 'Fintech platform: an Angular banking interface over a secure Node.js API with role-based access, encrypted card data and money controls.',
    live: { url: 'https://maheshpcse.github.io/banking-system/', label: 'Open live app', host: 'GitHub Pages', verified: '2026-09-04' },
    screenshot: {
      src: './assets/images/projects/novabank-home.webp',
      srcSmall: './assets/images/projects/novabank-home-800.webp',
      alt: 'NovaBank home page: "Banking that feels clear the moment you arrive." headline with Login and Signup buttons',
      width: 1600,
      height: 757,
    },
    projects: [
      {
        slug: 'banking-system',
        title: 'NovaBank UI',
        layer: 'Frontend',
        live: { url: 'https://maheshpcse.github.io/banking-system/', label: 'Open live app', host: 'GitHub Pages', verified: '2026-09-04' },
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
        status: 'Live · GitHub Pages',
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
        slug: 'banking-system-server',
        title: 'NovaBank API',
        layer: 'Backend',
        live: { url: 'https://banking-system-production-d9aa.up.railway.app/api/health', label: 'API health', host: 'Railway', verified: '2026-09-04' },
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
        status: 'Live · Railway',
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
    ],
  },
];

export const projects: Project[] = projectGroups.flatMap((g) => g.projects);


export interface ExperienceItem {
  index: string;
  company: string;
  role: string;
  location: string;
  period: string;
  start: string; // ISO year-month, used for the duration label
  end: string | null; // null = present
  stack: string[];
  points: string[];
}

/** Professional experience — taken verbatim in substance from the résumé. */
export const experience: ExperienceItem[] = [
  {
    index: '01',
    company: '911 Fintech Solutions',
    role: 'Senior Full Stack Developer',
    location: 'Bengaluru, India',
    period: 'May 2022 — Jun 2026',
    start: '2022-05',
    end: '2026-06',
    stack: ['Node.js', 'Angular', 'Python', 'MySQL', 'AWS', 'Jenkins', 'Redis', 'CI/CD', 'NgRx'],
    points: [
      'Built scalable full-stack fintech modules for merchant onboarding, billing and chargeback workflows.',
      'Designed and implemented high-performance REST APIs using Node.js and Express.js.',
      'Developed responsive Angular interfaces to support complex financial operations.',
      'Optimized MySQL queries and schemas to improve performance and data consistency.',
      'Integrated Redis caching to reduce latency and improve system responsiveness.',
      'Implemented unit and integration tests to ensure reliability and prevent regressions.',
      'Supported CI/CD pipelines and automated deployments using Jenkins and GitHub / GitLab.',
      'Deployed and maintained applications on AWS EC2 environments.',
      'Collaborated with product, QA and engineering teams in Agile delivery cycles.',
    ],
  },
  {
    index: '02',
    company: 'Akrivia Automation Pvt Ltd',
    role: 'MEAN Stack Developer',
    location: 'Visakhapatnam, India',
    period: 'Aug 2019 — Apr 2022',
    start: '2019-08',
    end: '2022-04',
    stack: ['Angular', 'Node.js', 'TypeScript', 'MongoDB', 'WebSockets', 'AWS', 'RabbitMQ', 'SQL'],
    points: [
      'Developed and maintained full-stack web applications using MEAN stack technologies.',
      'Designed and implemented secure RESTful APIs using Node.js and Express following best practices.',
      'Built responsive UI components using HTML, CSS, JavaScript and Angular.',
      'Handled backend development, ensuring application security, performance and data integrity.',
      'Integrated authentication and authorization features across multiple web applications.',
      'Deployed and maintained applications on AWS and Heroku, managing version control with GitHub.',
    ],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  detail: string;
}

export const education: EducationItem[] = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'IIIT (RGUKT)',
    location: 'RK Valley, India',
    period: '2014 — 2018',
    detail: 'CGPA 7.9 / 10',
  },
];

export interface StackGroup {
  id: string;
  label: string;
  title: string;
  description: string;
  items: Array<{ name: string; note: string; icon: string }>;
}

export const stackGroups: StackGroup[] = [
  {
    id: 'core',
    label: 'Core',
    title: 'Language layer',
    description: 'The daily foundation for application logic, services, tooling and automation.',
    items: [
      { name: 'JavaScript', note: 'ES6+', icon: 'javascript' },
      { name: 'TypeScript', note: 'Strict', icon: 'typescript' },
      { name: 'Node.js', note: 'Runtime', icon: 'nodedotjs' },
      { name: 'Python', note: 'Services · scripts', icon: 'python' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Angular application architecture',
    description: 'Feature modules, reactive data flow, state management and accessible component systems.',
    items: [
      { name: 'Angular', note: 'v6 → v14+', icon: 'angular' },
      { name: 'RxJS', note: 'Reactive patterns', icon: 'reactivex' },
      { name: 'NgRx', note: 'State', icon: 'ngrx' },
      { name: 'Angular Material', note: 'Components', icon: 'lucide:layout-grid' },
      { name: 'HTML5', note: 'Semantics', icon: 'html5' },
      { name: 'CSS3', note: 'Modern layout', icon: 'css' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Services and API contracts',
    description: 'HTTP services, authentication, real-time transports and API surfaces designed for change.',
    items: [
      { name: 'Node.js', note: 'Services', icon: 'nodedotjs' },
      { name: 'Express.js', note: 'HTTP', icon: 'express' },
      { name: 'Hapi', note: 'HTTP', icon: 'lucide:server' },
      { name: 'REST APIs', note: 'Contracts', icon: 'lucide:braces' },
      { name: 'GraphQL', note: 'Schema-first', icon: 'graphql' },
      { name: 'WebSockets', note: 'Socket.IO', icon: 'socketdotio' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    title: 'Relational, document and cache',
    description: 'Data modelling, query optimisation, stored procedures and cache-backed read paths.',
    items: [
      { name: 'PostgreSQL', note: 'Relational', icon: 'postgresql' },
      { name: 'MySQL', note: 'Relational', icon: 'mysql' },
      { name: 'MSSQL', note: 'Relational', icon: 'lucide:database' },
      { name: 'MongoDB', note: 'Document', icon: 'mongodb' },
      { name: 'Redis', note: 'Cache · pub/sub', icon: 'redis' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    title: 'Deployment and delivery',
    description: 'Cloud infrastructure, containers and pipelines that turn commits into monitored releases.',
    items: [
      { name: 'AWS', note: 'EC2 · S3 · Lambda · CloudWatch', icon: 'lucide:cloud' },
      { name: 'GCP', note: 'Cloud', icon: 'googlecloud' },
      { name: 'Docker', note: 'Containers', icon: 'docker' },
      { name: 'Jenkins', note: 'CI/CD', icon: 'jenkins' },
      { name: 'GitHub Actions', note: 'CI/CD', icon: 'githubactions' },
      { name: 'Heroku', note: 'PaaS', icon: 'lucide:cloud-upload' },
    ],
  },
  {
    id: 'architecture',
    label: 'Messaging & Architecture',
    title: 'Distributed system patterns',
    description: 'Service decomposition, asynchronous messaging and the reliability patterns that hold them together.',
    items: [
      { name: 'Microservices', note: 'Boundaries', icon: 'lucide:boxes' },
      { name: 'Kafka', note: 'Streams', icon: 'apachekafka' },
      { name: 'RabbitMQ', note: 'Queues', icon: 'rabbitmq' },
      { name: 'Event-Driven', note: 'Architecture', icon: 'lucide:zap' },
      { name: 'Distributed Systems', note: 'Consistency · reliability', icon: 'lucide:network' },
    ],
  },
  {
    id: 'quality',
    label: 'Quality & Tools',
    title: 'Testing and collaboration',
    description: 'Test frameworks, API tooling and the collaboration stack used across teams.',
    items: [
      { name: 'Jest', note: 'Unit', icon: 'jest' },
      { name: 'Jasmine', note: 'Unit', icon: 'jasmine' },
      { name: 'Mocha', note: 'Unit · integration', icon: 'mocha' },
      { name: 'Swagger', note: 'API docs', icon: 'swagger' },
      { name: 'Postman', note: 'API testing', icon: 'postman' },
      { name: 'GitHub', note: 'Source control', icon: 'github' },
      { name: 'Bitbucket', note: 'Source control', icon: 'bitbucket' },
      { name: 'GitLab', note: 'Source control', icon: 'gitlab' },
      { name: 'Jira', note: 'Delivery', icon: 'jira' },
      { name: 'Figma', note: 'Design handoff', icon: 'figma' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Workflow',
    title: 'AI-assisted engineering',
    description: 'Assistants and agent tooling used to explore, scaffold, document and review faster.',
    items: [
      { name: 'ChatGPT', note: 'Model', icon: 'lucide:message-square' },
      { name: 'Claude', note: 'Model', icon: 'claude' },
      { name: 'Grok', note: 'Model', icon: 'lucide:sparkles' },
      { name: 'GitHub Copilot', note: 'In-editor', icon: 'githubcopilot' },
      { name: 'AI Agents', note: 'Autonomous tasks', icon: 'lucide:bot' },
      { name: 'AI Skills · Plugins', note: 'Extensibility', icon: 'lucide:puzzle' },
      { name: 'MCP Servers', note: 'Tool integration', icon: 'modelcontextprotocol' },
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
