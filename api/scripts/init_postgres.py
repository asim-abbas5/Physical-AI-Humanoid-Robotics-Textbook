#!/usr/bin/env python3
"""
Initialize Neon Postgres Database
Creates tables for section metadata, chunks, queries, and responses
"""

import os
import sys
from pathlib import Path
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQL Schema
CREATE_TABLES_SQL = """
-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(100) PRIMARY KEY,
    module_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    position INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    flesch_kincaid_grade DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    CONSTRAINT word_count_range CHECK (word_count BETWEEN 0 AND 10000),
    CONSTRAINT readability_range CHECK (flesch_kincaid_grade IS NULL OR flesch_kincaid_grade BETWEEN 0.0 AND 20.0)
);

CREATE INDEX IF NOT EXISTS idx_sections_module ON sections(module_id);

-- Embedding chunks metadata
CREATE TABLE IF NOT EXISTS embedding_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id VARCHAR(100) NOT NULL,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    start_char_offset INTEGER NOT NULL,
    end_char_offset INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT unique_chunk UNIQUE (section_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_chunks_section ON embedding_chunks(section_id);

-- Chat queries
CREATE TABLE IF NOT EXISTS chat_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100),
    query_text TEXT NOT NULL,
    selected_text TEXT,
    context_section_id VARCHAR(100),
    top_k INTEGER DEFAULT 3,
    timestamp TIMESTAMP DEFAULT NOW(),
    CONSTRAINT query_length CHECK (LENGTH(query_text) >= 10),
    CONSTRAINT topk_range CHECK (top_k BETWEEN 1 AND 10)
);

CREATE INDEX IF NOT EXISTS idx_queries_timestamp ON chat_queries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_queries_user ON chat_queries(user_id);

-- Chat responses
CREATE TABLE IF NOT EXISTS chat_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL,
    response_text TEXT NOT NULL,
    retrieved_chunks JSONB NOT NULL,
    citations JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    generation_time_ms INTEGER,
    timestamp TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_query FOREIGN KEY (query_id) REFERENCES chat_queries(id) ON DELETE CASCADE,
    CONSTRAINT response_time CHECK (generation_time_ms >= 0),
    CONSTRAINT confidence_range CHECK (confidence_score BETWEEN 0.0 AND 1.0)
);

CREATE INDEX IF NOT EXISTS idx_responses_query ON chat_responses(query_id);
"""

async def init_postgres():
    """Initialize Postgres database schema"""

    # Load environment variables
    load_dotenv()

    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        logger.error("DATABASE_URL must be set in .env file")
        sys.exit(1)

    try:
        import asyncpg
    except ImportError:
        logger.error("asyncpg not installed. Run: pip install asyncpg")
        sys.exit(1)

    # Connect to database
    logger.info("Connecting to Neon Postgres...")
    try:
        conn = await asyncpg.connect(database_url)
        logger.info("✅ Connected successfully")
    except Exception as e:
        logger.error(f"Failed to connect: {e}")
        sys.exit(1)

    # Execute schema creation
    try:
        logger.info("Creating database schema...")
        await conn.execute(CREATE_TABLES_SQL)
        logger.info("✅ Schema created successfully")

        # Verify tables
        tables = await conn.fetch("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)

        logger.info("\n📊 Created tables:")
        for table in tables:
            logger.info(f"   - {table['table_name']}")

    except Exception as e:
        logger.error(f"Failed to create schema: {e}")
        sys.exit(1)
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(init_postgres())
