# Implementation Plan: Physical AI & Humanoid Robotics Textbook

**Branch**: `master` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/master/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a production-ready, interactive Physical AI & Humanoid Robotics textbook using Docusaurus for the frontend, deployed to GitHub Pages, with an integrated RAG chatbot backend (FastAPI + Qdrant + Neon Postgres) that provides context-aware answers grounded exclusively in textbook content. The textbook will contain 4 modules with 6-10 sections each (1,500-2,500 words per section) with runnable code examples, diagrams, and citations, optimized for free-tier infrastructure and fast builds.

## Technical Context

**Language/Version**: Python 3.10+ (backend), Node.js 18+ (Docusaurus build), MDX (content)
**Primary Dependencies**: Docusaurus v3, FastAPI, Qdrant (vector DB), Neon Postgres, sentence-transformers (embeddings)
**Storage**: Qdrant Cloud (free tier, vector embeddings), Neon Postgres (free tier, metadata), GitHub (static content)
**Testing**: Jest (Docusaurus build validation), pytest (FastAPI backend), Markdown link checker (CI/CD)
**Target Platform**: GitHub Pages (static site), Vercel Serverless Functions (RAG backend)
**Project Type**: Web application (static frontend + serverless backend)
**Performance Goals**: <5min Docusaurus build, <2s RAG query response, <500KB per asset
**Constraints**: Free-tier infrastructure only, CPU-only embeddings, no heavy GPU usage, offline build process
**Scale/Scope**: 6 chapters, 40,000-55,000 words total, 20+ code examples, select-text Q&A UI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Technical Accuracy & Verifiability** | ✅ PASS | All code examples and technical claims will be cited and verified against official docs (ROS 2, NVIDIA Isaac, Docusaurus) |
| **II. Clarity & Accessibility** | ✅ PASS | Target Flesch-Kincaid Grade 8-12; progressive complexity; visual aids required |
| **III. Modular & Spec-Driven Structure** | ✅ PASS | Docusaurus structure enforced; each chapter independently navigable; .mdx format |
| **IV. Consistency & Standardization** | ✅ PASS | Consistent terminology, code style, diagram formats (Mermaid/SVG), cross-reference patterns |
| **V. Practical Applicability & Reproducibility** | ✅ PASS | 30%+ hands-on content; all code tested with version specs; troubleshooting sections included |
| **VI. RAG-First Architecture** | ✅ PASS | Grounded responses only; lightweight embeddings; select-text UI; section citations required |
| **Chapter Length** | ⚠️ JUSTIFIED | 1,000-3,000 words/chapter (constitution: same); total 40k-55k words (constitution: 20k-40k, justified for 4 technical modules) |
| **Free-Tier Constraints** | ✅ PASS | Qdrant + Neon + Vercel free tiers; CPU-only embeddings; <5min builds; <500KB assets |
| **Deployment Requirements** | ✅ PASS | GitHub Pages compatible; zero warnings/errors; all links validated in CI/CD |

**Pre-Phase 0 Decision**: ✅ Proceed to research. One justified exception (total word count) documented in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Docusaurus Frontend (static site)
docs/
├── intro.md                    # Landing page
├── chapter-01/                 # Chapter folders (6 total)
│   ├── index.md               # Chapter introduction
│   ├── section-01.mdx         # MDX content with code examples
│   └── section-02.mdx
├── chapter-02/
├── chapter-03/
├── chapter-04/
├── chapter-05/
└── chapter-06/

static/
├── img/                        # Optimized images (<500KB each)
└── diagrams/                   # SVG/Mermaid exports

src/
├── components/
│   ├── ChatWidget.tsx          # Select-text → Ask AI UI
│   └── PersonalizationButton.tsx  # Optional: customize chapter
├── css/
│   └── custom.css              # Clean, minimal theme

docusaurus.config.js            # Sidebar, routing, GitHub Pages config
sidebars.js                     # Auto-generated from folder structure

# RAG Backend (serverless)
api/
├── main.py                     # FastAPI entry point
├── embedding.py                # Lightweight embeddings (sentence-transformers)
├── qdrant_client.py           # Vector DB operations
├── neon_client.py             # Metadata queries
├── rag_pipeline.py            # Query → retrieval → grounded response
└── requirements.txt

vercel.json                     # Vercel serverless config

# Testing & CI/CD
.github/
└── workflows/
    ├── build-test.yml         # Docusaurus build + link checker
    └── deploy.yml             # GitHub Pages deployment

tests/
├── backend/
│   ├── test_embedding.py
│   └── test_rag.py
└── frontend/
    └── docusaurus.test.js
```

**Structure Decision**: Web application (static frontend + serverless backend). Docusaurus generates static HTML/CSS/JS for GitHub Pages. FastAPI backend deployed to Vercel Serverless Functions. RAG queries routed via HTTPS from frontend widget to backend API.

## Complexity Tracking

> **Filled for one justified Constitution Check violation**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Total word count 40k-55k (constitution: 20k-40k) | Educational depth across 4 technical modules (ROS 2, Digital Twin, NVIDIA Isaac, VLA) requires comprehensive coverage with hands-on examples | Reducing to 20k-40k would eliminate critical tutorials and code examples needed to meet "30% hands-on" requirement (Principle V) and fail to cover all modules adequately |

---

## Post-Phase 1 Constitution Re-Check

*Re-evaluation after completing research.md, data-model.md, contracts/, and quickstart.md*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| **I. Technical Accuracy & Verifiability** | ✅ PASS | Research.md documents authoritative sources for all technical decisions; data-model.md specifies citation validation in CI/CD |
| **II. Clarity & Accessibility** | ✅ PASS | Readability validation automated via textstat; quickstart.md provides clear setup instructions |
| **III. Modular & Spec-Driven Structure** | ✅ PASS | Project structure follows Docusaurus conventions; auto-generated sidebar from folder hierarchy |
| **IV. Consistency & Standardization** | ✅ PASS | Linting toolchain (markdownlint, Vale, textlint) enforces consistency; pre-commit hooks configured |
| **V. Practical Applicability & Reproducibility** | ✅ PASS | Code validation scripts ensure all examples are tested; quickstart.md provides end-to-end setup |
| **VI. RAG-First Architecture** | ✅ PASS | API contract (rag-api.yaml) enforces grounded responses with citations; embedding model (all-MiniLM-L6-v2) selected and documented |
| **Chapter Length** | ⚠️ JUSTIFIED | Same justification as pre-Phase 0; no design changes affecting this constraint |
| **Free-Tier Constraints** | ✅ PASS | Storage estimates confirm Qdrant (600KB/1GB) and Neon (13.5MB/512MB) well within limits; build optimizations target <5min |
| **Deployment Requirements** | ✅ PASS | GitHub Actions workflows defined; link checker integrated in CI/CD |

**Post-Phase 1 Decision**: ✅ All gates pass. Ready to proceed to Phase 2 (task generation via `/sp.tasks`).

**Design Artifacts Complete**:
- ✅ research.md (Phase 0)
- ✅ data-model.md (Phase 1)
- ✅ contracts/rag-api.yaml (Phase 1)
- ✅ quickstart.md (Phase 1)

**Next Command**: `/sp.tasks` to generate implementation tasks from this plan.
