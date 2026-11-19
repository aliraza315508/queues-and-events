
from pathlib import Path

from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings


# Load environment variables from the service root.
SERVICE_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(SERVICE_ROOT / ".env")


def get_embedding_model() -> OpenAIEmbeddings:

    # Create the OpenAI embedding model.
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )

    return embeddings
