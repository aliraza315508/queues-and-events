
from fastapi import APIRouter, HTTPException
from openai import OpenAIError

# Import DTOs
from app.schemas.chat import ChatRequest, ChatResponse

# Import service function
from app.services.chat_service import generate_chat_response


# Create router
router = APIRouter()


@router.post("/ai/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        # Call service layer
        answer = generate_chat_response(request.message)

        # Return response DTO
        return ChatResponse(answer=answer)

    except OpenAIError:
        raise HTTPException(
            status_code=502,
            detail="AI service is currently unavailable"
        )
