from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import server_api
import os
from config import get_settings

client: AsyncIOMotorClient = None
db = None

# Collections
users_collection = None
products_collection = None
orders_collection = None
transactions_collection = None
reviews_collection = None
gallery_collection = None

async def init_mongo():
    global client, db
    global users_collection, products_collection, orders_collection
    global transactions_collection, reviews_collection, gallery_collection
    
    settings = get_settings()
    mongodb_url = settings.mongodb_url or os.environ.get('MONGO_URL')
    
    client = AsyncIOMotorClient(
        mongodb_url,
        server_api=server_api.ServerApi(
            version="1",
            strict=True,
            deprecation_errors=True,
        ),
    )
    
    db = client.get_database(settings.db_name)
    
    # Initialize collections
    users_collection = db.get_collection("users")
    products_collection = db.get_collection("products")
    orders_collection = db.get_collection("orders")
    transactions_collection = db.get_collection("transactions")
    reviews_collection = db.get_collection("reviews")
    gallery_collection = db.get_collection("gallery")
    
    # Create indexes
    await users_collection.create_index("username", unique=True)
    await orders_collection.create_index("order_number", unique=True)
    await transactions_collection.create_index("idempotency_key", unique=True)
    await transactions_collection.create_index("provider_transaction_id")
    
    print("✅ MongoDB connected and collections initialized")

async def close_mongo():
    if client:
        client.close()
        print("✅ MongoDB connection closed")
