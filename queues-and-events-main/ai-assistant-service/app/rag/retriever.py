
from langchain_core.documents import Document

from app.rag.vector_store import get_vector_store


# Maximum number of relevant chunks to retrieve.
TOP_K = 4


def get_project_retriever():

    # Step 1: Connect to the existing PostgreSQL vector store.
    vector_store = get_vector_store()

    # Step 2: Create a LangChain retriever.
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": TOP_K}
    )

    return retriever


def retrieve_project_documents(question: str) -> list[Document]:

    # Step 3: Validate the administrator's question.
    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    # Step 4: Obtain the retriever.
    retriever = get_project_retriever()

    # Step 5: Find the most relevant document chunks.
    documents = retriever.invoke(question.strip())

    return documents


# Test semantic retrieval directly.
if __name__ == "__main__":

    question = "What happens when payment fails for an order?"

    documents = retrieve_project_documents(question)

    print(f"\nQuestion: {question}")
    print(f"Documents retrieved: {len(documents)}")

    for index, document in enumerate(documents, start=1):

        print(f"\n--- Result {index} ---")

        print(
            f"Source: {document.metadata.get('source')}"
        )

        print(
            f"Chunk: {document.metadata.get('chunk_index')}"
        )

        print("Content:")
        print(document.page_content[:1000])
