import pymysql
import os
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Get configuration from environment variables
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DB = os.getenv("MYSQL_DB", "CarCustomShop")

# Lazy connection - only connect when needed
conn = None

def get_connection():
    """Create and return MySQL connection"""
    global conn
    if conn is None:
        try:
            conn = pymysql.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DB,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
            print(f"✅ MySQL connected successfully")
        except pymysql.Error as e:
            print(f"❌ MySQL connection error: {e}")
            conn = None
    return conn

def ensure_connection():
    """Ensure connection exists"""
    global conn
    if conn is None:
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
            connection.commit()
            print(f"✅ Query executed successfully")
    except pymysql.Error as e:
        print(f"Execute error: {e}")
        connection.rollback()
        raise

def close_connection():
    """Close database connection"""
    global conn
    if conn is not None:
        conn.close()
        conn = None
        print("✅ MySQL connection closed")
