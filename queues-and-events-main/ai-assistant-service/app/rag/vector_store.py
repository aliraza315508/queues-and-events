
import asyncio
import os
from functools import lru_cache
from pathlib import Path
from threading import Thread

from dotenv import load_dotenv
from langchain_postgres import PGEngine, PGVectorStore
from sqlalchemy.ext.asyncio import create_async_engine

from app.rag.embeddings import get_embedding_model


# Load environment variables.
SERVICE_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(SERVICE_ROOT / ".env")


# Database configuration.
TABLE_NAME = "project_documents"
VECTOR_DIMENSIONS = 1536


@lru_cache(maxsize=1)
def get_pg_engine() -> PGEngine:

    database_url = os.getenv("AI_DATABASE_URL")

    if not database_url:
        raise ValueError(
            "AI_DATABASE_URL environment variable is missing"
        )

    # Windows requires a compatible event loop for Psycopg.
    if os.name == "nt":

        loop = asyncio.SelectorEventLoop()

        thread = Thread(
            target=loop.run_forever,
            daemon=True,
            name="pgvector-event-loop"
        )

        thread.start()

        async_engine = create_async_engine(database_url)

        return PGEngine.from_engine(
            engine=async_engine,
            loop=loop
        )

    # Default configuration for Linux and other platforms.
    return PGEngine.from_connection_string(
        url=database_url
    )


def initialize_vector_table() -> None:

    engine = get_pg_engine()

    engine.init_vectorstore_table(
        table_name=TABLE_NAME,
        vector_size=VECTOR_DIMENSIONS
    )


def get_vector_store() -> PGVectorStore:

    engine = get_pg_engine()

    embeddings = get_embedding_model()

    return PGVectorStore.create_sync(
        engine=engine,
        table_name=TABLE_NAME,
        embedding_service=embeddings
    )
