from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Import models
from app.models.user import User
from app.models.rfq import RFQ
from app.models.quotation import Quotation

# Import routers
from app.routers.auth import router as auth_router
from app.routers.rfqs import router as rfq_router
from app.routers.quotations import router as quotation_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="RFQ Marketplace API",
    description="B2B Request for Quotation Marketplace API",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(rfq_router)
app.include_router(quotation_router)


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "RFQ Marketplace API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }