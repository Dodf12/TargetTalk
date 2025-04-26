from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])

class RequestData(BaseModel):
    prompt: str

@router.post("/response/", response_model=str)
async def response(data: RequestData):
    return True
