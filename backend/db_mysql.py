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

# Create connection
def get_connection():
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
        return conn
    except pymysql.Error as e:
        print(f"Database connection error: {e}")
        raise

conn = get_connection()

def query(sql, params=None):
    """Execute SELECT query and return results"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchall()
    except pymysql.Error as e:
        print(f"Query error: {e}")
        raise

def execute(sql, params=None):
    """Execute INSERT/UPDATE/DELETE query"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
            return {"status": "success"}
    except pymysql.Error as e:
        print(f"Execute error: {e}")
        raise
