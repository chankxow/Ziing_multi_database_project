import mysql.connector
import os

def test_mysql_connection(password):
    """Test MySQL connection with given password"""
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password=password
        )
        conn.close()
        return True
    except Exception as e:
        return False

def create_database_if_not_exists(password):
    """Create the CarCustomShop database if it doesn't exist"""
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password=password
        )
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS CarCustomShop")
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def main():
    print("🔍 MySQL Connection Fix Tool")
    print("=" * 40)
    
    # Common passwords to try
    common_passwords = [
        "",           # No password
        "root",       # Common default
        "password",   # Common default
        "mysql",      # Common default
        "123456",     # Simple numeric
        "admin",      # Common admin
    ]
    
    print("🔐 Testing common MySQL passwords...")
    
    found_password = None
    for pwd in common_passwords:
        pwd_display = pwd if pwd else "(empty)"
        print(f"Testing password: '{pwd_display}'", end=" ... ")
        
        if test_mysql_connection(pwd):
            print("✅ SUCCESS!")
            found_password = pwd
            break
        else:
            print("❌ Failed")
    
    if found_password is not None:
        print(f"\n🎉 Found working password: '{found_password if found_password else '(empty)'}'")
        
        # Create database
        print("📁 Creating CarCustomShop database...")
        if create_database_if_not_exists(found_password):
            print("✅ Database ready!")
            
            # Update .env file
            print("📝 Updating .env file...")
            env_content = f"""# ============================================
# LOCAL BACKEND CONFIGURATION (No Docker)
# ============================================

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py

# MySQL Configuration (Local Installation)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD={found_password}
MYSQL_DB=CarCustomShop

# MongoDB Configuration (Local Installation)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
"""
            
            with open('.env', 'w') as f:
                f.write(env_content)
            
            print("✅ .env file updated!")
            print(f"\n🚀 MySQL is now configured with password: '{found_password if found_password else '(empty)'}'")
            print("🔄 Please restart the backend server to apply changes.")
            
        else:
            print("❌ Failed to create database")
    else:
        print("\n❌ No working password found!")
        print("\n🔧 Manual setup required:")
        print("1. Open MySQL Workbench or command line")
        print("2. Run: ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';")
        print("3. Run: FLUSH PRIVILEGES;")
        print("4. Update the .env file with your password")
        print("5. Restart the backend server")

if __name__ == "__main__":
    main()
