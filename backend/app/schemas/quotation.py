from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class QuotationCreate(BaseModel):

    quoted_price: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2
    )

    estimated_delivery_time: int = Field(
        gt=0,
        description="Estimated delivery time in days"
    )

    message: str | None = Field(
        default=None,
        max_length=2000
    )


class QuotationResponse(BaseModel):

    id: int
    rfq_id: int
    supplier_id: int
    quoted_price: Decimal
    estimated_delivery_time: int
    message: str | None

    status: str

    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True