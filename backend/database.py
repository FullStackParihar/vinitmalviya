import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://vishnu23:1234@cluster0.oloj4sd.mongodb.net/vinu")
CLIENT = AsyncIOMotorClient(MONGODB_URL)
DB = CLIENT["malviya_co_db"]

async def get_database():
    return DB
