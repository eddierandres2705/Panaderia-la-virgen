from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta, datetime
from bson import ObjectId

from models.user import UserLogin, TokenResponse, UserResponse
from utils.auth import verify_password, create_access_token, get_password_hash
import db
from config import get_settings

router = APIRouter(prefix="/auth", tags=["authentication"])
settings = get_settings()

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users_collection.find_one({"username": credentials.username})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=timedelta(seconds=settings.jwt_expiration)
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(username=user["username"], role=user["role"])
    )

@router.post("/seed-admin")
async def seed_admin():
    """Create default admin user if not exists"""
    existing = await db.users_collection.find_one({"username": "Admin"})
    
    if existing:
        return {"message": "Admin user already exists"}
    
    admin_user = {
        "username": "Admin",
        "password_hash": get_password_hash("Aslandavid2705"),
        "role": "admin",
        "created_at": datetime.utcnow(),
        "last_login": None
    }
    
    await db.users_collection.insert_one(admin_user)
    return {"message": "Admin user created successfully"}
