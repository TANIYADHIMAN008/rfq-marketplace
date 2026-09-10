from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_buyer, require_supplier
from app.models.quotation import Quotation
from app.models.rfq import RFQ
from app.models.user import User
from app.schemas.quotation import QuotationCreate, QuotationResponse


router = APIRouter(
    prefix="/quotations",
    tags=["Quotations"]
)


# ---------------------------------------------------------
# SUPPLIER - SUBMIT QUOTATION
# ---------------------------------------------------------
@router.post(
    "/rfq/{rfq_id}",
    response_model=QuotationResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_quotation(
    rfq_id: int,
    quotation_data: QuotationCreate,
    current_user: User = Depends(require_supplier),
    db: Session = Depends(get_db)
):
    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    if rfq.deadline < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="This RFQ deadline has passed"
        )

    existing = db.query(Quotation).filter(
        Quotation.rfq_id == rfq_id,
        Quotation.supplier_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted a quotation for this RFQ"
        )

    quotation = Quotation(
        rfq_id=rfq_id,
        supplier_id=current_user.id,
        quoted_price=quotation_data.quoted_price,
        estimated_delivery_time=quotation_data.estimated_delivery_time,
        message=quotation_data.message,
        status="Pending"
    )

    db.add(quotation)
    db.commit()
    db.refresh(quotation)

    return quotation


# ---------------------------------------------------------
# SUPPLIER - MY QUOTATIONS
# ---------------------------------------------------------
@router.get(
    "/my",
    response_model=list[QuotationResponse]
)
def get_my_quotations(
    current_user: User = Depends(require_supplier),
    db: Session = Depends(get_db)
):
    return (
        db.query(Quotation)
        .filter(
            Quotation.supplier_id == current_user.id
        )
        .order_by(
            Quotation.created_at.desc()
        )
        .all()
    )


# ---------------------------------------------------------
# BUYER - VIEW QUOTATIONS FOR MY RFQ
# ---------------------------------------------------------
@router.get(
    "/rfq/{rfq_id}",
    response_model=list[QuotationResponse]
)
def get_rfq_quotations(
    rfq_id: int,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id,
        RFQ.buyer_id == current_user.id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    quotations = (
        db.query(Quotation)
        .filter(
            Quotation.rfq_id == rfq_id
        )
        .order_by(
            Quotation.quoted_price.asc()
        )
        .all()
    )

    return quotations


# ---------------------------------------------------------
# BUYER - ACCEPT QUOTATION
# ---------------------------------------------------------
@router.patch(
    "/{quotation_id}/accept",
    response_model=QuotationResponse
)
def accept_quotation(
    quotation_id: int,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db)
):
    quotation = (
        db.query(Quotation)
        .filter(
            Quotation.id == quotation_id
        )
        .first()
    )

    if not quotation:
        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    # Check that this quotation belongs to an RFQ
    # created by the logged-in buyer.
    rfq = (
        db.query(RFQ)
        .filter(
            RFQ.id == quotation.rfq_id,
            RFQ.buyer_id == current_user.id
        )
        .first()
    )

    if not rfq:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to accept this quotation"
        )

    # Mark all quotations for this RFQ as Pending.
    db.query(Quotation).filter(
        Quotation.rfq_id == quotation.rfq_id
    ).update(
        {
            Quotation.status: "Pending"
        },
        synchronize_session=False
    )

    # Mark selected quotation as Accepted.
    quotation.status = "Accepted"

    db.commit()
    db.refresh(quotation)

    return quotation