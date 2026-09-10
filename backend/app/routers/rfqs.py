from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import (
    get_current_user,
    require_buyer,
    require_supplier,
)
from app.models.rfq import RFQ
from app.models.user import User
from app.schemas.rfq import RFQCreate, RFQResponse, RFQUpdate


router = APIRouter(
    prefix="/rfqs",
    tags=["RFQs"]
)


# ============================================================
# CREATE RFQ - BUYER
# ============================================================

@router.post(
    "",
    response_model=RFQResponse,
    status_code=status.HTTP_201_CREATED
)
def create_rfq(
    rfq_data: RFQCreate,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    new_rfq = RFQ(
        buyer_id=current_user.id,
        product_name=rfq_data.product_name,
        description=rfq_data.description,
        quantity=rfq_data.quantity,
        delivery_location=rfq_data.delivery_location,
        deadline=rfq_data.deadline
    )

    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)

    return new_rfq


# ============================================================
# BROWSE RFQs - SUPPLIER
# ============================================================

@router.get(
    "",
    response_model=list[RFQResponse]
)
def browse_rfqs(
    search: str | None = Query(default=None),
    location: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_supplier)
):
    query = db.query(RFQ)

    if search:
        query = query.filter(
            RFQ.product_name.ilike(f"%{search}%")
        )

    if location:
        query = query.filter(
            RFQ.delivery_location.ilike(f"%{location}%")
        )

    rfqs = (
        query
        .order_by(RFQ.created_at.desc())
        .all()
    )

    return rfqs


# ============================================================
# MY RFQs - BUYER
# ============================================================

@router.get(
    "/my",
    response_model=list[RFQResponse]
)
def get_my_rfqs(
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    rfqs = (
        db.query(RFQ)
        .filter(RFQ.buyer_id == current_user.id)
        .order_by(RFQ.created_at.desc())
        .all()
    )

    return rfqs


# ============================================================
# GET SINGLE RFQ - BUYER OR SUPPLIER
# ============================================================

@router.get(
    "/{rfq_id}",
    response_model=RFQResponse
)
def get_rfq(
    rfq_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rfq = (
        db.query(RFQ)
        .filter(RFQ.id == rfq_id)
        .first()
    )

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    return rfq


# ============================================================
# UPDATE RFQ - BUYER
# ============================================================

@router.put(
    "/{rfq_id}",
    response_model=RFQResponse
)
def update_rfq(
    rfq_id: int,
    rfq_data: RFQUpdate,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    rfq = (
        db.query(RFQ)
        .filter(
            RFQ.id == rfq_id,
            RFQ.buyer_id == current_user.id
        )
        .first()
    )

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    update_data = rfq_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(rfq, field, value)

    db.commit()
    db.refresh(rfq)

    return rfq


# ============================================================
# DELETE RFQ - BUYER
# ============================================================

@router.delete(
    "/{rfq_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_rfq(
    rfq_id: int,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    rfq = (
        db.query(RFQ)
        .filter(
            RFQ.id == rfq_id,
            RFQ.buyer_id == current_user.id
        )
        .first()
    )

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    db.delete(rfq)
    db.commit()

    return None