from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import config and db
from config import get_settings
from db import init_mongo, close_mongo

# Import routes
from routes import auth, products, orders, payments, webhooks, seed

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

settings = get_settings()

# Create the main app
app = FastAPI(
    title="Panadería de la Virgen API",
    description="E-commerce API with Wompi payments integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API router
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Panadería de la Virgen API",
        "version": "1.0.0",
        "status": "running"
    }

# Health check
@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(webhooks.router)
api_router.include_router(seed.router)

# Include API router in main app
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    await init_mongo()
    logging.info("✅ Application started successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo()
    logging.info("✅ Application shutdown complete")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
