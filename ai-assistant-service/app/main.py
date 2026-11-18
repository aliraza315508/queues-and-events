from fastapi import FastAPI

app = FastAPI(
    title="Queues and Events AI Assistant",
    version="1.0.0"
)


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "ai-assistant-service"
    }