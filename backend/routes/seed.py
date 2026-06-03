from fastapi import APIRouter
import db
from datetime import datetime

router = APIRouter(prefix="/seed", tags=["seed"])

@router.post("/products")
async def seed_products():
    """Seed initial products"""
    
    products = [
        {
            "name": "Torta de Cumpleaños Personalizada",
            "description": "Tortas personalizadas para cada celebración. Elige tu sabor favorito y diseño único.",
            "category": "Tortas",
            "price": 4500000,  # $45.000 COP in centavos
            "image_url": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80",
            "available": True,
            "featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Brazo de Reina Frío",
            "description": "Un clásico que encanta por su suavidad. Perfecto para compartir en familia.",
            "category": "Postres",
            "price": 3500000,  # $35.000
            "image_url": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80",
            "available": True,
            "featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Galletas Artesanales",
            "description": "Perfectas para acompañar tu café. Variedad de sabores únicos.",
            "category": "Galletas",
            "price": 1200000,  # $12.000/docena
            "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
            "available": True,
            "featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Tartas Especiales",
            "description": "Dulces que convierten cualquier día en especial. Para toda ocasión.",
            "category": "Tartas",
            "price": 3000000,  # $30.000
            "image_url": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
            "available": True,
            "featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Pan Fresco Diario",
            "description": "Variedad de pan recién horneado todos los días. Calidad y sabor garantizados.",
            "category": "Pan",
            "price": 150000,  # $1.500
            "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
            "available": True,
            "featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Postres del Día",
            "description": "Deliciosos postres frescos preparados diariamente con ingredientes de calidad.",
            "category": "Postres",
            "price": 800000,  # $8.000
            "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
            "available": True,
            "featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
    ]
    
    # Clear existing products
    await db.products_collection.delete_many({})
    
    # Insert new products
    result = await db.products_collection.insert_many(products)
    
    return {
        "message": f"Successfully seeded {len(result.inserted_ids)} products",
        "count": len(result.inserted_ids)
    }
