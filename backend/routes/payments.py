from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from models.transaction import (
    CardPaymentInitRequest,
    PsePaymentInitRequest,
    PaymentInitResponse,
    TransactionStatusResponse
)
from utils.wompi import wompi_client
from db import orders_collection, transactions_collection
from config import get_settings

router = APIRouter(prefix="/payments", tags=["payments"])
settings = get_settings()

@router.get("/wompi/acceptance")
async def get_wompi_acceptance():
    """Get Wompi acceptance token and terms"""
    result = await wompi_client.get_acceptance_token()
    return result

@router.post("/card/init", response_model=PaymentInitResponse)
async def initiate_card_payment(payload: CardPaymentInitRequest):
    # Get order
    order = await orders_collection.find_one({"_id": ObjectId(payload.order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    amount = order["total"]
    currency = order["currency"]
    
    # Create transaction record
    transaction_doc = {
        "order_id": order["_id"],
        "idempotency_key": f"order-{payload.order_id}-card-{int(datetime.utcnow().timestamp())}",
        "provider": "WOMPI",
        "payment_method_type": "CARD",
        "amount": amount,
        "currency": currency,
        "status": "PENDING",
        "status_history": [
            {
                "from": None,
                "to": "PENDING",
                "at": datetime.utcnow(),
                "source": "backend",
                "reason": "card_payment_initiated",
            }
        ],
        "acceptance_token": payload.acceptance_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    tx_result = await transactions_collection.insert_one(transaction_doc)
    transaction_id = str(tx_result.inserted_id)
    
    # Call Wompi API
    redirect_url = f"{settings.frontend_origin}/payment/result?orderId={payload.order_id}&tx={transaction_id}"
    
    try:
        wompi_response = await wompi_client.create_card_transaction(
            amount_in_cents=amount,
            currency=currency,
            reference=transaction_id,
            customer_email=payload.customer_email,
            acceptance_token=payload.acceptance_token,
            redirect_url=redirect_url
        )
        
        # Update transaction with Wompi response
        provider_tx_id = wompi_response["data"]["id"]
        checkout_url = wompi_response["data"].get("checkout_url", redirect_url)
        
        await transactions_collection.update_one(
            {"_id": tx_result.inserted_id},
            {
                "$set": {
                    "provider_transaction_id": provider_tx_id,
                    "raw_provider_response": {"init": wompi_response},
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        
        return PaymentInitResponse(
            checkout_url=checkout_url,
            transaction_id=transaction_id
        )
        
    except Exception as e:
        # Mark transaction as failed
        await transactions_collection.update_one(
            {"_id": tx_result.inserted_id},
            {
                "$set": {"status": "FAILED", "updated_at": datetime.utcnow()},
                "$push": {
                    "status_history": {
                        "from": "PENDING",
                        "to": "FAILED",
                        "at": datetime.utcnow(),
                        "source": "backend",
                        "reason": f"wompi_error:{str(e)}",
                    }
                },
            },
        )
        raise HTTPException(status_code=502, detail="Error contacting payment provider")

@router.get("/pse/banks")
async def get_pse_banks():
    """Get list of PSE banks"""
    banks = await wompi_client.get_pse_banks()
    return banks

@router.post("/pse/init", response_model=PaymentInitResponse)
async def initiate_pse_payment(payload: PsePaymentInitRequest):
    # Get order
    order = await orders_collection.find_one({"_id": ObjectId(payload.order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    amount = order["total"]
    currency = order["currency"]
    
    # Create transaction record
    transaction_doc = {
        "order_id": order["_id"],
        "idempotency_key": f"order-{payload.order_id}-pse-{int(datetime.utcnow().timestamp())}",
        "provider": "WOMPI",
        "payment_method_type": "PSE",
        "payment_method_details": {
            "pse_bank_code": payload.bank_code,
        },
        "amount": amount,
        "currency": currency,
        "status": "PENDING",
        "status_history": [
            {
                "from": None,
                "to": "PENDING",
                "at": datetime.utcnow(),
                "source": "backend",
                "reason": "pse_payment_initiated",
            }
        ],
        "acceptance_token": payload.acceptance_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    tx_result = await transactions_collection.insert_one(transaction_doc)
    transaction_id = str(tx_result.inserted_id)
    
    # Call Wompi API
    redirect_url = f"{settings.frontend_origin}/payment/result?orderId={payload.order_id}&tx={transaction_id}"
    
    try:
        wompi_response = await wompi_client.create_pse_transaction(
            amount_in_cents=amount,
            currency=currency,
            reference=transaction_id,
            customer_email=payload.customer_email,
            person_type=payload.person_type,
            document_type=payload.document_type,
            document_number=payload.document_number,
            bank_code=payload.bank_code,
            acceptance_token=payload.acceptance_token,
            redirect_url=redirect_url
        )
        
        # Update transaction
        provider_tx_id = wompi_response["data"]["id"]
        pse_redirect = wompi_response["data"]["payment_method"]["extra"]["async_payment_url"]
        
        await transactions_collection.update_one(
            {"_id": tx_result.inserted_id},
            {
                "$set": {
                    "provider_transaction_id": provider_tx_id,
                    "raw_provider_response": {"init": wompi_response},
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        
        return PaymentInitResponse(
            redirect_url=pse_redirect,
            transaction_id=transaction_id
        )
        
    except Exception as e:
        # Mark as failed
        await transactions_collection.update_one(
            {"_id": tx_result.inserted_id},
            {
                "$set": {"status": "FAILED", "updated_at": datetime.utcnow()},
                "$push": {
                    "status_history": {
                        "from": "PENDING",
                        "to": "FAILED",
                        "at": datetime.utcnow(),
                        "source": "backend",
                        "reason": f"wompi_pse_error:{str(e)}",
                    }
                },
            },
        )
        raise HTTPException(status_code=502, detail="Error initiating PSE payment")

@router.get("/transactions/{transaction_id}", response_model=TransactionStatusResponse)
async def get_transaction_status(transaction_id: str):
    tx = await transactions_collection.find_one({"_id": ObjectId(transaction_id)})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return TransactionStatusResponse(
        transaction_id=transaction_id,
        order_id=str(tx["order_id"]),
        status=tx["status"],
        amount=tx["amount"],
        currency=tx["currency"],
        payment_method_type=tx["payment_method_type"],
    )
