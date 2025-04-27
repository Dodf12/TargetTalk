from fastapi import APIRouter

from .routes import utils, ai

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(ai.router)
