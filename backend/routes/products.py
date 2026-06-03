from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.product import ProductCreate, ProductUpdate, ProductResponse
from utils.auth import get_admin_user
import db
# db.products_collection

router = APIRouter(prefix="/products", tags=["products"])

def product_doc_to_response(doc: dict) -> ProductResponse:
    return ProductResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc["description"],
        category=doc["category"],
        price=doc["price"],
        image_url=doc["image_url"],
        available=doc.get("available", True),
        featured=doc.get("featured", False),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"]
    )

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None),
    available: Optional[bool] = Query(None),
    featured: Optional[bool] = Query(None)
):
    query = {}
    if category:
        query["category"] = category
    if available is not None:
        query["available"] = available
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products_collection.find(query).to_list(1000)
    return [product_doc_to_response(p) for p in products]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_doc_to_response(product)

@router.post("", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(get_admin_user)
):
    product_dict = product.dict()
    product_dict["created_at"] = datetime.utcnow()
    product_dict["updated_at"] = datetime.utcnow()
    
    result = await db.products_collection.insert_one(product_dict)
    product_dict["_id"] = result.inserted_id
    
    return product_doc_to_response(product_dict)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: dict = Depends(get_admin_user)
):
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products_collection.find_one({"_id": ObjectId(product_id)})
    return product_doc_to_response(updated_product)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_admin_user)
):
    result = await db.products_collection.delete_one({"_id": ObjectId(product_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}
