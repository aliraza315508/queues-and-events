
from uuid import NAMESPACE_URL, uuid5

from app.rag.document_loader import load_project_documents
from app.rag.text_splitter import split_project_documents
from app.rag.vector_store import get_vector_store


# Number of chunks processed in each batch.
BATCH_SIZE = 20


def build_chunk_id(chunk) -> str:

    # Identify the source file and chunk position.
    source = chunk.metadata.get("source")
    chunk_index = chunk.metadata.get("chunk_index")

    if source is None or chunk_index is None:
        raise ValueError(
            "Each chunk must have source and chunk_index metadata."
        )

    # Generate the same UUID for the same source and position.
    return str(
        uuid5(
            NAMESPACE_URL,
            f"queues-and-events/{source}/{chunk_index}"
        )
    )


def ingest_project_documents() -> int:

    # Step 1: Load the project documents.
    documents = load_project_documents()

    print(f"Documents loaded: {len(documents)}")

    # Step 2: Split documents into chunks.
    chunks = split_project_documents(documents)

    if not chunks:
        raise ValueError("No document chunks were generated.")

    print(f"Chunks generated: {len(chunks)}")

    # Step 3: Connect to PostgreSQL vector store.
    vector_store = get_vector_store()

    added_or_updated = 0
    unchanged = 0

    # Step 4: Process chunks in batches.
    for start in range(0, len(chunks), BATCH_SIZE):

        batch = chunks[start:start + BATCH_SIZE]

        # Generate stable UUIDs.
        ids = [build_chunk_id(chunk) for chunk in batch]

        # Find chunks already stored in PostgreSQL.
        existing_documents = vector_store.get_by_ids(ids)

        existing_by_id = {
            document.id: document
            for document in existing_documents
        }

        documents_to_save = []
        ids_to_save = []

        # Only save new or modified chunks.
        for chunk, chunk_id in zip(batch, ids):

            existing = existing_by_id.get(chunk_id)

            if (
                existing is not None
                and existing.page_content == chunk.page_content
                and existing.metadata == chunk.metadata
            ):
                unchanged += 1
                continue

            documents_to_save.append(chunk)
            ids_to_save.append(chunk_id)

        # Step 5: Generate embeddings and save documents.
        if documents_to_save:

            vector_store.add_documents(
                documents=documents_to_save,
                ids=ids_to_save
            )

            added_or_updated += len(documents_to_save)

        print(
            f"Processed {min(start + BATCH_SIZE, len(chunks))}"
            f"/{len(chunks)} chunks"
        )

    print(f"New or updated chunks: {added_or_updated}")
    print(f"Unchanged chunks: {unchanged}")

    return added_or_updated


# Run ingestion when this file is executed as a module.
if __name__ == "__main__":
    ingest_project_documents()
