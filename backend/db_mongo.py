from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB

def get_mongo_client():
    """สร้างและส่งคืน MongoDB client"""
    try:
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test the connection
        mongo_client.admin.command('ping')
        print(f"✅ MongoDB connected to {MONGO_URI}")
        return mongo_client
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        print(f"   Trying to connect to: {MONGO_HOST}:{MONGO_PORT}")
        raise

def ensure_connection():
    """ตรวจสอบและสร้าง connection ถ้ายังไม่มี"""
    global client, mongo_db, parts_collection
    if client is None:
        client = get_mongo_client()
        mongo_db = client[MONGO_DB]
        parts_collection = mongo_db["parts"]
    return parts_collection

# Export function to be used in routes
def get_parts_collection():
    """ดึง parts collection"""
    return ensure_connection()
