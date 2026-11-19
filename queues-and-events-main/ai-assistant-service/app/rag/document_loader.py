
from pathlib import Path

from langchain_community.document_loaders import TextLoader


# Root directory of the Java microservices project.
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Java microservices to include.
SERVICES = [
    "order-service",
    "customer-service",
    "product-service",
    "inventory-service",
    "payment-service",
    "notification-service",
]


def load_project_documents():
    documents = []

    # 1. Load the main README.
    readme_path = PROJECT_ROOT / "README.md"

    if not readme_path.is_file():
        raise FileNotFoundError(
            f"README not found: {readme_path}"
        )

    loader = TextLoader(
        str(readme_path),
        encoding="utf-8"
    )

    for doc in loader.load():
        doc.metadata["source"] = "README.md"
        doc.metadata["type"] = "documentation"
        documents.append(doc)

    # 2. Load Java source code from each service.
    for service in SERVICES:
        java_directory = (
            PROJECT_ROOT
            / service
            / "src"
            / "main"
            / "java"
        )

        if not java_directory.is_dir():
            raise FileNotFoundError(
                f"Java source directory not found: {java_directory}"
            )

        for file_path in sorted(
            java_directory.rglob("*.java")
        ):
            loader = TextLoader(
                str(file_path),
                encoding="utf-8"
            )

            for doc in loader.load():
                doc.metadata["source"] = (
                    file_path.relative_to(PROJECT_ROOT).as_posix()
                )
                doc.metadata["type"] = "java_source"
                doc.metadata["service"] = service

                documents.append(doc)

    return documents
