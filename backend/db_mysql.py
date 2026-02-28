import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Get configuration from environment variables
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "yourpass")
MYSQL_DB = os.getenv("MYSQL_DB", "CarCustomShop")

# Lazy connection - ไม่เชื่อมต่อจนกว่าจะมีการใช้งาน
conn = None

def get_connection():
    """สร้างและส่งคืน MySQL connection"""
    try:
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
        print(f"✅ MySQL connected to {MYSQL_HOST}:{MYSQL_PORT}")
        return connection
    except pymysql.Error as e:
        print(f"❌ MySQL connection error: {e}")
        print(f"   Trying to connect to: {MYSQL_HOST}:{MYSQL_PORT}")
        print(f"   User: {MYSQL_USER}")
        raise

def ensure_connection():
    """ตรวจสอบและสร้าง connection ถ้ายังไม่มี"""
    global conn
    if conn is None:
        conn = get_connection()
    else:
        try:
            conn.ping(reconnect=True)
        except:
            conn = get_connection()
    return conn

def query(sql, params=None):
    """Execute SELECT query and return results"""
    try:
        connection = ensure_connection()
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchall()
    except pymysql.Error as e:
        print(f"Query error: {e}")
        raise

def execute(sql, params=None):
    """Execute INSERT/UPDATE/DELETE query"""
    try:
        connection = ensure_connection()
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return {"status": "success"}
    except pymysql.Error as e:
        print(f"Execute error: {e}")
        raise
