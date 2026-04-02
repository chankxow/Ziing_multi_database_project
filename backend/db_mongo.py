from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB

# Global connection state
client = None
mongo_db = None
parts_collection = None

def get_mongo_client():
    """สร้างและส่งคืน MongoDB client"""
    try:
        # Log URI แบบซ่อน password เพื่อความปลอดภัย
        safe_uri = MONGO_URI.split("@")[-1] if MONGO_URI and "@" in MONGO_URI else MONGO_URI
        mc = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
        mc.admin.command("ping")
        print(f"✅ MongoDB connected: ...@{safe_uri}")
        return mc
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        raise

def ensure_connection():
    """ตรวจสอบและสร้าง connection ถ้ายังไม่มี"""
    global client, mongo_db, parts_collection
    if client is None:
        client = get_mongo_client()
        mongo_db = client[MONGO_DB]
        parts_collection = mongo_db["parts"]
    return parts_collection

def get_parts_collection():
    """ดึง parts collection"""
    return ensure_connection()
