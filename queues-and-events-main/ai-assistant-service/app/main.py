from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="Queues and Events AI Assistant",
    version="1.0.0"
)

app.include_router(health_router)