"""
seed_data.py — ใส่ข้อมูลทดสอบเข้า MySQL (Aiven) และ MongoDB (Atlas)
รันด้วย: cd backend && python seed_data.py
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

import bcrypt
import pymysql
from pymongo import MongoClient

# ───────────────── MySQL ─────────────────
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB", "defaultdb")

def get_mysql():
    use_ssl = "aivencloud.com" in (MYSQL_HOST or "")
    ssl_params = {"ssl": {"ssl_mode": "REQUIRED"}} if use_ssl else {}
    return pymysql.connect(
        host=MYSQL_HOST, port=MYSQL_PORT,
        user=MYSQL_USER, password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
        **ssl_params,
    )

def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def seed_mysql():
    print("🔄 Seeding MySQL...")
    conn = get_mysql()
    cur = conn.cursor()

    # ── Roles ──
    cur.execute("INSERT IGNORE INTO Role (RoleName) VALUES ('Admin'),('Mechanic'),('Receptionist'),('Customer')")

    # ── Staff Users ──
    staff_users = [
        ("admin",  hash_pw("admin1234"),  "Admin",  "Manager",    1),
        ("mech1",  hash_pw("mech1234"),   "Boy",    "Fixer",      2),
        ("rec1",   hash_pw("rec1234"),    "Jane",   "Smile",      3),
    ]
    for u in staff_users:
        cur.execute(
            "INSERT IGNORE INTO User (Username,PasswordHash,FirstName,LastName,RoleID) VALUES(%s,%s,%s,%s,%s)", u
        )

    # ── Customers ──
    customers = [
        ("John",    "Doe",    "0801234567", "john@test.com"),
        ("Somchai", "Rakdee", "0899999999", "somchai@test.com"),
    ]
    cust_ids = []
    for c in customers:
        cur.execute("SELECT CustomerID FROM Customer WHERE Phone=%s", (c[2],))
        row = cur.fetchone()
        if row:
            cust_ids.append(row["CustomerID"])
        else:
            cur.execute(
                "INSERT INTO Customer (FirstName,LastName,Phone,Email) VALUES(%s,%s,%s,%s)", c
            )
            cust_ids.append(cur.lastrowid)

    # ── Customer Users ──
    cust_users = [
        ("usr1", hash_pw("usr1234"),  "John",    "Doe",    4, cust_ids[0]),
        ("usr2", hash_pw("usr1234"),  "Somchai", "Rakdee", 4, cust_ids[1]),
    ]
    for u in cust_users:
        cur.execute("SELECT UserID FROM User WHERE Username=%s", (u[0],))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO User (Username,PasswordHash,FirstName,LastName,RoleID,CustomerID) VALUES(%s,%s,%s,%s,%s,%s)", u
            )

    # ── Vehicles ──
    vehicles = [
        (cust_ids[0], "Toyota", "Camry",  2022, "Black",  "ABC-1234"),
        (cust_ids[0], "Honda",  "Civic",  2023, "White",  "ABC-5678"),
        (cust_ids[1], "Isuzu",  "D-Max",  2021, "Silver", "XYZ-9876"),
    ]
    for v in vehicles:
        cur.execute("SELECT VehicleID FROM Vehicle WHERE LicensePlate=%s", (v[5],))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO Vehicle (CustomerID,Make,Model,Year,Color,LicensePlate) VALUES(%s,%s,%s,%s,%s,%s)", v
            )

    # ── Work Orders ──
    cur.execute("SELECT VehicleID FROM Vehicle WHERE LicensePlate='ABC-1234'")
    v1 = cur.fetchone()
    cur.execute("SELECT VehicleID FROM Vehicle WHERE LicensePlate='XYZ-9876'")
    v2 = cur.fetchone()
    cur.execute("SELECT UserID FROM User WHERE Username='mech1'")
    mech = cur.fetchone()
    cur.execute("SELECT UserID FROM User WHERE Username='rec1'")
    rec = cur.fetchone()

    if v1 and mech:
        cur.execute("SELECT WorkOrderID FROM WorkOrder WHERE VehicleID=%s AND Status='Completed' LIMIT 1", (v1["VehicleID"],))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO WorkOrder (VehicleID,UserID,Description,Status,TotalCost) VALUES(%s,%s,%s,%s,%s)",
                (v1["VehicleID"], mech["UserID"], "เปลี่ยนถ่ายน้ำมันเครื่อง + เช็คระยะ 10,000 กม.", "Completed", 2500.00)
            )
    if v2 and rec:
        cur.execute("SELECT WorkOrderID FROM WorkOrder WHERE VehicleID=%s AND Status='In Progress' LIMIT 1", (v2["VehicleID"],))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO WorkOrder (VehicleID,UserID,Description,Status,TotalCost) VALUES(%s,%s,%s,%s,%s)",
                (v2["VehicleID"], rec["UserID"], "ติดตั้งชุดแต่งสเกิร์ตรอบคัน + ล้อแม็ก", "In Progress", 25000.00)
            )

    conn.commit()
    conn.close()
    print("✅ MySQL seed เสร็จ!")

# ───────────────── MongoDB ─────────────────
def seed_mongo():
    print("🔄 Seeding MongoDB...")
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB  = os.getenv("MONGO_DB", "CarCustomShop")

    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    db = client[MONGO_DB]
    col = db["parts"]

    parts = [
        {"part_id": "P001", "name": "น้ำมันเครื่อง Castrol 5W-40",     "category": "Lubricants",   "brand": "Castrol",   "price": 850,   "stock": 50, "compatible_models": ["Toyota Camry", "Honda Civic"]},
        {"part_id": "P002", "name": "ไส้กรองอากาศ",                      "category": "Filters",      "brand": "Bosch",     "price": 450,   "stock": 30, "compatible_models": ["Toyota Camry"]},
        {"part_id": "P003", "name": "ผ้าเบรกหน้า",                       "category": "Brakes",       "brand": "Brembo",    "price": 2200,  "stock": 20, "compatible_models": ["Honda Civic", "Isuzu D-Max"]},
        {"part_id": "P004", "name": "หัวเทียน NGK Iridium",              "category": "Ignition",     "brand": "NGK",       "price": 380,   "stock": 80, "compatible_models": ["Toyota Camry", "Honda Civic"]},
        {"part_id": "P005", "name": "แบตเตอรี่ 70Ah",                    "category": "Electrical",   "brand": "Yuasa",     "price": 3500,  "stock": 15, "compatible_models": ["Toyota Camry", "Isuzu D-Max"]},
        {"part_id": "P006", "name": "ล้อแม็ก 17 นิ้ว",                   "category": "Wheels",       "brand": "Rays",      "price": 8500,  "stock": 8,  "compatible_models": ["Honda Civic"]},
        {"part_id": "P007", "name": "สปอยเลอร์หลัง Carbon",              "category": "Body Parts",   "brand": "TRD",       "price": 12000, "stock": 5,  "compatible_models": ["Toyota Camry"]},
        {"part_id": "P008", "name": "ไส้กรองน้ำมันเครื่อง",              "category": "Filters",      "brand": "Mann",      "price": 280,   "stock": 60, "compatible_models": ["Toyota Camry", "Honda Civic", "Isuzu D-Max"]},
        {"part_id": "P009", "name": "โช้คอัพหน้า",                       "category": "Suspension",   "brand": "KYB",       "price": 4500,  "stock": 12, "compatible_models": ["Honda Civic"]},
        {"part_id": "P010", "name": "ชุดแต่งสเกิร์ตรอบคัน",             "category": "Body Parts",   "brand": "Modulo",    "price": 18000, "stock": 3,  "compatible_models": ["Honda Civic"]},
    ]

    inserted = 0
    for p in parts:
        if not col.find_one({"part_id": p["part_id"]}):
            col.insert_one(p)
            inserted += 1

    client.close()
    print(f"✅ MongoDB seed เสร็จ! เพิ่ม {inserted} parts")

if __name__ == "__main__":
    try:
        seed_mysql()
    except Exception as e:
        print(f"❌ MySQL error: {e}")

    try:
        seed_mongo()
    except Exception as e:
        print(f"❌ MongoDB error: {e}")

    print("\n📋 ข้อมูล Login สำหรับทดสอบ:")
    print("  Admin:  username=admin   password=admin1234")
    print("  Mech:   username=mech1   password=mech1234")
    print("  Staff:  username=rec1    password=rec1234")
    print("  Cust1:  username=usr1    password=usr1234")
    print("  Cust2:  username=usr2    password=usr1234")
