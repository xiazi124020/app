from fastapi import APIRouter
from . import user, dept

api_router = APIRouter()

api_router.include_router(user.router, prefix="/user", tags=["社員管理"])
api_router.include_router(dept.router, prefix="/dept", tags=["部門管理"])


