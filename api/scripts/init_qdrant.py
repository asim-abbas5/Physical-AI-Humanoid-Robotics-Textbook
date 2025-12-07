#!/usr/bin/env python3
"""
Initialize Qdrant Collection
Creates the textbook_chunks collection with appropriate configuration
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_qdrant():
    """Initialize Qdrant collection for textbook chunks"""

    # Load environment variables
    load_dotenv()

    url = os.getenv("QDRANT_URL")
    api_key = os.getenv("QDRANT_API_KEY")

    if not url or not api_key:
        logger.error("QDRANT_URL and QDRANT_API_KEY must be set in .env file")
        sys.exit(1)

    # Connect to Qdrant
    logger.info(f"Connecting to Qdrant at {url}")
    client = QdrantClient(url=url, api_key=api_key)

    collection_name = "textbook_chunks"

    # Check if collection exists
    collections = client.get_collections().collections
    exists = any(c.name == collection_name for c in collections)

    if exists:
        logger.warning(f"Collection '{collection_name}' already exists")
        response = input("Delete and recreate? (y/N): ")
        if response.lower() == 'y':
            client.delete_collection(collection_name)
            logger.info(f"Deleted existing collection")
        else:
            logger.info("Keeping existing collection")
            sys.exit(0)

    # Create collection
    logger.info(f"Creating collection '{collection_name}'")
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=384,  # all-MiniLM-L6-v2 embedding dimension
            distance=Distance.COSINE
        )
    )

    logger.info("✅ Qdrant collection created successfully!")
    logger.info(f"   Collection name: {collection_name}")
    logger.info(f"   Vector size: 384")
    logger.info(f"   Distance metric: COSINE")

    # Verify creation
    collection_info = client.get_collection(collection_name)
    logger.info(f"   Status: {collection_info.status}")

if __name__ == "__main__":
    init_qdrant()
