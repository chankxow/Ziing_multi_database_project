import os
import time
import socket
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MySQL Configuration
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "789456")
MYSQL_DB = os.getenv("MYSQL_DB", "CarCustomShop")

# MongoDB Configuration
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", 27017))
MONGO_DB = os.getenv("MONGO_DB", "CarCustomShop")

# Build MongoDB URI
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"

# Flask Configuration
FLASK_ENV = os.getenv("FLASK_ENV", "development")
DEBUG = FLASK_ENV == "development"

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "RcvkbVyCOkKS1bi71ioCKQcE56HldfAb/QTbSoFmOhU=")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

# Retry Configuration (สำหรับการพยายามเชื่อมต่อฐานข้อมูล)
DB_RETRY_ATTEMPTS = int(os.getenv("DB_RETRY_ATTEMPTS", 5))
DB_RETRY_DELAY = int(os.getenv("DB_RETRY_DELAY", 1))

# ═══════════════════════════════════════════════════════════════
# ฟังก์ชันตรวจสอบการเชื่อมต่อ
# ═══════════════════════════════════════════════════════════════

def check_port_open(host, port, timeout=5):
    """ตรวจสอบว่าพอร์ตเปิดหรือไม่"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"❌ Error checking {host}:{port} - {str(e)}")
        return False

def check_db_connection():
    """ตรวจสอบและรอให้ฐานข้อมูลเชื่อมต่อได้"""
    print("\n" + "="*60)
    print("🔍 ตรวจสอบการเชื่อมต่อฐานข้อมูล...")
    print("="*60)
    
    # Check MySQL
    print(f"\n[1/2] ตรวจสอบ MySQL: {MYSQL_HOST}:{MYSQL_PORT}")
    mysql_ready = False
    for attempt in range(1, DB_RETRY_ATTEMPTS + 1):
        if check_port_open(MYSQL_HOST, MYSQL_PORT):
            print(f"✅ MySQL พร้อม (ความพยายาม {attempt}/{DB_RETRY_ATTEMPTS})")
            mysql_ready = True
            break
        else:
            if attempt < DB_RETRY_ATTEMPTS:
                print(f"⏳ MySQL ยังไม่พร้อม... รอ {DB_RETRY_DELAY} วินาที (ครั้งที่ {attempt}/{DB_RETRY_ATTEMPTS})")
                time.sleep(DB_RETRY_DELAY)
            else:
                print(f"❌ MySQL ไม่สามารถเชื่อมต่อหลังจาก {DB_RETRY_ATTEMPTS} ครั้ง")
                print(f"   ตรวจสอบ: MySQL Service ทำงานอยู่ที่ {MYSQL_HOST}:{MYSQL_PORT}")
    
    # Check MongoDB
    print(f"\n[2/2] ตรวจสอบ MongoDB: {MONGO_HOST}:{MONGO_PORT}")
    mongo_ready = False
    for attempt in range(1, DB_RETRY_ATTEMPTS + 1):
        if check_port_open(MONGO_HOST, MONGO_PORT):
            print(f"✅ MongoDB พร้อม (ความพยายาม {attempt}/{DB_RETRY_ATTEMPTS})")
            mongo_ready = True
            break
        else:
            if attempt < DB_RETRY_ATTEMPTS:
                print(f"⏳ MongoDB ยังไม่พร้อม... รอ {DB_RETRY_DELAY} วินาที (ครั้งที่ {attempt}/{DB_RETRY_ATTEMPTS})")
                time.sleep(DB_RETRY_DELAY)
            else:
                print(f"❌ MongoDB ไม่สามารถเชื่อมต่อหลังจาก {DB_RETRY_ATTEMPTS} ครั้ง")
                print(f"   ตรวจสอบ: MongoDB Service ทำงานอยู่ที่ {MONGO_HOST}:{MONGO_PORT}")
    
    print("\n" + "="*60)
    if mysql_ready and mongo_ready:
        print("✅ ฐานข้อมูลทั้งหมดพร้อมแล้ว!")
    elif mysql_ready:
        print("⚠️  MySQL พร้อม แต่ MongoDB ไม่พร้อม")
    elif mongo_ready:
        print("⚠️  MongoDB พร้อม แต่ MySQL ไม่พร้อม")
    else:
        print("❌ ฐานข้อมูลไม่พร้อม!")
    print("="*60 + "\n")
    
    return mysql_ready or mongo_ready  # Return True ถ้าอย่างน้อยหนึ่งอันพร้อม
