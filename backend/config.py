import os
import time
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ==========================================
# MySQL Configuration
# ==========================================
# รองรับทั้งแบบ DATABASE_URL (URL เดียว) และแบบแยกส่วน
MYSQL_URL = os.getenv("MYSQL_URL")  # e.g., mysql://user:pass@host:port/db

if MYSQL_URL:
    parsed = urlparse(MYSQL_URL)
    MYSQL_HOST = parsed.hostname or "localhost"
    MYSQL_PORT = parsed.port or 3306
    MYSQL_USER = parsed.username or "root"
    MYSQL_PASSWORD = parsed.password or ""
    MYSQL_DB = parsed.path.lstrip("/") or "CarCustomShop"
else:
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "789456")
    MYSQL_DB = os.getenv("MYSQL_DB", "CarCustomShop")

# ==========================================
# MongoDB Configuration
# ==========================================
# ลำดับความสำคัญ: MONGO_URI > {MONGO_HOST, MONGO_PORT, MONGO_DB}
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB", "CarCustomShop")

if not MONGO_URI:
    MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
    MONGO_PORT = int(os.getenv("MONGO_PORT", 27017))
    MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"

# ==========================================
# Flask & Security Configuration
# ==========================================
FLASK_ENV = os.getenv("FLASK_ENV", "development")
DEBUG = FLASK_ENV == "development"

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "testsecretkey_change_me_in_prod")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

# Retry Configuration
DB_RETRY_ATTEMPTS = int(os.getenv("DB_RETRY_ATTEMPTS", 3))
DB_RETRY_DELAY = int(os.getenv("DB_RETRY_DELAY", 2))

# ═══════════════════════════════════════════════════════════════
# ฟังก์ชันตรวจสอบการเชื่อมต่อ (Helper for local only)
# ═══════════════════════════════════════════════════════════════

def check_db_connection():
    """ตรวจสอบการทำงานของฐานข้อมูลเบื้องต้น"""
    # ใน Production บน Cloud บางครั้งเราข้ามการเช็ค Port ตรงๆ เพราะอาจติด Firewall
    if os.getenv("SKIP_PORT_CHECK") == "true":
        return True
        
    print("\n" + "="*60)
    print("🔍 ตรวจสอบการเชื่อมต่อฐานข้อมูล...")
    
    # Check MySQL Port
    mysql_ready = False
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        if sock.connect_ex((MYSQL_HOST, MYSQL_PORT)) == 0:
            print(f"✅ MySQL Connection Available ({MYSQL_HOST}:{MYSQL_PORT})")
            mysql_ready = True
        sock.close()
    except: pass
    
    # Check Mongo Port (เฉพาะถ้าเป็น localhost)
    mongo_ready = False
    if "localhost" in MONGO_URI or "127.0.0.1" in MONGO_URI:
        try:
            parsed_mongo = urlparse(MONGO_URI)
            m_host = parsed_mongo.hostname or "localhost"
            m_port = parsed_mongo.port or 27017
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            if sock.connect_ex((m_host, m_port)) == 0:
                print(f"✅ MongoDB Connection Available ({m_host}:{m_port})")
                mongo_ready = True
            sock.close()
        except: pass
    else:
        # ถ้าเป็น Cloud Mongo (Atlas) เราข้ามการเช็ค Port ตรงๆ
        mongo_ready = True
        
    print("="*60 + "\n")
    return True # ไม่ Block Startup แม้จะเช็คไม่ครบ
