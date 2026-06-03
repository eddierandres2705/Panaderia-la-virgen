from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "Panaderia de la Virgen API"
    
    # Frontend
    frontend_origin: str
    
    # MongoDB
    mongodb_url: str = ""
    db_name: str = "panaderia_virgen"
    
    # Wompi Sandbox
    wompi_public_key: str = "pub_test_placeholder"
    wompi_private_key: str = "prv_test_placeholder"
    wompi_webhook_secret: str = "secret_test_placeholder"
    wompi_base_url: str = "https://sandbox.wompi.co/v1"
    wompi_merchant_id: Optional[str] = None
    
    # WhatsApp
    whatsapp_number: str = "+573023981490"
    
    # JWT Auth
    jwt_secret: str = "change_this_secret_in_production_2705"
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 86400  # 24 hours
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
