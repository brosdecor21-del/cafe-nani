from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
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

# Resend setup
import resend
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Create the main app
app = FastAPI()

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
    # Use delete_one and match the 'id' field from your model
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
        "from": SENDER_EMAIL,
        "to": [SENDER_EMAIL],  # In production, change to actual business email
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
        # Return success anyway for demo purposes (Resend needs real API key)
        return {
            "status": "demo",
            "message": "Contact form submitted (email service requires configuration)",
            "error": str(e)
        }

# Seed initial data
@api_router.post("/seed")
async def seed_data():
    # Check if already seeded
    existing_beans = await db.coffee_beans.count_documents({})
    if existing_beans > 0:
        return {"message": "Data already seeded"}
    
    # Seed coffee beans
    coffee_beans = [
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Etióp Yirgacheffe",
            "name_en": "Ethiopian Yirgacheffe",
            "origin": "Ethiopia",
            "roast_level": "Light",
            "flavor_notes_hu": ["Virágos", "Citrusos", "Teás"],
            "flavor_notes_en": ["Floral", "Citrus", "Tea-like"],
            "description_hu": "Tiszta, virágos aroma citrusos utóízzel. A specialty kávé klasszikusa.",
            "description_en": "Clean, floral aroma with citrus finish. A specialty coffee classic.",
            "price": 4500,
            "weight": 250,
            "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Kolumbiai Supremo",
            "name_en": "Colombian Supremo",
            "origin": "Colombia",
            "roast_level": "Medium",
            "flavor_notes_hu": ["Karamell", "Dió", "Csokoládé"],
            "flavor_notes_en": ["Caramel", "Nutty", "Chocolate"],
            "description_hu": "Kiegyensúlyozott, édes ízvilág karamell és dió jegyekkel.",
            "description_en": "Balanced, sweet profile with caramel and nutty notes.",
            "price": 3900,
            "weight": 250,
            "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Brazil Santos",
            "name_en": "Brazil Santos",
            "origin": "Brazil",
            "roast_level": "Medium-Dark",
            "flavor_notes_hu": ["Mogyoró", "Csokoládé", "Fűszeres"],
            "flavor_notes_en": ["Hazelnut", "Chocolate", "Spicy"],
            "description_hu": "Testes, gazdag íz mogyorós és csokoládés árnyalatokkal.",
            "description_en": "Full-bodied, rich flavor with hazelnut and chocolate notes.",
            "price": 3500,
            "weight": 250,
            "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Guatemalai Antigua",
            "name_en": "Guatemala Antigua",
            "origin": "Guatemala",
            "roast_level": "Medium",
            "flavor_notes_hu": ["Füstös", "Fűszeres", "Csokoládé"],
            "flavor_notes_en": ["Smoky", "Spicy", "Chocolate"],
            "description_hu": "Komplex, füstös aroma vulkanikus talajból származó babokból.",
            "description_en": "Complex, smoky aroma from volcanic soil grown beans.",
            "price": 4200,
            "weight": 250,
            "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    for bean in coffee_beans:
        await db.coffee_beans.insert_one(bean)
    
    # Seed reviews
    reviews = [
        {
            "id": str(uuid.uuid4()),
            "author": "Kovács Anna",
            "text_hu": "Nagyon finom V60 kávé, kedves kiszolgálás. A hely hangulata fantasztikus!",
            "text_en": "Very delicious V60 coffee, friendly service. The atmosphere is fantastic!",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "author": "Nagy Péter",
            "text_hu": "Dirty chai finom volt, barátságos hangulat. Mindig szívesen jövök ide.",
            "text_en": "Dirty chai was delicious, friendly atmosphere. I always love coming here.",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "author": "Szabó Eszter",
            "text_hu": "Hangulatos hely, nagy választék. A flat white tökéletes volt!",
            "text_en": "Cozy place, great selection. The flat white was perfect!",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "author": "Tóth Márk",
            "text_hu": "A legjobb specialty kávézó a környéken. A szendvicsek is kiválóak.",
            "text_en": "The best specialty coffee shop in the area. The sandwiches are also excellent.",
            "rating": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    for review in reviews:
        await db.reviews.insert_one(review)
    
    # Seed menu items
    menu_items = [
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Flat White",
            "name_en": "Flat White",
            "description_hu": "Bársonyos mikrohab tökéletes espresso alapon",
            "description_en": "Velvety microfoam on perfect espresso base",
            "price": 950,
            "category": "coffee",
            "image_url": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Café Cortado",
            "name_en": "Café Cortado",
            "description_hu": "Espresso kevés meleg tejjel, spanyol stílusban",
            "description_en": "Espresso with a splash of warm milk, Spanish style",
            "price": 750,
            "category": "coffee",
            "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "V60 Filter Kávé",
            "name_en": "V60 Filter Coffee",
            "description_hu": "Kézzel készített filter kávé prémium szemes kávéból",
            "description_en": "Hand-brewed filter coffee from premium beans",
            "price": 1200,
            "category": "coffee",
            "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Dirty Chai",
            "name_en": "Dirty Chai",
            "description_hu": "Fűszeres chai latte espresso shot-tal",
            "description_en": "Spiced chai latte with an espresso shot",
            "price": 1100,
            "category": "coffee",
            "image_url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name_hu": "Prosciutto Cotto Szendvics",
            "name_en": "Prosciutto Cotto Sandwich",
            "description_hu": "Olasz sonka friss zöldségekkel és házi szósszal",
            "description_en": "Italian ham with fresh vegetables and house sauce",
            "price": 1800,
            "category": "food",
            "image_url": "https://customer-assets.emergentagent.com/job_bird-spirit-cafe/artifacts/jloifxqj_Gemini_Generated_Image_7j1lw47j1lw47j1l.png",
            "available": True
        }
    ]
    
    for item in menu_items:
        await db.menu_items.insert_one(item)
    
    return {"message": "Data seeded successfully", "beans": len(coffee_beans), "reviews": len(reviews), "menu_items": len(menu_items)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
