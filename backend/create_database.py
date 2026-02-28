import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Get configuration
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DB = os.getenv("MYSQL_DB", "CarCustomShop")

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect without specifying database first
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            charset='utf8mb4'
        )
        
        with conn.cursor() as cursor:
            # Create database with exact case
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{MYSQL_DB}' created successfully")
            
        conn.close()
        
        # Now connect to the specific database
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB,
            charset='utf8mb4'
        )
        
        with conn.cursor() as cursor:
            # Create Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    email VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("✅ Users table created successfully")
            
            # Create other tables
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Customer (
                    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
                    FirstName VARCHAR(50) NOT NULL,
                    LastName VARCHAR(50) NOT NULL,
                    Phone VARCHAR(20),
                    Email VARCHAR(100),
                    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("✅ Customer table created successfully")
            
        conn.commit()
        conn.close()
        
        print(f"🎉 Database setup completed for '{MYSQL_DB}'")
        
    except pymysql.Error as e:
        print(f"❌ Database creation error: {e}")

if __name__ == "__main__":
    create_database()
