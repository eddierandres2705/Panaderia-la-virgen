from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class CardPaymentInitRequest(BaseModel):
    order_id: str
    customer_email: EmailStr
    customer_name: str
    acceptance_token: str

class PsePaymentInitRequest(BaseModel):
    order_id: str
    customer_email: EmailStr
    customer_name: str
    person_type: str  # "0" = Natural, "1" = Juridica
    document_type: str  # "CC", "NIT", etc
    document_number: str
    bank_code: str
    acceptance_token: str

class PaymentInitResponse(BaseModel):
    checkout_url: Optional[str] = None
    redirect_url: Optional[str] = None
    transaction_id: str

class TransactionStatusResponse(BaseModel):
    transaction_id: str
    order_id: str
    status: str
    amount: int
    currency: str
    payment_method_type: str
