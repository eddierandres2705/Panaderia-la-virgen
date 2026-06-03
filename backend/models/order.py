from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class OrderCustomer(BaseModel):
    name: str
    email: EmailStr
    phone: str
    document_type: Optional[str] = None
    document_number: Optional[str] = None

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: int
    subtotal: int

class OrderCreate(BaseModel):
    customer: OrderCustomer
    items: List[OrderItem]
    delivery_type: str  # "pickup" or "delivery"
    delivery_date: Optional[datetime] = None
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer: OrderCustomer
    items: List[OrderItem]
    subtotal: int
    total: int
    currency: str = "COP"
    status: str
    payment_method: Optional[str] = None
    delivery_type: str
    delivery_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str  # "processing", "completed", "cancelled"
