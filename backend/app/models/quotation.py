from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    String,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    rfq_id = Column(
        Integer,
        ForeignKey("rfqs.id"),
        nullable=False
    )

    supplier_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    quoted_price = Column(
        Numeric(12, 2),
        nullable=False
    )

    estimated_delivery_time = Column(
        Integer,
        nullable=False
    )

    message = Column(
        Text,
        nullable=True
    )

    # NEW: quotation status
    status = Column(
        String(20),
        nullable=False,
        default="Pending",
        server_default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    rfq = relationship(
        "RFQ",
        back_populates="quotations"
    )

    supplier = relationship(
        "User",
        back_populates="quotations"
    )