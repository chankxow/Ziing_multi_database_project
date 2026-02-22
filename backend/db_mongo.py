from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get configuration from environment variables
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", 27017))
MONGO_DB = os.getenv("MONGO_DB", "CarCustomShop")

# Build MongoDB URI
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    raise

mongo_db = client[MONGO_DB]
parts_collection = mongo_db["parts"]
