<!--
SYNC IMPACT REPORT:
Version: 0.0.0 → 1.0.0
Rationale: Initial constitution ratification for Physical AI & Humanoid Robotics textbook project

Modified Principles:
- All principles newly defined for this project

Added Sections:
- Core Principles (6 principles defined)
- Content Standards (documentation quality requirements)
- Technical Constraints (infrastructure and deployment requirements)
- Governance (amendment and compliance rules)

Templates Requiring Updates:
✅ Updated: constitution.md (this file)
✅ Reviewed: plan-template.md (compatible with constitution checks)
✅ Reviewed: spec-template.md (aligns with user story requirements)
✅ Reviewed: tasks-template.md (supports modular implementation)

Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Constitution

## Core Principles

### I. Technical Accuracy & Verifiability

All factual and technical claims MUST be validated with authoritative sources (official documentation, reputable research, or verified implementations). Citations MUST use Markdown inline links with a reference list per chapter. No unverified assertions or speculative content may be included without clear labeling.

**Rationale**: Educational integrity demands that learners can trust and verify every technical claim, ensuring the textbook serves as a reliable learning resource for students and professionals.

### II. Clarity & Accessibility

Content MUST be suitable for developers, students, and technical professionals with varying backgrounds. Writing tone MUST be instructional, friendly, and technically precise. Readability MUST target Flesch-Kincaid Grade 8–12. Complex concepts MUST be introduced progressively with examples and visual aids.

**Rationale**: The textbook serves diverse learners; clarity ensures effective knowledge transfer regardless of prior experience level, maximizing educational impact.

### III. Modular & Spec-Driven Structure

All content MUST align with Docusaurus structure conventions. Each chapter MUST be independently understandable while contributing to the overall learning path. Folder organization and sidebar configuration MUST follow Docusaurus best practices. Content MUST be delivered in Docusaurus-friendly Markdown (.mdx format).

**Rationale**: Modularity enables learners to navigate content flexibly and ensures the project is maintainable and extensible over time.

### IV. Consistency & Standardization

Terminology, formatting, code style, and architectural patterns MUST remain consistent across all 6 chapters. Code samples MUST use consistent libraries, versions, and conventions. Diagrams MUST follow reproducible standards (Mermaid or SVG). Cross-references between chapters MUST use consistent linking patterns.

**Rationale**: Consistency reduces cognitive load and prevents confusion, creating a cohesive learning experience that feels professionally produced.

### V. Practical Applicability & Reproducibility

Minimum 30% of content MUST be hands-on (tutorials, examples, demonstrations). All code samples MUST be tested, runnable, and include environment/version specifications. Technical steps MUST be reproducible by following the documented instructions without ambiguity. Error handling and troubleshooting guidance MUST be provided for common scenarios.

**Rationale**: Practical application solidifies theoretical understanding; reproducibility ensures learners can successfully execute examples and build confidence.

### VI. RAG-First Architecture

All chatbot responses MUST derive exclusively from the textbook content (no external knowledge injection). Embeddings MUST be lightweight and optimized for free-tier infrastructure (Qdrant + Neon + FastAPI). RAG pipeline MUST support select-text → Ask AI functionality. Responses MUST cite specific chapter sections when answering queries.

**Rationale**: A grounded RAG system ensures accurate, contextual answers aligned with the textbook, preventing hallucinations and maintaining educational integrity.

## Content Standards

### Chapter Structure Requirements

- **Chapter Length**: Each chapter MUST be 1,000–3,000 words
- **Total Book Length**: Complete textbook MUST be 20,000–40,000 words
- **Code-to-Text Ratio**: Minimum 30% hands-on content (code examples, tutorials, exercises)
- **Diagrams**: All diagrams MUST be reproducible (Mermaid or SVG preferred; no proprietary formats)
- **Cross-References**: Internal links MUST use relative paths compatible with GitHub Pages
- **Citations**: External references MUST be documented with inline links + reference section per chapter

### Code Quality Requirements

- All code samples MUST be tested and runnable
- Code MUST include version/environment specifications (e.g., Python 3.10, ROS 2 Humble)
- Code MUST follow consistent style conventions across all chapters
- Code MUST include inline comments explaining non-obvious logic
- Code examples MUST be compatible with the Docusaurus build process (no runtime dependencies in MDX)

### Deployment Requirements

- Book MUST build cleanly with Docusaurus (no warnings or broken links)
- All paths MUST be compatible with GitHub Pages deployment
- Build process MUST complete successfully without errors
- All images and assets MUST load correctly in production
- Navigation (sidebar, pagination) MUST function correctly

## Technical Constraints

### Infrastructure & Resource Limits

- **No Heavy GPU Usage**: All examples and RAG infrastructure MUST run on CPU or minimal GPU (free-tier constraints)
- **Minimal Embeddings**: Embedding models MUST be optimized for size and inference speed (e.g., sentence-transformers with quantization)
- **Free-Tier Architecture**: RAG stack (Qdrant + Neon Postgres + FastAPI) MUST operate within free-tier limits
- **Fast Builds**: Docusaurus build MUST complete in under 5 minutes
- **Lightweight Assets**: Images and diagrams MUST be optimized for web delivery (<500KB per asset)

### Technology Stack Requirements

- **Frontend**: Docusaurus (latest stable version)
- **RAG Backend**: FastAPI (Python 3.10+)
- **Vector Database**: Qdrant (free tier)
- **Relational Database**: Neon Postgres (free tier)
- **Embedding Model**: Sentence-transformers or equivalent lightweight model
- **Deployment**: GitHub Pages (static site generation)

### Licensing & Open Source Requirements

- Only open-source, non-restricted resources may be quoted or included
- All code samples MUST use permissive licenses (MIT, Apache 2.0, BSD)
- All external content MUST be properly attributed
- No proprietary code or restricted materials may be included

## Governance

### Amendment Process

1. **Proposal**: Any principle change MUST be documented with rationale and impact analysis
2. **Review**: Constitution amendments MUST be reviewed against existing specs, plans, and tasks
3. **Approval**: Major amendments (new principles, removed principles) require explicit approval
4. **Migration**: Template updates MUST be synchronized after constitution changes
5. **Versioning**: Constitution versions follow MAJOR.MINOR.PATCH semantic versioning
   - **MAJOR**: Backward-incompatible governance or principle changes
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Requirements

- All pull requests MUST verify compliance with constitution principles
- Complexity violations MUST be documented and justified in plan.md
- Architecture decisions affecting multiple principles MUST trigger ADR creation
- Every user interaction MUST generate a Prompt History Record (PHR)
- Constitution supersedes all other project practices and conventions

### Quality Gates

- **Specification Gate**: All specs MUST align with principles I–VI before planning
- **Planning Gate**: Plans MUST pass Constitution Check before task generation
- **Implementation Gate**: Code MUST be reviewed for principle compliance before merge
- **Deployment Gate**: Final build MUST pass all deployment requirements before release

### Continuous Improvement

- Constitution MUST be reviewed after each major milestone
- Principle violations MUST be logged and reviewed for pattern analysis
- Feedback from development process MUST inform constitution refinements
- All amendments MUST be recorded in CLAUDE.md and synced to templates

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
