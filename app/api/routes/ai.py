from fastapi import APIRouter
from pydantic import BaseModel
from app.core.gemini import chat_with_gemini


router = APIRouter(prefix="/ai", tags=["ai"])

class RequestData(BaseModel):
    prompt: str
    option: str

@router.post("/generate", response_model=str)
async def generate(data: RequestData):
    response = chat_with_gemini(data.prompt, data.option)
    return response
