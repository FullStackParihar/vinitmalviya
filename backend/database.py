import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    print("Warning: MONGODB_URL not set in environment variables.")

CLIENT = AsyncIOMotorClient(MONGODB_URL)
DB = CLIENT["ramdev_builders_db"]

async def get_database():
    return DB
