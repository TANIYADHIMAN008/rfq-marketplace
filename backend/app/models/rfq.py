from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    buyer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    product_name = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    delivery_location = Column(
        String(255),
        nullable=False
    )

    deadline = Column(
        DateTime,
        nullable=False
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

    buyer = relationship(
        "User",
        back_populates="rfqs"
    )

    quotations = relationship(
        "Quotation",
        back_populates="rfq",
        cascade="all, delete-orphan"
    )