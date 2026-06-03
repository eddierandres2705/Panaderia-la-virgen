from fastapi import APIRouter, Request, Header, HTTPException
from bson import ObjectId
from datetime import datetime
import hmac
import hashlib

import db
# db.transactions_collection, db.orders_collection
from config import get_settings

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
settings = get_settings()

def verify_wompi_signature(body: bytes, signature: str, secret: str) -> bool:
    """Verify Wompi webhook signature using HMAC SHA-256"""
    computed = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, signature)

@router.post("/wompi")
async def wompi_webhook(request: Request, wompi_hash: str = Header(None)):
    """
    Receive and process Wompi webhooks
    Validates HMAC signature and updates transaction/order status
    """
    
    if wompi_hash is None:
        raise HTTPException(status_code=400, detail="Missing wompi_hash header")
    
    # Get raw body for signature verification
    raw_body = await request.body()
    
    # Verify signature
    if not verify_wompi_signature(raw_body, wompi_hash, settings.wompi_webhook_secret):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Parse payload
    payload = await request.json()
    event_data = payload.get("data", {})
    
    # Extract transaction reference (our internal transaction ID)
    tx_reference = event_data.get("reference") or event_data.get("transaction", {}).get("reference")
    status = event_data.get("status")
    
    if not tx_reference or not status:
        # Acknowledge but log
        print(f"⚠️ Webhook received without reference or status: {payload}")
        return {"received": True, "ignored": True}
    
    try:
        tx_object_id = ObjectId(tx_reference)
    except:
        print(f"⚠️ Invalid transaction reference: {tx_reference}")
        return {"received": True, "invalid_reference": True}
    
    # Find transaction
    tx = await db.transactions_collection.find_one({"_id": tx_object_id})
    if not tx:
        print(f"⚠️ Transaction not found: {tx_reference}")
        return {"received": True, "unknown_transaction": True}
    
    old_status = tx["status"]
    
    # Update transaction if status changed
    if old_status != status:
        await db.transactions_collection.update_one(
            {"_id": tx_object_id},
            {
                "$set": {"status": status, "updated_at": datetime.utcnow()},
                "$push": {
                    "status_history": {
                        "from": old_status,
                        "to": status,
                        "at": datetime.utcnow(),
                        "source": "wompi_webhook",
                        "reason": payload.get("event", "webhook"),
                    }
                },
                "$set": {"raw_provider_response.webhook": event_data}
            },
        )
        
        # Update order status based on transaction status
        if status == "APPROVED":
            await db.orders_collection.update_one(
                {"_id": tx["order_id"]},
                {"$set": {"status": "paid", "payment_method": tx["payment_method_type"].lower(), "updated_at": datetime.utcnow()}},
            )
            print(f"✅ Order {tx['order_id']} marked as PAID")
            
        elif status in ("DECLINED", "REJECTED", "ERROR", "VOIDED"):
            await db.orders_collection.update_one(
                {"_id": tx["order_id"]},
                {"$set": {"status": "payment_failed", "updated_at": datetime.utcnow()}},
            )
            print(f"❌ Order {tx['order_id']} marked as PAYMENT_FAILED")
    
    return {"received": True, "status": status}
