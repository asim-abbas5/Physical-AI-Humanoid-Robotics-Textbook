# Physical AI & Humanoid Robotics Textbook

An AI-native, interactive textbook covering Physical AI and Humanoid Robotics fundamentals with integrated RAG chatbot for context-aware Q&A.

## 🎯 Overview

This project creates a production-ready technical textbook using:
- **Frontend**: Docusaurus v3 (static site on GitHub Pages)
- **Backend**: FastAPI + RAG (Qdrant vector DB + Neon Postgres)
- **Content**: 4 modules covering ROS 2, Digital Twin, NVIDIA Isaac, and VLA
- **Features**: Select-text Q&A, grounded responses with citations, free-tier infrastructure

## 📚 Modules

1. **Module 1: The Robotic Nervous System (ROS 2)**
2. **Module 2: Simulated Twins & Embodied Training**
3. **Module 3: NVIDIA Isaac Platform**
4. **Module 4: Vision-Language-Action Models**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ai-physical-book

# Install Node.js dependencies
npm install

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements-dev.txt

# Copy environment template
cp .env.example .env
# Edit .env with your API keys (Qdrant, Neon Postgres)
```

### Local Development

```bash
# Start Docusaurus development server
npm start

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build static site
npm run build

# Serve built site locally
npm run serve
```

## 🏗️ Project Structure

```
.
├── docs/                   # Textbook content (MDX files)
│   ├── intro.md
│   ├── module-01-ros2/
│   ├── module-02-digital-twin/
│   ├── module-03-isaac/
│   └── module-04-vla/
├── src/                    # React components
│   ├── components/
│   │   └── ChatWidget.tsx  # Ask AI feature
│   └── css/
│       └── custom.css
├── static/                 # Static assets
│   └── img/
├── api/                    # RAG backend (FastAPI)
│   ├── main.py
│   ├── embedding.py
│   ├── qdrant_client.py
│   └── rag_pipeline.py
├── tests/                  # Test files
├── .github/workflows/      # CI/CD pipelines
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js            # Sidebar configuration
└── package.json
```

## 🧪 Testing & Validation

```bash
# Lint Markdown/MDX files
npm run lint:md

# Validate code examples (Python)
python scripts/validate_code_examples.py

# Check readability scores
python scripts/check_readability.py

# Run all validations
npm run validate:all
```

## 📖 Content Guidelines

- **Word Count**: 1,500-2,500 words per section
- **Readability**: Flesch-Kincaid Grade 8-12
- **Code Examples**: Minimum 1 per section, all tested
- **Citations**: Minimum 3 authoritative sources per section
- **Diagrams**: Mermaid or SVG, <500KB each

## 🤖 RAG Chatbot

The integrated chatbot provides grounded answers exclusively from textbook content:

1. Select any text in the textbook
2. Click "Ask AI" button
3. Receive answer with section citations

**Features**:
- Context-aware retrieval
- Grounded responses (no hallucinations)
- Citation links to specific sections
- <2s response time

## 🌐 Deployment

### GitHub Pages (Frontend)

```bash
# Deploy to GitHub Pages
npm run deploy
```

### Vercel (RAG Backend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd api
vercel --prod
```

## 📊 Free-Tier Infrastructure

- **GitHub Pages**: Static site hosting
- **Qdrant Cloud**: Vector embeddings (~600KB/1GB limit)
- **Neon Postgres**: Metadata storage (~14MB/512MB limit)
- **Vercel**: Serverless API (<100GB-hours/month)

## 🔗 Links

- [Specification](./specs/master/spec.md)
- [Implementation Plan](./specs/master/plan.md)
- [Task List](./specs/master/tasks.md)
- [Data Model](./specs/master/data-model.md)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for content authoring guidelines and PR templates.

## 📧 Support

For issues and questions, please open a GitHub issue or refer to [quickstart.md](./specs/master/quickstart.md).
