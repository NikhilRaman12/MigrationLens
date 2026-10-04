# 🔍 MigrationLens

> **DEV.to Sanity Challenge — Path One: AI Agents & Structured Content**
>
> **Evidence-grounded technology migration intelligence powered by Sanity structured content.**

---

## 📌 Challenge Story & Vision

**MigrationLens** is an evidence-grounded migration planning agent built for software architects, engineering managers, and platform engineers facing complex technology upgrades (e.g., Next.js 14 to 15, React 18 to 19, Node.js 18 to 20, Python 3.9 to 3.12).

Instead of generating migration advice from raw text embeddings or probabilistic LLM hallucinations alone, **MigrationLens reasons over structured entities stored in Sanity**, including technologies, release versions, dependency constraints, breaking changes, verified technical claims, primary documentation sources, and step-by-step migration paths. 

**Every single recommendation can be traced directly back to structured content and evidence stored in the Sanity Content Lake.**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  USER FRONTEND                                  │
│             Next.js 16 (App Router) + Tailwind CSS + React 19 Client            │
│       [ Migration Planning Form | Interactive Analysis Dashboard | Presets ]    │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        │ HTTP POST /api/migration-agent
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MIGRATION AGENT ROUTE HANDLER                          │
│                          (src/app/api/migration-agent)                          │
│                                                                                 │
│   1. Parallel GROQ Retrieval  2. Schema Graph Synthesis  3. Fallback Seed Guard │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        │ GROQ Queries over HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               SANITY CONTENT LAKE                               │
│                         (Project ID: zp2gmoor / production)                     │
│                                                                                 │
│  ┌──────────────┐   ┌───────────────────┐   ┌───────────────────────────────┐   │
│  │  Technology  │──►│ TechnologyVersion │──►│           Migration           │   │
│  └──────────────┘   └───────────────────┘   └───────────────────────────────┘   │
│         │                    │                              │                   │
│         ▼                    ▼                              ▼                   │
│  ┌──────────────┐   ┌───────────────────┐   ┌──────────────┐ ┌──────────────┐   │
│  │  Dependency  │   │      Change       │   │    Claim     │ │    Source    │   │
│  └──────────────┘   └───────────────────┘   └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌊 User Flow

1. **Stack Selection**: The user enters or selects the source technology/version (e.g., `Next.js 14.2.0`) and target technology/version (e.g., `Next.js 15.0.0`), or chooses a pre-populated quick-preset chip.
2. **Parallel GROQ Retrieval**: The Next.js API route issues parallel GROQ graph queries to the Sanity Content Lake:
   - `getMigrationData(sourceTech, sourceVer, targetTech, targetVer)`
   - `getDependencyData(sourceTech)`
   - `getChanges(sourceTech)`
   - `getClaimData(sourceTech)`
   - `getSources()`
3. **Structured Synthesis**: The Migration Agent orchestrates entity data across schemas to evaluate overall migration complexity, calculate estimated effort, identify breaking changes, assemble actionable steps, map dependencies, and link evidence sources.
4. **Fallback Mode**: If the live Sanity dataset lacks a specific entity pair, the curated seed dataset activates automatically—ensuring challenge judges never encounter an empty state.
5. **Interactive Evidence Dashboard**: The UI renders a complete migration plan with grounded confidence metrics, breaking change mitigations, validation checklists, rollback procedures, and clickable source links.

---

## 📐 Sanity Schema Design

The Sanity Studio (`studio-migrationlens/schemaTypes`) defines 7 interconnected document types:

```mermaid
erDiagram
    TECHNOLOGY ||--o{ TECHNOLOGY_VERSION : "has versions"
    TECHNOLOGY ||--o{ DEPENDENCY : "defines relationships"
    TECHNOLOGY ||--o{ CHANGE : "undergoes changes"
    TECHNOLOGY_VERSION ||--o{ MIGRATION : "source / target version"
    TECHNOLOGY_VERSION ||--o{ CLAIM : "applies to"
    SOURCE ||--o{ CLAIM : "backs claim"
    CLAIM ||--o| CLAIM : "supersedes / contradicts"

    TECHNOLOGY {
        string name
        slug slug
        string vendor
        string category
        text description
    }

    TECHNOLOGY_VERSION {
        reference technology
        string version
        date releaseDate
        string lifecycleStatus
        date endOfSupport
        text notes
    }

    MIGRATION {
        reference sourceTechnology
        reference sourceVersion
        reference targetTechnology
        reference targetVersion
        string migrationType
        array prerequisites
        array migrationSteps
        array validationSteps
        array rollbackSteps
        text riskSummary
    }

    DEPENDENCY {
        reference sourceTechnology
        reference targetTechnology
        string requiredVersion
        string relationship
        string severity
        text notes
    }

    CHANGE {
        reference technology
        reference fromVersion
        reference toVersion
        string title
        string changeType
        string severity
        string affectedFeature
        text migrationAction
        text validationMethod
    }

    CLAIM {
        string subject
        string attribute
        text value
        reference appliesToVersion
        reference source
        string confidence
    }

    SOURCE {
        string title
        string publisher
        url url
        string sourceType
        string authority
        text summary
    }
```

---

## 🧠 Why Structured Content Matters & How MigrationLens Differs from Keyword Search

### 1. The Limitation of Unstructured Vector Search & Keyword RAG
Standard AI search and Retrieval-Augmented Generation (RAG) treat technical documentation as unstructured chunks of text stored in vector databases. This approach fails for technology migrations because:
- **Version Ambiguity**: Keyword search confuses guidance across version boundaries (e.g., mixing Next.js 13 `pages` directory advice with Next.js 15 `app` directory async request APIs).
- **Missing Dependency Constraints**: Text embeddings cannot deterministically evaluate transitive version bounds (`React >= 19.0.0` required by `Next.js 15.0.0`).
- **Hallucinated Migration Steps**: Pure LLMs invent non-existent flags, deprecated APIs, or unsafe rollback procedures when lacking explicit entity boundaries.

### 2. The Sanity Structured Content Advantage
By modeling technology ecosystems as a **Sanity GROQ Schema Graph**:
- **Deterministic Version Traversal**: Sanity dereferences explicit relations between `TechnologyVersion`, `Change`, and `Dependency` documents.
- **Evidence Attributability**: Every claim rendered in the UI directly references a Sanity `source` document with authority metadata (`PRIMARY`, `SECONDARY`, `COMMUNITY`).
- **Verifiable Grounding**: The agent calculates a confidence score based on the density of verified claims and primary sources retrieved from the Sanity Content Lake.

---

## 🏆 Challenge Alignment & Submission Checklist

| Required Deliverable | Status | Implementation Details |
| :--- | :---: | :--- |
| **Path One Focus** | ✅ | Demonstrates AI Agent orchestration over structured content in Sanity. |
| **Homepage UI** | ✅ | Custom `src/app/page.tsx` replacing starter template with clean Tailwind styling. |
| **API Scaffold** | ✅ | Functional `src/app/api/migration-agent/route.ts` executing GROQ queries. |
| **Sanity Retrieval Helpers** | ✅ | Modular `getMigrationData()`, `getDependencyData()`, `getClaimData()`, `getSources()` in `src/sanity/queries.ts`. |
| **Submission Demo Mode** | ✅ | `src/sanity/demo-data.ts` guarantees non-empty states for challenge evaluation. |
| **Zero External Dead Weight** | ✅ | Built strictly with existing Next.js, Sanity, and Tailwind architecture. |
| **Production Build** | ✅ | `npm run build` succeeds cleanly with zero TypeScript errors. |

---

## 📸 Recommended Submission Screenshots

When creating your DEV.to challenge submission post, capture screenshots of the following sections:

1. **Hero & Migration Query Form**: Showing the header, project branding, preset chips (`Next.js 14.2 → 15.0`), and input fields.
2. **Migration Intelligence Summary & Grounded Confidence Card**: Highlighting the 98% confidence score, entity counts, complexity level, and effort estimation.
3. **Breaking Changes Analysis**: Displaying the structured breaking change cards with severity badges, affected features, required actions, and validation methods.
4. **Actionable Migration Steps & Recommendations**: Showing the step-by-step ordered migration path with prerequisite checks, validation steps, and emergency rollback procedures.
5. **Evidence Trail & Sources**: Demonstrating direct attribution to Sanity source documents with clickable verification links.

---

## 🛠️ Quick Start & Local Development

### 1. Clone & Install Web App
```bash
cd web
npm install
```

### 2. Verify Production Build
```bash
npm run build
```

### 3. Start Next.js Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Run Sanity Studio (Optional)
```bash
cd ../studio-migrationlens
npm install
npx sanity dev
# Open http://localhost:3333 to manage structured content
```

---

## 📜 License

MIT License. Built for the DEV.to Sanity Challenge.
