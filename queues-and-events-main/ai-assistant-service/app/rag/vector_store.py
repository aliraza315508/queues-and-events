

from langchain_text_splitters import (
    Language,
    RecursiveCharacterTextSplitter,
)


# Split README documentation using Markdown-aware separators.
README_SPLITTER = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN,
    chunk_size=1000,
    chunk_overlap=150,
)

# Split Java code using Java-aware separators.
JAVA_SPLITTER = RecursiveCharacterTextSplitter.from_language(
    language=Language.JAVA,
    chunk_size=1000,
    chunk_overlap=150,
)


def split_project_documents(documents):
    chunks = []

    for document in documents:

        # Select the splitter based on document type.
        if document.metadata.get("type") == "java_source":
            splitter = JAVA_SPLITTER
        else:
            splitter = README_SPLITTER

        # Split one document into smaller chunks.
        document_chunks = splitter.split_documents([document])

        # Track the position of each chunk in its source.
        for index, chunk in enumerate(document_chunks):
            chunk.metadata["chunk_index"] = index

        chunks.extend(document_chunks)

    return chunks
