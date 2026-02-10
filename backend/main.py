from fastapi import FastAPI, HTTPException, Form, Body, Depends, File, UploadFile, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import google.generativeai as genai
from dotenv import load_dotenv
from database import DB
from models import LeadCreate
from datetime import datetime
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from auth import verify_password, create_access_token, get_password_hash, get_current_user, User
from models import Token, PortfolioItem, PortfolioItemCreate
from bson import ObjectId
import shutil
from typing import List
from email_service import send_lead_notification, send_test_email
from pydantic import EmailStr
import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url

load_dotenv()

app = FastAPI(title="Ramdev Builders API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production (Netlify, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
model = None
if api_key and api_key != "PASTE_YOUR_KEY_HERE":
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash-lite')

class ChatRequest(BaseModel):
    message: str
    history: list = []  # List of {role: "user"|"model", parts: ["text"]}

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
async def startup_db_client():
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Create default admin user if not exists
    try:
        if await DB.users.count_documents({}) == 0:
             hashed_password = get_password_hash("admin123")
             user_dict = {"username": "admin", "password_hash": hashed_password, "role": "admin"}
             await DB.users.insert_one(user_dict)
             print("Admin user created: admin / admin123")
        else:
            # Check if admin exists specifically
            admin_user = await DB.users.find_one({"username": "admin"})
            if not admin_user:
                hashed_password = get_password_hash("admin123")
                user_dict = {"username": "admin", "password_hash": hashed_password, "role": "admin"}
                await DB.users.insert_one(user_dict)
                print("Admin user created: admin / admin123")
    except Exception as e:
        print(f"DB Startup Error: {e}")

# --- API Routes ---

@app.get("/")
async def root():
    return {"message": "Welcome to Malviya & Co. API"}
    
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await DB.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/reset-admin-password")
async def reset_admin_password():
    # TEMPORARY ENDPOINT FOR RECOVERY
    hashed_password = get_password_hash("admin123")
    await DB.users.update_one(
        {"username": "admin"},
        {"$set": {"password_hash": hashed_password}},
        upsert=True
    )
    return {"status": "success", "message": "Admin password reset to 'admin123'"}

@app.get("/api/portfolio", response_model=List[dict])
async def get_portfolio_items():
    items = []
    cursor = DB.portfolio.find()
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        items.append(document)
    return items

@app.post("/api/portfolio")
async def create_portfolio_item(
    title: str = Form(...),
    category: str = Form(...),
    scope: str = Form(...),
    size: str = Form("small"),
    media_type: str = Form("image"),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Cloudinary Upload
    
    # Configure inside function or globally?
    # Ideally should be global, but doing it in upload helper.
    # But wait, env vars are loaded. 
    # Let's import the helper we made!
    
    # Wait, I didn't import the helper yet? My bad.
    # Let's direct import here if I didn't update imports above perfectly.
    # Or just use the helper:
    from cloudinary_service import upload_image_to_cloudinary
    
    # Reset file cursor before upload, just in case
    await image.seek(0)
    
    # Upload to Cloudinary INSTEAD of local
    file_url = await upload_image_to_cloudinary(image, folder="ramdev_portfolio")
    
    if not file_url:
        raise HTTPException(status_code=500, detail="Failed to upload image/video")

    item_dict = {
        "title": title,
        "category": category,
        "scope": scope,
        "size": size,
        "media_type": media_type,
        "image_url": file_url # Now a full URL, not relative path
    }
    
    new_item = await DB.portfolio.insert_one(item_dict)
    return {"status": "success", "id": str(new_item.inserted_id)}

@app.delete("/api/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str, current_user: User = Depends(get_current_user)):
    result = await DB.portfolio.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 1:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/api/leads")
async def create_lead(lead: LeadCreate, background_tasks: BackgroundTasks):
    try:
        lead_dict = lead.model_dump()
        result = await DB.leads.insert_one(lead_dict)
        
        # Send email notification
        background_tasks.add_task(send_lead_notification, lead_dict)
        
        return {"status": "success", "id": str(result.inserted_id), "message": "Inquiry received! We will call you shortly."}
    except Exception as e:
        print(f"Database Error: {e}")
        return {"status": "demo_success", "message": "Demo: Lead received (DB not connected)"}

@app.get("/api/leads", response_model=List[dict])
async def get_leads(current_user: User = Depends(get_current_user)):
    leads = []
    # Sort by created_at descending (newest first)
    cursor = DB.leads.find().sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        # Ensure created_at is handled correctly if it's a datetime object in DB
        if "created_at" in document and isinstance(document["created_at"], datetime):
             document["created_at"] = document["created_at"].isoformat()
        leads.append(document)
    return leads

@app.delete("/api/leads/{lead_id}")
async def delete_lead(lead_id: str, current_user: User = Depends(get_current_user)):
    result = await DB.leads.delete_one({"_id": ObjectId(lead_id)})
    if result.deleted_count == 1:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Lead not found")

@app.post("/api/test-email")
async def test_email_endpoint(email: EmailStr = Body(..., embed=True), background_tasks: BackgroundTasks = None):
    try:
        await send_test_email(email)
        return {"status": "success", "message": f"Test email sent to {email}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/hardware")
async def create_hardware_product(
    name: str = Form(...),
    description: str = Form(...),
    price: str = Form(...),
    tag: str = Form("New Arrival"),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    from cloudinary_service import upload_image_to_cloudinary
    
    # Reset file cursor
    await image.seek(0)
    
    # Upload to Cloudinary
    file_url = await upload_image_to_cloudinary(image, folder="ramdev_hardware")
    
    if not file_url:
        raise HTTPException(status_code=500, detail="Failed to upload image")

    product_dict = {
        "name": name,
        "description": description,
        "price": price,
        "tag": tag,
        "image_url": file_url
    }
    
    new_product = await DB.hardware.insert_one(product_dict)
    return {"status": "success", "id": str(new_product.inserted_id)}

@app.get("/api/hardware")
async def get_hardware_products():
    products = []
    cursor = DB.hardware.find()
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        products.append(document)
    return products

@app.delete("/api/hardware/{product_id}")
async def delete_hardware_product(product_id: str, current_user: User = Depends(get_current_user)):
    result = await DB.hardware.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 1:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # Demo Fallback if no API Key
    if not model:
        msg_lower = request.message.lower()
        if "price" in msg_lower or "cost" in msg_lower:
            return {"response": "For accurate pricing, we recommend a site visit. But to give you an idea, premium living room renovations start at ₹1200/sq.ft. Shall I book a visit?"}
        return {"response": "[DEMO] I need a Gemini API Key to think! Please add it to backend/.env."}

    try:
        # Improved System Prompt
        system_instruction = """
        You are 'RamdevAI', the Senior Design Consultant for Ramdev Builders & Developers. 
        Your goal is to provide sophisticated, helpful advice on interior design, construction, and premium hardware.
        
        Guidelines:
        1. Tone: Professional, warm, and trustworthy. 
        2. Expertise: Be knowledgeable about construction quality, foundations, and interior finishes.
        3. Lead Gen: ALWAYS goal is to get their contact details for a callback from Vinit Malviya.
        4. Context: You are talking to a potential client.
        """
        
        # Start chat with history (simplified)
        # Note: In a real app, history should be formatted correctly for Gemini (user/model roles)
        # We will start a fresh chat for this turn but inject history as context if needed.
        # For simplicity/robustness in this turns:
        
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(f"{system_instruction}\n\nClient: {request.message}")
        
        return {"response": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail="AI Service Error")
