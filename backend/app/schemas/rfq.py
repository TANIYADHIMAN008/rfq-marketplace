from datetime import datetime

from pydantic import BaseModel, Field


# ============================================================
# CREATE RFQ
# ============================================================

class RFQCreate(BaseModel):

    product_name: str = Field(
        min_length=2,
        max_length=200
    )

    description: str = Field(
        min_length=10,
        max_length=5000
    )

    quantity: int = Field(
        gt=0
    )

    delivery_location: str = Field(
        min_length=2,
        max_length=255
    )

    deadline: datetime


# ============================================================
# UPDATE RFQ
# ============================================================

class RFQUpdate(BaseModel):

    product_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=200
    )

    description: str | None = Field(
        default=None,
        min_length=10,
        max_length=5000
    )

    quantity: int | None = Field(
        default=None,
        gt=0
    )

    delivery_location: str | None = Field(
        default=None,
        min_length=2,
        max_length=255
    )

    deadline: datetime | None = None


# ============================================================
# RFQ RESPONSE
# ============================================================

class RFQResponse(BaseModel):

    id: int
    buyer_id: int
    product_name: str
    description: str
    quantity: int
    delivery_location: str
    deadline: datetime
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True