import sys
import logging

# Set up logging immediately
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("NANI-DIAGNOSTIC: Starting python server initialization...", flush=True)

try:
    from fastapi import FastAPI, APIRouter, HTTPException
    from dotenv import load_dotenv
    from starlette.middleware.cors import CORSMiddleware
    from motor.motor_asyncio import AsyncIOMotorClient
    import os
    import stripe
    import asyncio
    from pathlib import Path
    from pydantic import BaseModel, Field, ConfigDict, EmailStr
    from typing import List, Optional
    import uuid
    from datetime import datetime, timezone

    ROOT_DIR = Path(__file__).parent
    load_dotenv(ROOT_DIR / '.env')

    print("NANI-DIAGNOSTIC: Checking environment variables...", flush=True)
    
    # Safely look for database configurations
    if 'MONGO_URL' not in os.environ:
        raise KeyError("MISSING VARIABLE: 'MONGO_URL' is missing from your Render Environment tab!")
    if 'DB_NAME' not in os.environ:
        raise KeyError("MISSING VARIABLE: 'DB_NAME' is missing from your Render Environment tab!")
        
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]

    # Resend & Stripe setup
    import resend
    resend.api_key = os.environ.get('RESEND_API_KEY', '')
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
    stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

    print("NANI-DIAGNOSTIC: Environment looks good. Initializing FastAPI...", flush=True)
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Create a router with the /api prefix
    api_router = APIRouter(prefix="/api")

except Exception as startup_error:
    print("\n" + "="*50, file=sys.stderr, flush=True)
    print(f"CRITICAL STARTUP ERROR: {str(startup_error)}", file=sys.stderr, flush=True)
    print("="*50 + "\n", file=sys.stderr, flush=True)
    logging.exception("Detailed Startup Failure:")
    sys.exit(1)

# ==================== MODELS ====================

class CoffeeBeanCreate(BaseModel):
    name_hu: str
    name_en: str
    origin: str
    roast_level: str
    flavor_notes_hu: List[str]
    flavor_notes_en: List[str]
    description_hu: str
    description_en: str
    price: int
    weight: int
    image_url: str
    in_stock: bool = True

class CoffeeBean(CoffeeBeanCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    author: str
    text_hu: str
    text_en: str
    rating: int = Field(ge=1, le=5)

class Review(ReviewCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_hu: str
    name_en: str
    description_hu: str
    description_en: str
    price: int
    category: str
    image_url: str
    available: bool = True

class MenuItemCreate(BaseModel):
    name_hu: str
    name_en: str
    description_hu: str
    description_en: str
    price: int
    category: str
    image_url: str
    available: bool = True

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Café Nani API", "status": "online"}

@api_router.get("/coffee-beans", response_model=List[CoffeeBean])
async def get_coffee_beans():
    beans = await db.coffee_beans.find({}, {"_id": 0}).to_list(100)
    for bean in beans:
        if isinstance(bean.get('created_at'), str):
            bean['created_at'] = datetime.fromisoformat(bean['created_at'])
    return beans

@api_router.get("/coffee-beans/{bean_id}", response_model=CoffeeBean)
async def get_coffee_bean(bean_id: str):
    bean = await db.coffee_beans.find_one({"id": bean_id}, {"_id": 0})
    if not bean:
        raise HTTPException(status_code=404, detail="Coffee bean not found")
    if isinstance(bean.get('created_at'), str):
        bean['created_at'] = datetime.fromisoformat(bean['created_at'])
    return bean

@api_router.post("/coffee-beans", response_model=CoffeeBean)
async def create_coffee_bean(data: CoffeeBeanCreate):
    bean = CoffeeBean(**data.model_dump())
    doc = bean.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.coffee_beans.insert_one(doc)
    return bean

@api_router.put("/coffee-beans/{bean_id}", response_model=CoffeeBean)
async def update_coffee_bean(bean_id: str, data: CoffeeBeanCreate):
    existing = await db.coffee_beans.find_one({"id": bean_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Coffee bean not found")
    updated = {**data.model_dump(), "id": bean_id, "created_at": existing.get('created_at')}
    await db.coffee_beans.update_one({"id": bean_id}, {"$set": updated})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/coffee-beans/{bean_id}")
async def delete_coffee_bean(bean_id: str):
    result = await db.coffee_beans.delete_one({"id": bean_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coffee bean not found")
    return {"message": "Coffee bean deleted"}

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(100)
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(data: ReviewCreate):
    review = Review(**data.model_dump())
    doc = review.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu_items():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(100)
    return items

@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(data: MenuItemCreate):
    item = MenuItem(**data.model_dump())
    doc = item.model_dump()
    await db.menu_items.insert_one(doc)
    return item

@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}

@api_router.post("/contact")
async def send_contact_email(data: ContactFormRequest):
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2C2420;">Új üzenet a Café Nani weboldalról</h2>
        <div style="background: #F9F6F0; padding: 20px; border-radius: 8px;">
            <p><strong>Név:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Tárgy:</strong> {data.subject}</p>
            <p><strong>Üzenet:</strong></p>
            <p style="white-space: pre-wrap;">{data.message}</p>
        </div>
    </body>
    </html>
    """
    params = {
        "from": "onboarding@resend.dev",
        "to": [SENDER_EMAIL],
        "subject": f"Café Nani Contact: {data.subject}",
        "html": html_content,
        "reply_to": data.email
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact email sent from {data.email}")
        return {"status": "success", "message": "Email sent successfully"}
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        return {"status": "demo", "message": "Form submitted", "error": str(e)}

@api_router.post("/seed")
async def seed_data():
    existing_beans = await db.coffee_beans.count_documents({})
    if existing_beans > 0:
        return {"message": "Data already seeded"}
    
    coffee_beans = [
        {
            "id": str(uuid.uuid4()), "name_hu": "Etióp Yirgacheffe", "name_en": "Ethiopian Yirgacheffe",
            "origin": "Ethiopia", "roast_level": "Light", "flavor_notes_hu": ["Virágos", "Citrusos", "Teás"],
            "flavor_notes_en": ["Floral", "Citrus", "Tea-like"], "price": 4500, "weight": 250, "in_stock": True,
            "description_hu": "Tiszta, virágos aroma citrusos utóízzel.", "description_en": "Clean, floral aroma.",
            "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800", "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name_hu": "Kolumbiai Supremo", "name_en": "Colombian Supremo",
            "origin": "Colombia", "roast_level": "Medium", "flavor_notes_hu": ["Karamell", "Dió", "Csokoládé"],
            "flavor_notes_en": ["Caramel", "Nutty", "Chocolate"], "price": 3900, "weight": 250, "in_stock": True,
            "description_hu": "Kiegyensúlyozott, édes ízvilág.", "description_en": "Balanced, sweet profile.",
            "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800", "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name_hu": "Brazil Santos", "name_en": "Brazil Santos",
            "origin": "Brazil", "roast_level": "Medium-Dark", "flavor_notes_hu": ["Mogyoró", "Csokoládé", "Fűszeres"],
            "flavor_notes_en": ["Hazelnut", "Chocolate", "Spicy"], "price": 3500, "weight": 250, "in_stock": True,
            "description_hu": "Testes, gazdag íz mogyorós árnyalatokkal.", "description_en": "Full-bodied, rich flavor.",
            "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name_hu": "Guatemalai Antigua", "name_en": "Guatemala Antigua",
            "origin": "Guatemala", "roast_level": "Medium", "flavor_notes_hu": ["Füstös", "Fűszeres", "Csokoládé"],
            "flavor_notes_en": ["Smoky", "Spicy", "Chocolate"], "price": 4200, "weight": 250, "in_stock": True,
            "description_hu": "Komplex, füstös aroma vulkanikus talajból.", "description_en": "Complex, smoky aroma.",
            "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    for bean in coffee_beans:
        await db.coffee_beans.insert_one(bean)

    reviews = [
        {"id": str(uuid.uuid4()), "author": "Kovács Anna", "text_hu": "Nagyon finom!", "text_en": "Delicious!", "rating": 5, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "author": "Nagy Péter", "text_hu": "Barátságos hangulat.", "text_en": "Cozy vibes.", "rating": 5, "created_at": datetime.now(timezone.utc).isoformat()}
    ]
    for review in reviews:
        await db.reviews.insert_one(review)

    menu_items = [
        {"id": str(uuid.uuid4()), "name_hu": "Flat White", "name_en": "Flat White", "description_hu": "Bársonyos mikrohab", "description_en": "Velvety foam", "price": 950, "category": "coffee", "image_url": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800", "available": True}
    ]
    for item in menu_items:
        await db.menu_items.insert_one(item)
    return {"message": "Data seeded successfully"}

class OrderRequest(BaseModel):
    customer_name: str
    email: EmailStr
    items: List[dict]
    total: int

@api_router.post("/orders")
async def process_order(data: OrderRequest):
    items_html = "".join([f"<li>{item.get('quantity', 1)}x {item.get('name_hu', 'Termék')}</li>" for item in data.items])
    html_content = f"<html><body><h2>Új rendelés!</h2><ul>{items_html}</ul></body></html>"
    params = {"from": "onboarding@resend.dev", "to": [SENDER_EMAIL], "subject": "Új rendelés", "html": html_content}
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "message": "Rendelés elküldve!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@api_router.post("/create-payment-intent")
async def create_payment_intent(payload: dict):
    try:
        amount = payload.get("amount", 0)
        intent = stripe.PaymentIntent.create(amount=amount, currency="huf", automatic_payment_methods={"enabled": True})
        return {"clientSecret": intent["client_secret"]}
    except Exception as e:
        return {"error": str(e)}

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
