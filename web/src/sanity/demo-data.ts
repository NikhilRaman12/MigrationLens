export const DEMO_MIGRATION = {
  _id: 'demo-migration-nextjs-14-15',
  migrationType: 'VERSION_UPGRADE',
  sourceTechName: 'Next.js',
  sourceVersionStr: '14.2.0',
  targetTechName: 'Next.js',
  targetVersionStr: '15.0.0',
  prerequisites: [
    'Upgrade Node.js to v18.18.0 or later (v20+ recommended)',
    'Upgrade React and React DOM to v19.0.0-rc or later',
    'Audit codebase for deprecated sync request APIs (cookies(), headers(), params)',
  ],
  migrationSteps: [
    {
      order: 1,
      description:
        'Run the automated Next.js 15 codemod: npx @next/codemod@canary upgrade latest',
      prerequisite: 'Clean git working tree',
      validation:
        'Verify package.json dependencies updated to Next.js 15 and React 19',
      rollback: 'git checkout package.json package-lock.json',
    },
    {
      order: 2,
      description:
        'Update asynchronous request APIs: await cookies(), await headers(), and await params in Server Components & Route Handlers',
      prerequisite: 'Codemod completed',
      validation:
        'Run npm run build and check for synchronous request accessor TypeScript errors',
      rollback: 'Revert affected async component files',
    },
    {
      order: 3,
      description:
        'Review fetch request caching policy. In Next.js 15, fetch requests are no longer cached by default (cache: "no-store")',
      prerequisite: 'API routes updated',
      validation:
        'Inspect API response headers for cache-control directives during end-to-end integration tests',
      rollback:
        'Explicitly set { cache: "force-cache" } on endpoints requiring static caching',
    },
    {
      order: 4,
      description:
        'Update next.config.ts / next.config.js to use new serverActions config format if custom origins were defined',
      prerequisite: 'Next.js build passing',
      validation: 'Run npx next lint to ensure config schema validity',
      rollback: 'Revert next.config changes',
    },
  ],
  validationSteps: [
    'Execute npm run build to verify zero TypeScript or Turbopack compilation errors',
    'Run automated test suite (Jest/Playwright) to ensure no regressions in server components',
    'Inspect runtime logs for React 19 hydration warning notices',
    'Verify cache-control headers on static vs dynamic route endpoints',
  ],
  rollbackSteps: [
    'Revert commit history to pre-migration release tag',
    'Run npm install to restore previous node_modules lockfile',
    'Deploy restored build artifact to staging environment and verify health endpoints',
  ],
  riskSummary:
    'High impact on Server Components and Route Handlers utilizing synchronous cookies() or headers(). Default fetch caching change may increase backend load if not explicitly set to force-cache.',
}

export const DEMO_DEPENDENCIES = [
  {
    _id: 'demo-dep-react-19',
    sourceTechnology: 'Next.js',
    targetTechnology: 'React',
    sourceVersion: '14.2.0',
    requiredVersion: '>=19.0.0',
    relationship: 'REQUIRES',
    severity: 'CRITICAL',
    notes:
      'Next.js 15 requires React 19 as a peer dependency for Server Component async rendering and React Compiler compatibility.',
  },
  {
    _id: 'demo-dep-typescript-5',
    sourceTechnology: 'Next.js',
    targetTechnology: 'TypeScript',
    sourceVersion: '14.2.0',
    requiredVersion: '>=5.4.0',
    relationship: 'RECOMMENDS',
    severity: 'HIGH',
    notes:
      'TypeScript 5.4+ is required to support modern promise types for dynamic route params and searchParams.',
  },
  {
    _id: 'demo-dep-node-20',
    sourceTechnology: 'Next.js',
    targetTechnology: 'Node.js',
    sourceVersion: '14.2.0',
    requiredVersion: '>=18.18.0 (20.x recommended)',
    relationship: 'REQUIRES',
    severity: 'CRITICAL',
    notes:
      'Node.js 18.18+ minimum runtime requirement. Node.js 20 LTS recommended for production stability.',
  },
  {
    _id: 'demo-dep-tailwind-4',
    sourceTechnology: 'Next.js',
    targetTechnology: 'Tailwind CSS',
    sourceVersion: '14.2.0',
    requiredVersion: '>=3.4.0',
    relationship: 'COMPATIBLE_WITH',
    severity: 'LOW',
    notes: 'Fully compatible with Tailwind CSS v3.4 and v4.0 postcss engine.',
  },
]

export const DEMO_CHANGES = [
  {
    _id: 'demo-change-async-request-api',
    technologyName: 'Next.js',
    fromVersion: '14.2.0',
    toVersion: '15.0.0',
    title: 'Async Request APIs (cookies, headers, params, searchParams)',
    description:
      'In Next.js 15, request-specific data accessors like cookies(), headers(), params, and searchParams are now asynchronous and return Promises.',
    changeType: 'BREAKING',
    severity: 'CRITICAL',
    affectedFeature: 'Server Components & Route Handlers',
    migrationAction:
      'Update all calls to await cookies(), await headers(), and await params in async component functions or use React.use() in client components.',
    validationMethod:
      'TypeScript compiler type checks for un-awaited Promise usage',
  },
  {
    _id: 'demo-change-fetch-uncached',
    technologyName: 'Next.js',
    fromVersion: '14.2.0',
    toVersion: '15.0.0',
    title: 'Default fetch Caching Policy Changed to Uncached',
    description:
      'fetch requests in Next.js 15 default to cache: "no-store" instead of force-cache. GET Route Handlers are also uncached by default.',
    changeType: 'BEHAVIOR_CHANGE',
    severity: 'HIGH',
    affectedFeature: 'Data Fetching & Route Handlers',
    migrationAction:
      'Explicitly specify { cache: "force-cache" } or dynamic export settings on routes requiring static response caching.',
    validationMethod: 'Inspect network response headers for Cache-Control',
  },
  {
    _id: 'demo-change-react-19-peer',
    technologyName: 'React',
    fromVersion: '18.3.0',
    toVersion: '19.0.0',
    title: 'React 19 Upgrade & Peer Dependency Alignment',
    description:
      'React 19 introduces async transitions, Actions, useActionState, useFormStatus, and removes legacy refs in class components.',
    changeType: 'BREAKING',
    severity: 'HIGH',
    affectedFeature: 'React Core Engine & Hooks',
    migrationAction:
      'Upgrade react and react-dom packages to ^19.0.0. Replace legacy ref props with direct ref attributes.',
    validationMethod:
      'Run unit test suite and check console for React 19 hydration/ref deprecation warnings',
  },
  {
    _id: 'demo-change-server-actions-origin',
    technologyName: 'Next.js',
    fromVersion: '14.2.0',
    toVersion: '15.0.0',
    title: 'Server Actions Security & Allowed Origins Configuration',
    description:
      'Server Actions enforcing stricter cross-origin origin header checks by default.',
    changeType: 'CONFIGURATION',
    severity: 'MEDIUM',
    affectedFeature: 'Server Actions Security',
    migrationAction:
      'Configure allowedOrigins in next.config.ts under experimental.serverActions if serving behind reverse proxies.',
    validationMethod:
      'Test form submissions across cross-origin staging deployments',
  },
]

export const DEMO_CLAIMS = [
  {
    _id: 'demo-claim-1',
    subject: 'Next.js 15',
    attribute: 'Async Request APIs Requirement',
    value:
      'cookies(), headers(), params, and searchParams return Promises in Next.js 15 and must be awaited.',
    versionStr: '15.0.0',
    confidence: 'HIGH',
    sourceName: 'Official Next.js 15 Release Announcement',
    sourceUrl: 'https://nextjs.org/blog/next-15',
    sourcePublisher: 'Vercel',
  },
  {
    _id: 'demo-claim-2',
    subject: 'Next.js 15',
    attribute: 'Peer Dependency',
    value:
      'Requires React 19 as the underlying rendering engine for Server Components.',
    versionStr: '15.0.0',
    confidence: 'HIGH',
    sourceName: 'Next.js Upgrade Documentation',
    sourceUrl:
      'https://nextjs.org/docs/app/building-your-application/upgrading/version-15',
    sourcePublisher: 'Vercel',
  },
  {
    _id: 'demo-claim-3',
    subject: 'Node.js',
    attribute: 'Runtime Version Matrix',
    value:
      'Minimum supported Node.js version is 18.18.0; Node.js 20 LTS is recommended.',
    versionStr: '20.0.0',
    confidence: 'HIGH',
    sourceName: 'Node.js Release Matrix',
    sourceUrl: 'https://nodejs.org/en/about/previous-releases',
    sourcePublisher: 'Node.js Foundation',
  },
]

export const DEMO_SOURCES = [
  {
    _id: 'demo-source-next15-blog',
    title: 'Next.js 15 Release Blog & Upgrade Guide',
    publisher: 'Vercel',
    url: 'https://nextjs.org/blog/next-15',
    publishedAt: '2024-10-21T00:00:00Z',
    sourceType: 'OFFICIAL_DOCS',
    authority: 'PRIMARY',
    version: '15.0.0',
    summary:
      'Official release documentation detailing async request APIs, fetch un-caching defaults, React 19 support, and codemods.',
  },
  {
    _id: 'demo-source-react19-docs',
    title: 'React 19 Release & Migration Documentation',
    publisher: 'Meta / React Core Team',
    url: 'https://react.dev/blog/2024/04/25/react-19',
    publishedAt: '2024-04-25T00:00:00Z',
    sourceType: 'RELEASE_NOTES',
    authority: 'PRIMARY',
    version: '19.0.0',
    summary:
      'Comprehensive guide covering Actions, useActionState, Server Functions, and breaking changes in React 19.',
  },
  {
    _id: 'demo-source-node-lts',
    title: 'Node.js 20 LTS Security and Lifecycle Roadmap',
    publisher: 'Node.js OpenJS Foundation',
    url: 'https://nodejs.org/en/about/previous-releases',
    publishedAt: '2023-10-24T00:00:00Z',
    sourceType: 'SECURITY_ADVISORY',
    authority: 'PRIMARY',
    version: '20.0.0',
    summary:
      'Active LTS support timelines, V8 engine upgrades, and cryptography module updates for Node 20.',
  },
]
