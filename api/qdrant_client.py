"""
Qdrant Client Service
Manages vector database operations for RAG retrieval
"""

import logging
from typing import List, Dict, Optional
import os
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class RetrievedChunk:
    """Chunk retrieved from vector search"""
    chunk_id: str
    section_id: str
    module_id: str
    text: str
    similarity_score: float
    rank: int
    metadata: Dict

class QdrantService:
    """
    Service for Qdrant vector database operations
    Handles chunk storage and retrieval for RAG
    """

    def __init__(
        self,
        url: Optional[str] = None,
        api_key: Optional[str] = None,
        collection_name: str = "textbook_chunks"
    ):
        """
        Initialize Qdrant client

        Args:
            url: Qdrant cluster URL (from QDRANT_URL env var if not provided)
            api_key: Qdrant API key (from QDRANT_API_KEY env var if not provided)
            collection_name: Name of vector collection
        """
        self.url = url or os.getenv("QDRANT_URL")
        self.api_key = api_key or os.getenv("QDRANT_API_KEY")
        self.collection_name = collection_name
        self.client = None

        if not self.url or not self.api_key:
            logger.warning("Qdrant credentials not configured. Set QDRANT_URL and QDRANT_API_KEY")
        else:
            self._connect()

    def _connect(self):
        """Establish connection to Qdrant"""
        try:
            from qdrant_client import QdrantClient
            logger.info(f"Connecting to Qdrant at {self.url}")
            self.client = QdrantClient(url=self.url, api_key=self.api_key)
            logger.info("Qdrant connection established")
        except ImportError:
            logger.error("qdrant-client not installed. Run: pip install qdrant-client")
            raise
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            raise

    def search(
        self,
        query_vector: List[float],
        top_k: int = 3,
        score_threshold: float = 0.0
    ) -> List[RetrievedChunk]:
        """
        Search for similar chunks

        Args:
            query_vector: Query embedding (384-dim)
            top_k: Number of results to return
            score_threshold: Minimum similarity score

        Returns:
            List of retrieved chunks sorted by similarity
        """
        if not self.client:
            logger.error("Qdrant client not initialized")
            return []

        try:
            from qdrant_client.models import SearchRequest

            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k,
                score_threshold=score_threshold
            )

            chunks = []
            for rank, hit in enumerate(results, start=1):
                chunk = RetrievedChunk(
                    chunk_id=str(hit.id),
                    section_id=hit.payload.get("section_id", ""),
                    module_id=hit.payload.get("module_id", ""),
                    text=hit.payload.get("text", ""),
                    similarity_score=float(hit.score),
                    rank=rank,
                    metadata=hit.payload
                )
                chunks.append(chunk)

            logger.info(f"Retrieved {len(chunks)} chunks")
            return chunks

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []

    def upsert_chunks(self, chunks: List[Dict]) -> bool:
        """
        Insert or update chunks in Qdrant

        Args:
            chunks: List of chunk dictionaries with id, vector, payload

        Returns:
            True if successful
        """
        if not self.client:
            logger.error("Qdrant client not initialized")
            return False

        try:
            from qdrant_client.models import PointStruct

            points = [
                PointStruct(
                    id=chunk["id"],
                    vector=chunk["vector"],
                    payload=chunk["payload"]
                )
                for chunk in chunks
            ]

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            logger.info(f"Upserted {len(chunks)} chunks to Qdrant")
            return True

        except Exception as e:
            logger.error(f"Upsert failed: {e}")
            return False

# Singleton instance
_qdrant_service = None

def get_qdrant_service() -> QdrantService:
    """Get or create Qdrant service singleton"""
    global _qdrant_service
    if _qdrant_service is None:
        _qdrant_service = QdrantService()
    return _qdrant_service
