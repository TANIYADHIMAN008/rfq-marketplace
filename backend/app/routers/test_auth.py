from fastapi import APIRouter, Depends

from app.dependencies import (
    get_current_user,
    require_buyer,
    require_supplier,
)
from app.models.user import User


router = APIRouter(
    prefix="/test",
    tags=["Authorization Test"]
)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "You are authenticated",
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.get("/buyer-only")
def buyer_only(
    current_user: User = Depends(require_buyer)
):
    return {
        "message": "You have buyer access",
        "user": current_user.name,
        "role": current_user.role
    }


@router.get("/supplier-only")
def supplier_only(
    current_user: User = Depends(require_supplier)
):
    return {
        "message": "You have supplier access",
        "user": current_user.name,
        "role": current_user.role
    }