from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth.jwt import get_current_user
from auth.models import User
from ai.schemas import ChatRequest, ChatResponse
from ai.groq_client import get_chat_response, build_user_context

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    context = build_user_context(current_user.id, db)

    conversation = [{"role": m.role, "content": m.content} for m in request.messages]

    reply = get_chat_response(context, conversation)

    return {"reply": reply}