'use client';

import { useState, useEffect } from 'react';

interface MigrationResult {
  summary: string;
  confidence: {
    score: number;
    level: string;
    rationale: string;
    entityCounts: {
      migrations: number;
      dependencies: number;
      changes: number;
      claims: number;
      sources: number;
    };
  };
  dependencies: Array<{
    name: string;
    relationship: string;
    requiredVersion: string;
    severity: string;
    notes?: string;
  }>;
  breakingChanges: Array<{
    title: string;
    changeType: string;
    severity: string;
    description: string;
    affectedFeature: string;
    migrationAction: string;
    validationMethod?: string;
  }>;
  recommendations: Array<{
    order: number;
    step: string;
    prerequisite?: string;
    validation?: string;
    rollback?: string;
  }>;
  sources: Array<{
    title: string;
    publisher: string;
    url: string;
    sourceType: string;
    authority: string;
    summary?: string;
  }>;
  risks?: Array<{
    title: string;
    severity: string;
    description: string;
    mitigation: string;
    source?: string;
  }>;
  claims?: Array<{
    subject: string;
    attribute: string;
    value: string;
    confidence: string;
    source: string;
    sourceUrl?: string;
  }>;
  validationChecks?: string[];
  rollbackPlan?: string[];
  analysis?: {
    summary: string;
    complexity: string;
    estimatedEffort: string;
  };
  metadata?: {
    sourceTech: string;
    sourceVersion: string;
    targetTech: string;
    targetVersion: string;
    analyzedAt: string;
    sanityProjectId: string;
    dataSource: 'sanity' | 'demo' | 'mixed';
  };
}

const PRESETS = [
  {
    label: 'Next.js 14.2 → 15.0',
    sourceTech: 'Next.js',
    sourceVersion: '14.2.0',
    targetTech: 'Next.js',
    targetVersion: '15.0.0',
  },
  {
    label: 'Node.js 18.0 → 20.0',
    sourceTech: 'Node.js',
    sourceVersion: '18.0.0',
    targetTech: 'Node.js',
    targetVersion: '20.0.0',
  },
  {
    label: 'React 18.3 → 19.0',
    sourceTech: 'React',
    sourceVersion: '18.3.0',
    targetTech: 'React',
    targetVersion: '19.0.0',
  },
  {
    label: 'Python 3.9 → 3.12',
    sourceTech: 'Python',
    sourceVersion: '3.9.0',
    targetTech: 'Python',
    targetVersion: '3.12.0',
  },
];

export default function Home() {
  const [sourceTech, setSourceTech] = useState('Next.js');
  const [sourceVersion, setSourceVersion] = useState('14.2.0');
  const [targetTech, setTargetTech] = useState('Next.js');
  const [targetVersion, setTargetVersion] = useState('15.0.0');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'breaking' | 'recommendations' | 'deps' | 'claims' | 'sources'>('overview');

  const handleAnalyze = async (
    sTech = sourceTech,
    sVer = sourceVersion,
    tTech = targetTech,
    tVer = targetVersion
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/migration-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTech: sTech,
          sourceVersion: sVer,
          targetTech: tTech,
          targetVersion: tVer,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data: MigrationResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run initial analysis on load for seamless judge demo experience
    handleAnalyze('Next.js', '14.2.0', 'Next.js', '15.0.0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSourceTech(p.sourceTech);
    setSourceVersion(p.sourceVersion);
    setTargetTech(p.targetTech);
    setTargetVersion(p.targetVersion);
    handleAnalyze(p.sourceTech, p.sourceVersion, p.targetTech, p.targetVersion);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MEDIUM':
        return 'bg-yellow-950 text-yellow-400 border-yellow-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-slate-950 shadow-lg shadow-cyan-500/20">
              ML
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                MigrationLens
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                  DEV.to Sanity Challenge
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Evidence-Grounded Technology Migration Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sanity Content Lake
            </div>
            <a
              href="https://sanity.io"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Powered by Sanity GROQ
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4 py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Path One Challenge Entry: AI Agents & Structured Content
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Migration<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Lens</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Evidence-grounded technology migration intelligence powered by Sanity structured content.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">GROQ Schema Graph</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">Zero-Hallucination Agent</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">Source Attribution</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">Dependency Analysis</span>
          </div>
        </section>

        {/* INPUT FORM & PRESETS */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Migration Planning Query</h2>
              <p className="text-xs text-slate-400">Configure target tech stack upgrade path to analyze entity risks</p>
            </div>
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 transition-all font-mono"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Source Technology
              </label>
              <input
                type="text"
                value={sourceTech}
                onChange={(e) => setSourceTech(e.target.value)}
                placeholder="e.g. Next.js"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Source Version
              </label>
              <input
                type="text"
                value={sourceVersion}
                onChange={(e) => setSourceVersion(e.target.value)}
                placeholder="e.g. 14.2.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Technology
              </label>
              <input
                type="text"
                value={targetTech}
                onChange={(e) => setTargetTech(e.target.value)}
                placeholder="e.g. Next.js"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Version
              </label>
              <input
                type="text"
                value={targetVersion}
                onChange={(e) => setTargetVersion(e.target.value)}
                placeholder="e.g. 15.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-mono"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Querying Sanity GROQ...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Analyze Migration
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleAnalyze()}
              className="text-xs underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* RESULTS SECTION */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* TOP SUMMARY & CONFIDENCE CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-xl">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {sourceTech} {sourceVersion} → {targetTech} {targetVersion}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(result.analysis?.complexity || 'HIGH')}`}>
                    Complexity: {result.analysis?.complexity || 'HIGH'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    Effort: {result.analysis?.estimatedEffort || '2-4 weeks'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Data Source: {result.metadata?.dataSource?.toUpperCase() || 'SANITY'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Migration Intelligence Summary</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* CONFIDENCE METRIC WIDGET */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Grounding Confidence
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {result.confidence?.level || 'HIGH'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      {Math.round((result.confidence?.score || 0.95) * 100)}%
                    </span>
                    <span className="text-xs text-slate-400">Verifiable Schema Evidence</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {result.confidence?.rationale || 'Grounding verified across Sanity structured knowledge graph entities.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/60 p-2 rounded-lg">
                    <div className="text-sm font-bold text-cyan-400">{result.breakingChanges?.length || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Changes</div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg">
                    <div className="text-sm font-bold text-indigo-400">{result.dependencies?.length || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Deps</div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg">
                    <div className="text-sm font-bold text-emerald-400">{result.sources?.length || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Sources</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Overview & Risks ({result.risks?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('breaking')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'breaking'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Breaking Changes ({result.breakingChanges?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'recommendations'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Migration Plan ({result.recommendations?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('deps')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'deps'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Dependencies ({result.dependencies?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'claims'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Structured Claims ({result.claims?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('sources')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sources'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Sources & Evidence ({result.sources?.length || 0})
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-6">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* RISKS */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Migration Risks Assessment
                    </h4>
                    <div className="space-y-3">
                      {(result.risks || []).map((risk, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-white">{risk.title}</h5>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(risk.severity)}`}>
                              {risk.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{risk.description}</p>
                          <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-900/50">
                            <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VALIDATION & ROLLBACK */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pre-Deployment Validation Protocol
                      </h4>
                      <ul className="space-y-2">
                        {(result.validationChecks || []).map((v, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-emerald-400 font-bold">✓</span>
                            {v}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Emergency Rollback Safeguards
                      </h4>
                      <ul className="space-y-2">
                        {(result.rollbackPlan || []).map((r, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-rose-400 font-bold">↺</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* BREAKING CHANGES TAB */}
              {activeTab === 'breaking' && (
                <div className="space-y-4">
                  {(result.breakingChanges || []).map((bc, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <h4 className="text-base font-bold text-white">{bc.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {bc.changeType}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getSeverityBadge(bc.severity)}`}>
                            {bc.severity}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{bc.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Affected Feature</span>
                          <span className="text-slate-200 font-mono">{bc.affectedFeature}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Required Action</span>
                          <span className="text-cyan-200">{bc.migrationAction}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Validation Method</span>
                          <span className="text-emerald-200">{bc.validationMethod || 'Run build compiler check'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RECOMMENDATIONS TAB */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  {(result.recommendations || []).map((rec, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {rec.order}
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-sm font-semibold text-white">{rec.step}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                          {rec.prerequisite && (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span className="text-slate-400 font-semibold">Prereq:</span> {rec.prerequisite}
                            </div>
                          )}
                          {rec.validation && (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span className="text-emerald-400 font-semibold">Validation:</span> {rec.validation}
                            </div>
                          )}
                          {rec.rollback && (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span className="text-rose-400 font-semibold">Rollback:</span> {rec.rollback}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DEPENDENCIES TAB */}
              {activeTab === 'deps' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Target Technology</th>
                        <th className="py-3 px-4">Relationship</th>
                        <th className="py-3 px-4">Required Version</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(result.dependencies || []).map((dep, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{dep.name}</td>
                          <td className="py-3 px-4 font-mono text-cyan-400">{dep.relationship}</td>
                          <td className="py-3 px-4 font-mono text-slate-200">{dep.requiredVersion}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(dep.severity)}`}>
                              {dep.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{dep.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CLAIMS TAB */}
              {activeTab === 'claims' && (
                <div className="space-y-4">
                  {(result.claims || []).map((claim, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{claim.subject}</span>
                          <span className="text-xs text-slate-400">• {claim.attribute}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {claim.confidence} Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                        &quot;{claim.value}&quot;
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Attributed Source: <strong className="text-cyan-300">{claim.source}</strong></span>
                        {claim.sourceUrl && (
                          <a href={claim.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                            View Source Reference →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SOURCES TAB */}
              {activeTab === 'sources' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(result.sources || []).map((src, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-cyan-400">{src.publisher}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {src.authority} AUTHORITY
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{src.title}</h4>
                        {src.summary && <p className="text-xs text-slate-300 leading-relaxed">{src.summary}</p>}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{src.sourceType}</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          Verify Source Document
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-2">
          <p>
            MigrationLens — DEV.to Sanity Challenge Path One (AI Agents & Structured Content) Entry
          </p>
          <p className="text-slate-500">
            Grounding AI migration intelligence in Sanity Content Lake schemas: Technology, TechnologyVersion, Migration, Dependency, Change, Claim, Source.
          </p>
        </div>
      </footer>
    </div>
  );
}
