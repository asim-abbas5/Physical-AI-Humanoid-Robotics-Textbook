# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

**Purpose**: Get the development environment set up and validate the system works end-to-end.

**Time to complete**: ~30-45 minutes

---

## Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.10+
- **Git**
- **GitHub account** (for GitHub Pages deployment)
- **Free-tier accounts**: Qdrant Cloud, Neon Postgres (setup in Phase 2)

---

## Phase 1: Initial Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/ai-physical-book.git
cd ai-physical-book

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install
```

### 2. Verify Installation

```bash
# Check Node.js version
node --version  # Should be 20.x or higher

# Check Python version
python --version  # Should be 3.10 or higher

# Verify Docusaurus
npx docusaurus --version

# Verify sentence-transformers
python -c "from sentence_transformers import SentenceTransformer; print('OK')"
```

---

## Phase 2: Docusaurus Setup

### 1. Initialize Docusaurus Project

```bash
# Create Docusaurus site (if not already initialized)
npx create-docusaurus@latest . classic --typescript

# Install additional plugins
npm install --save @docusaurus/plugin-ideal-image
```

### 2. Configure Docusaurus

Edit `docusaurus.config.js`:

```javascript
// Update these fields
url: 'https://your-username.github.io',
baseUrl: '/ai-physical-book/',
organizationName: 'your-username',
projectName: 'ai-physical-book',
```

### 3. Create Sample Content

```bash
# Create module structure
mkdir -p docs/module-01-ros2
mkdir -p docs/module-02-digital-twin
mkdir -p docs/module-03-isaac
mkdir -p docs/module-04-vla

# Create category metadata
cat > docs/module-01-ros2/_category_.json <<EOF
{
  "label": "Module 1: ROS 2",
  "position": 1,
  "collapsed": false
}
EOF

# Create sample section
cat > docs/module-01-ros2/index.mdx <<EOF
---
title: "Module 1: The Robotic Nervous System (ROS 2)"
---

# Module 1: The Robotic Nervous System (ROS 2)

This module introduces ROS 2 fundamentals for robotics development.

## Topics Covered

- ROS 2 nodes, topics, services, and actions
- Building control pipelines using rclpy
- Connecting Python agents to ROS controllers
- Creating URDF models for humanoid robots
EOF
```

### 4. Test Local Development Server

```bash
npm start

# Open browser to http://localhost:3000
# You should see the Docusaurus site with Module 1 in the sidebar
```

### 5. Build for Production

```bash
npm run build

# Verify build succeeded (output in build/ directory)
ls build/
```

---

## Phase 3: Linting & Validation Setup

### 1. Install Linting Tools

```bash
# Node.js linters
npm install --save-dev \
  eslint \
  eslint-plugin-mdx \
  @mdx-js/eslint \
  markdownlint-cli2 \
  prettier

# Python linters
pip install black pylint textstat
```

### 2. Create Configuration Files

**`.markdownlint-cli2.jsonc`**:
```jsonc
{
  "config": {
    "default": true,
    "MD013": false,
    "MD033": {
      "allowed_elements": ["details", "summary", "Tabs", "TabItem"]
    }
  }
}
```

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**`pyproject.toml`**:
```toml
[tool.black]
line-length = 88
target-version = ['py310']
```

### 3. Test Linting

```bash
# Lint MDX files
npx markdownlint-cli2 "docs/**/*.mdx"

# Format code
npx prettier --write "**/*.{js,jsx,ts,tsx,json}"
python -m black scripts/

# Run validation scripts
node scripts/validate-mdx.mjs
python scripts/validate_code_examples.py
python scripts/check_readability.py
```

---

## Phase 4: RAG Backend Setup

### 1. Set Up Free-Tier Services

**Qdrant Cloud**:
1. Sign up at https://cloud.qdrant.io
2. Create a free cluster
3. Copy API key and cluster URL

**Neon Postgres**:
1. Sign up at https://neon.tech
2. Create a free project
3. Copy connection string

### 2. Configure Environment

Create `.env` file:

```bash
# Qdrant
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-api-key

# Neon Postgres
DATABASE_URL=postgresql://user:pass@host/dbname

# Embedding model
EMBEDDING_MODEL=all-MiniLM-L6-v2

# API settings
API_PORT=8000
API_HOST=0.0.0.0
```

### 3. Initialize Databases

```bash
# Create Qdrant collection
python backend/src/scripts/init_qdrant.py

# Create Neon Postgres tables
python backend/src/scripts/init_postgres.py
```

### 4. Ingest Sample Content

```bash
# Generate embeddings for existing docs
python backend/src/scripts/ingest_content.py --source docs/

# Verify ingestion
python -c "
from qdrant_client import QdrantClient
client = QdrantClient(url='your-url', api_key='your-key')
print(f'Chunks: {client.count(collection_name=\"textbook_chunks\")}')
"
```

### 5. Start RAG API

```bash
# Install FastAPI dependencies
cd backend
pip install -r requirements.txt

# Start server
uvicorn src.api.main:app --reload --port 8000

# Test health endpoint
curl http://localhost:8000/v1/health

# Test query endpoint
curl -X POST http://localhost:8000/v1/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```

---

## Phase 5: GitHub Actions Setup

### 1. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Save

### 2. Create Workflow Files

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

### 3. Push and Deploy

```bash
git add .
git commit -m "feat: initial textbook setup"
git push origin main

# Monitor workflow at https://github.com/your-username/ai-physical-book/actions
```

### 4. Verify Deployment

Visit: `https://your-username.github.io/ai-physical-book/`

---

## Verification Checklist

- [ ] Docusaurus runs locally (`npm start`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Python tests pass (`python scripts/validate_code_examples.py`)
- [ ] Readability check works (`python scripts/check_readability.py`)
- [ ] Qdrant connection works
- [ ] Neon Postgres connection works
- [ ] RAG API health check returns 200
- [ ] RAG query returns valid response
- [ ] GitHub Pages deployment succeeds
- [ ] Site loads correctly at deployed URL

---

## Troubleshooting

### Docusaurus build fails

```bash
# Clear cache and rebuild
rm -rf .docusaurus node_modules
npm install
npm run build
```

### Python import errors

```bash
# Reinstall in clean environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements-dev.txt
```

### Qdrant connection timeout

- Verify API key and cluster URL in `.env`
- Check network connectivity
- Ensure cluster is running (check Qdrant Cloud dashboard)

### GitHub Pages 404 errors

- Verify `baseUrl` in `docusaurus.config.js` matches repository name
- Check `CNAME` file if using custom domain
- Wait 2-3 minutes for deployment propagation

---

## Next Steps

1. **Write Content**: Follow the constitution guidelines to create module content
2. **Run Validation**: Use `npm run validate:all` before committing
3. **Generate Tasks**: Run `/sp.tasks` to create implementation tasks
4. **Implement RAG Backend**: Build FastAPI endpoints per `contracts/rag-api.yaml`
5. **Deploy RAG Backend**: Use free-tier services (Railway, Render, Fly.io)

---

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [sentence-transformers Guide](https://www.sbert.net/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Neon Postgres Docs](https://neon.tech/docs)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

---

**Quickstart Status**: Ready for implementation - proceed to `/sp.tasks` for task generation
