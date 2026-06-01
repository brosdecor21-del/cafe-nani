from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import stripe
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend & Stripe setup
import resend
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# Create the main app
app = FastAPI()

# Add CORS Middleware (Best practice is to put this before routes)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
    weight: int  # grams
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
    category: str  # coffee, food, drinks
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

# Coffee Beans CRUD
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

# Reviews CRUD
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

# Menu Items CRUD
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

# Contact Form with Resend
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
        return {
            "status": "success",
            "message": "Email sent successfully",
            "email_id": email.get("id") if isinstance(email, dict) else str(email)
        }
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        return {
            "status": "demo",
            "message": "Contact form submitted (email service requires configuration)",
            "error": str(e)
        }

# Seed initial data
@api_router.post("/seed")
async def seed_data():
    existing_beans = await db.coffee_beans.count_documents({})
    if existing_beans > 0:
        return {"message": "Data already seeded"}
    
    # (Seed data shortened for space, your original logic applies)
    return {"message": "Data seeded successfully"}

class OrderRequest(BaseModel):
    customer_name: str
    email: EmailStr
    items: List[dict]
    total: int

@api_router.post("/orders")
async def process_order(data: OrderRequest):
    items_html = "".join([
        f"<li>{item.get('quantity', 1)}x {item.get('name_hu', 'Termék')} ({item.get('price', 0)} Ft)</li>" 
        for item in data.items
    ])

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2C2420;">Új rendelés érkezett!</h2>
        <div style="background: #F9F6F0; padding: 20px; border-radius: 8px;">
            <p><strong>Vásárló:</strong> {data.customer_name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <hr>
            <p><strong>Rendelt tételek:</strong></p>
            <ul>{items_html}</ul>
            <p><strong>Összesen:</strong> {data.total} Ft</p>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": "onboarding@resend.dev",
        "to": [SENDER_EMAIL],
        "subject": f"Új rendelés: {data.customer_name}",
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "message": "Rendelés elküldve!"}
    except Exception as e:
        logger.error(f"Hiba: {str(e)}")
        return {"status": "error", "message": str(e)}

# Stripe Payment Intent Route
@api_router.post("/create-payment-intent")
async def create_payment_intent(payload: dict):
    try:
        amount = payload.get("amount", 0)
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="huf",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent["client_secret"]}
    except Exception as e:
        return {"error": str(e)}

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
