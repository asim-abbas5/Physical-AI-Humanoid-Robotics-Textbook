---
id: 004
title: Generate textbook-generation implementation plan
stage: plan
date: 2025-12-06
surface: agent
model: claude-sonnet-4-5
feature: master
branch: master
user: system
command: /sp.plan
labels: ["planning", "architecture", "docusaurus", "rag", "free-tier"]
links:
  spec: specs/master/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/master/plan.md
  - specs/master/research.md
  - specs/master/data-model.md
  - specs/master/contracts/rag-api.yaml
  - specs/master/quickstart.md
  - CLAUDE.md
tests:
  - Constitution Check (pre-Phase 0): PASS
  - Constitution Check (post-Phase 1): PASS
---

## Prompt

       Generate a clean, minimal, production-ready implementation plan for the "textbook-generation" feature. The plan must include:

Folder and file structure for Docusaurus.
Chapter creation workflow (6 short chapters).
Sidebar and routing setup.
UI customization steps (clean, modern, minimal).
RAG chatbot architecture using:
FastAPI backend
Qdrant (vector store)
Neon Postgres (metadata)
Lightweight embeddings (free-tier friendly)
Text-selection-based Q&A workflow.
API endpoints, data flow, and integration steps.
Build, test, and deployment steps for GitHub Pages.
Optional hooks for:
Personalize Chapter button
Urdu Translation button
Keep the plan concise, professional, and sequential. Focus on speed, clarity, and free-tier compatibility.

## Response snapshot

Successfully executed the planning workflow for the "textbook-generation" feature. Generated comprehensive design artifacts:

**Phase 0 (Research)**: Created research.md documenting:
- Embedding model selection: all-MiniLM-L6-v2 (80MB, 384-dim, CPU-optimized)
- Content testing strategy: MDX validation, code verification, readability scoring
- Linting toolchain: markdownlint, Vale, textlint, pre-commit hooks
- Docusaurus configuration: auto-generated sidebar, GitHub Actions deployment
- RAG pipeline architecture: chunked retrieval → re-ranking → grounded generation

**Phase 1 (Design & Contracts)**: Generated:
- data-model.md: Complete entity models (Module, Section, CodeExample, EmbeddingChunk, ChatQuery, ChatResponse) with Postgres/Qdrant schemas
- contracts/rag-api.yaml: OpenAPI 3.0 specification with /query, /health, /sections endpoints
- quickstart.md: End-to-end setup guide (30-45 min) covering Docusaurus, linting, RAG backend, GitHub Actions

**Updated plan.md** with:
- Technical Context (languages, dependencies, storage, testing, performance goals)
- Constitution Check (pre-Phase 0 and post-Phase 1): All gates PASS, 1 justified exception (word count)
- Project Structure: Docusaurus frontend + FastAPI serverless backend
- Complexity Tracking: Documented word count justification

**Updated agent context** (CLAUDE.md) with tech stack details.

**Storage estimates**:
- Qdrant: 600KB / 1GB (60% utilization)
- Neon Postgres: 13.5MB / 512MB (3% utilization)

All design artifacts complete. Ready for Phase 2 task generation via /sp.tasks.

## Outcome

- ✅ Impact: Complete implementation plan with research, data models, API contracts, and quickstart guide generated
- 🧪 Tests: Constitution Check gates passed (pre-Phase 0 and post-Phase 1)
- 📁 Files: plan.md, research.md, data-model.md, contracts/rag-api.yaml, quickstart.md, CLAUDE.md
- 🔁 Next prompts: Run /sp.tasks to generate implementation tasks from this plan
- 🧠 Reflection: User request was comprehensive and well-structured; all technical unknowns resolved through research phase; free-tier infrastructure constraints validated with storage estimates

## Evaluation notes (flywheel)

- Failure modes observed: None; planning workflow executed successfully
- Graders run and results (PASS/FAIL): Constitution Check PASS (pre-Phase 0), Constitution Check PASS (post-Phase 1)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation; validate that generated tasks align with plan artifacts
