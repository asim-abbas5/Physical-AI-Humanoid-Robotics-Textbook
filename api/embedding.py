"""
Embedding Service
Generates vector embeddings using sentence-transformers
"""

import logging
from typing import List
import numpy as np

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Lightweight embedding service using all-MiniLM-L6-v2
    384-dimensional embeddings optimized for semantic similarity
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize embedding model

        Args:
            model_name: HuggingFace model name (default: all-MiniLM-L6-v2)
        """
        self.model_name = model_name
        self.model = None
        self._load_model()

    def _load_model(self):
        """Load sentence transformer model"""
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Model loaded successfully. Embedding dimension: {self.model.get_sentence_embedding_dimension()}")
        except ImportError:
            logger.error("sentence-transformers not installed. Run: pip install sentence-transformers")
            raise
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def encode(self, texts: List[str], batch_size: int = 32) -> np.ndarray:
        """
        Generate embeddings for text inputs

        Args:
            texts: List of text strings to embed
            batch_size: Batch size for encoding

        Returns:
            numpy array of shape (len(texts), 384)
        """
        if not self.model:
            raise RuntimeError("Model not loaded")

        logger.info(f"Encoding {len(texts)} texts...")
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=False,
            convert_to_numpy=True
        )
        logger.info(f"Encoding complete. Shape: {embeddings.shape}")

        return embeddings

    def encode_single(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single text

        Args:
            text: Input text

        Returns:
            numpy array of shape (384,)
        """
        return self.encode([text])[0]

# Singleton instance
_embedding_service = None

def get_embedding_service(model_name: str = "all-MiniLM-L6-v2") -> EmbeddingService:
    """
    Get or create embedding service singleton

    Args:
        model_name: Model to load

    Returns:
        EmbeddingService instance
    """
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService(model_name)
    return _embedding_service
