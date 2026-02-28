import os
import subprocess

def create_env_file():
    """Create a new .env file with working credentials"""
    env_content = """# ============================================
# LOCAL BACKEND CONFIGURATION (No Docker)
# ============================================

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py

# MySQL Configuration (Try without password first)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=CarCustomShop

# MongoDB Configuration (Local Installation)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file with empty password")

def test_mysql_commands():
    """Test if we can run MySQL commands"""
    print("🔍 Testing MySQL access...")
    
    # Try to connect without password
    try:
        result = subprocess.run(['mysql', '-u', 'root', '-e', 'SELECT VERSION();'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✅ MySQL accessible without password")
            return True
        else:
            print(f"❌ MySQL error: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ MySQL client not found")
        return False
    except Exception as e:
        print(f"❌ MySQL test failed: {e}")
        return False

def setup_database():
    """Setup the database and tables"""
    print("🗄️ Setting up database...")
    
    try:
        # Read the setup script
        with open('setup_mysql.sql', 'r') as f:
            sql_script = f.read()
        
        # Execute the setup script
        result = subprocess.run(['mysql', '-u', 'root', '-e', sql_script], 
                              capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ Database setup completed")
            print(result.stdout)
            return True
        else:
            print(f"❌ Database setup failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Setup error: {e}")
        return False

def main():
    print("🔧 Quick MySQL Fix Tool")
    print("=" * 40)
    
    # Step 1: Create .env file
    create_env_file()
    
    # Step 2: Test MySQL access
    if test_mysql_commands():
        # Step 3: Setup database
        if setup_database():
            print("\n🎉 SUCCESS! MySQL is now configured")
            print("📝 .env file created with empty password")
            print("🗄️ Database and tables created")
            print("🔄 Please restart the backend server")
            print("\n🚀 Run: python app.py")
        else:
            print("\n❌ Database setup failed")
    else:
        print("\n❌ MySQL access denied")
        print("\n🔧 Manual setup required:")
        print("1. Open MySQL Workbench or command line")
        print("2. Set root password: ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';")
        print("3. Run: FLUSH PRIVILEGES;")
        print("4. Update .env file with the password")
        print("5. Restart backend server")

if __name__ == "__main__":
    main()
