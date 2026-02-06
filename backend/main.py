from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import google.generativeai as genai
from dotenv import load_dotenv
from database import DB
from models import LeadCreate
from datetime import datetime
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Ramdev Builders API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
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

# --- API Routes ---

@app.get("/")
async def root():
    return {"message": "Welcome to Malviya & Co. API"}

@app.post("/api/leads")
async def create_lead(lead: LeadCreate):
    try:
        lead_dict = lead.model_dump()
        result = await DB.leads.insert_one(lead_dict)
        return {"status": "success", "id": str(result.inserted_id), "message": "Inquiry received! We will call you shortly."}
    except Exception as e:
        print(f"Database Error: {e}")
        return {"status": "demo_success", "message": "Demo: Lead received (DB not connected)"}

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
