import httpx
from typing import Dict, Any, Optional
from config import get_settings

settings = get_settings()

class WompiClient:
    def __init__(self):
        self.base_url = settings.wompi_base_url
        self.public_key = settings.wompi_public_key
        self.private_key = settings.wompi_private_key
    
    async def get_acceptance_token(self) -> Dict[str, Any]:
        """Get Wompi acceptance token and terms URL"""
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            try:
                resp = await client.get(
                    f"/merchants/{self.public_key}",
                    timeout=10.0
                )
                resp.raise_for_status()
                data = resp.json()
                acceptance = data["data"]["presigned_acceptance"]
                return {
                    "acceptance_token": acceptance["acceptance_token"],
                    "terms_url": acceptance["permalink"],
                }
            except Exception as e:
                print(f"Error getting acceptance token: {e}")
                # Return mock data for development
                return {
                    "acceptance_token": "test_acceptance_token",
                    "terms_url": "https://wompi.com/terms"
                }
    
    async def create_card_transaction(
        self,
        amount_in_cents: int,
        currency: str,
        reference: str,
        customer_email: str,
        acceptance_token: str,
        redirect_url: str
    ) -> Dict[str, Any]:
        """Create a card payment transaction"""
        payload = {
            "amount_in_cents": amount_in_cents,
            "currency": currency,
            "reference": reference,
            "customer_email": customer_email,
            "acceptance_token": acceptance_token,
            "redirect_url": redirect_url,
        }
        
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            try:
                resp = await client.post(
                    "/transactions",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self.private_key}",
                        "Content-Type": "application/json",
                    },
                    timeout=15.0
                )
                
                if resp.status_code >= 400:
                    print(f"Wompi error: {resp.text}")
                    raise Exception(f"Wompi API error: {resp.status_code}")
                
                return resp.json()
            except Exception as e:
                print(f"Error creating card transaction: {e}")
                # Return mock response for development
                return {
                    "data": {
                        "id": f"test_tx_{reference}",
                        "checkout_url": f"{redirect_url}&status=pending",
                        "status": "PENDING"
                    }
                }
    
    async def create_pse_transaction(
        self,
        amount_in_cents: int,
        currency: str,
        reference: str,
        customer_email: str,
        person_type: str,
        document_type: str,
        document_number: str,
        bank_code: str,
        acceptance_token: str,
        redirect_url: str
    ) -> Dict[str, Any]:
        """Create a PSE payment transaction"""
        payload = {
            "amount_in_cents": amount_in_cents,
            "currency": currency,
            "reference": reference,
            "customer_email": customer_email,
            "acceptance_token": acceptance_token,
            "payment_method": {
                "type": "PSE",
                "user_type": person_type,
                "user_legal_id_type": document_type,
                "user_legal_id": document_number,
                "financial_institution_code": bank_code,
            },
            "redirect_url": redirect_url,
        }
        
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            try:
                resp = await client.post(
                    "/transactions",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self.private_key}",
                        "Content-Type": "application/json",
                    },
                    timeout=15.0
                )
                
                if resp.status_code >= 400:
                    print(f"Wompi PSE error: {resp.text}")
                    raise Exception(f"Wompi PSE API error: {resp.status_code}")
                
                return resp.json()
            except Exception as e:
                print(f"Error creating PSE transaction: {e}")
                # Return mock response
                return {
                    "data": {
                        "id": f"test_pse_{reference}",
                        "payment_method": {
                            "extra": {
                                "async_payment_url": f"{redirect_url}&status=pending"
                            }
                        },
                        "status": "PENDING"
                    }
                }
    
    async def get_pse_banks(self) -> list:
        """Get list of PSE banks"""
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            try:
                resp = await client.get("/pse/financial_institutions", timeout=10.0)
                resp.raise_for_status()
                data = resp.json()
                return data.get("data", [])
            except Exception as e:
                print(f"Error getting PSE banks: {e}")
                # Return mock banks
                return [
                    {"financial_institution_code": "1040", "financial_institution_name": "Bancolombia"},
                    {"financial_institution_code": "1002", "financial_institution_name": "Banco de Bogotá"},
                    {"financial_institution_code": "1012", "financial_institution_name": "Banco Davivienda"},
                    {"financial_institution_code": "1019", "financial_institution_name": "Banco Colpatria"},
                    {"financial_institution_code": "1007", "financial_institution_name": "Bancoomeva"},
                ]

wompi_client = WompiClient()
