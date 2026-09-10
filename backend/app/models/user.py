from datetime import datetime
from enum import Enum

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, Enum):
    BUYER = "buyer"
    SUPPLIER = "supplier"


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        SQLAlchemyEnum(UserRole),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    rfqs = relationship(
        "RFQ",
        back_populates="buyer",
        cascade="all, delete-orphan"
    )

    quotations = relationship(
        "Quotation",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )