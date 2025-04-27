from fastapi import APIRouter
from pydantic import BaseModel
from app.core.gemini import chat_with_gemini
from app.core.db import save_audience, get_top_audiences


router = APIRouter(prefix="/ai", tags=["ai"])

class RequestData(BaseModel):
    prompt: str
    option: str

@router.post("/generate")
async def generate(data: RequestData):
    response = chat_with_gemini(data.prompt, data.option)
    save_audience(data.option)
    top_audiences = get_top_audiences(limit=3)
    
    return {
        "response": response,
        "top_audiences": top_audiences
    }
