from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.order import OrderCreate, OrderResponse, OrderStatusUpdate
from utils.auth import get_admin_user
import db
# db.orders_collection

router = APIRouter(prefix="/orders", tags=["orders"])

def generate_order_number() -> str:
    """Generate unique order number"""
    now = datetime.utcnow()
    return f"ORD-{now.strftime('%Y%m%d')}-{now.strftime('%H%M%S')}"

def order_doc_to_response(doc: dict) -> OrderResponse:
    return OrderResponse(
        id=str(doc["_id"]),
        order_number=doc["order_number"],
        customer=doc["customer"],
        items=doc["items"],
        subtotal=doc["subtotal"],
        total=doc["total"],
        currency=doc.get("currency", "COP"),
        status=doc["status"],
        payment_method=doc.get("payment_method"),
        delivery_type=doc["delivery_type"],
        delivery_date=doc.get("delivery_date"),
        notes=doc.get("notes"),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"]
    )

@router.post("", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    # Calculate totals
    subtotal = sum(item.subtotal for item in order.items)
    total = subtotal  # Can add delivery fee, taxes, etc.
    
    order_dict = order.dict()
    order_dict["order_number"] = generate_order_number()
    order_dict["subtotal"] = subtotal
    order_dict["total"] = total
    order_dict["currency"] = "COP"
    order_dict["status"] = "pending_payment"
    order_dict["created_at"] = datetime.utcnow()
    order_dict["updated_at"] = datetime.utcnow()
    
    result = await db.orders_collection.insert_one(order_dict)
    order_dict["_id"] = result.inserted_id
    
    return order_doc_to_response(order_dict)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    order = await db.orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_doc_to_response(order)

@router.get("", response_model=List[OrderResponse])
async def list_orders(
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_admin_user)
):
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders_collection.find(query).sort("created_at", -1).to_list(1000)
    return [order_doc_to_response(o) for o in orders]

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: dict = Depends(get_admin_user)
):
    result = await db.orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "status": status_update.status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_order = await db.orders_collection.find_one({"_id": ObjectId(order_id)})
    return order_doc_to_response(updated_order)
