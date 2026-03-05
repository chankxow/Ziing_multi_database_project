import os
import secrets
from datetime import datetime, timedelta

def generate_secret_key(length=32):
    """Generate a secure secret key"""
    return secrets.token_hex(length)

def generate_jwt_secret(length=64):
    """Generate a secure JWT secret key"""
    return secrets.token_urlsafe(length)

def create_env_file():
    """Create a secure .env file with generated secrets"""
    env_content = f"""# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app_new.py
SECRET_KEY={generate_secret_key()}

# JWT Configuration
JWT_SECRET_KEY={generate_jwt_secret()}
JWT_EXPIRATION_HOURS=24

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
MYSQL_DB=CarCustomShop

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop

# Security Settings
BCRYPT_LOG_ROUNDS=12

# CORS Settings
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_STORAGE_URL=memory://
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Secure .env file created with generated secrets")
    print("🔒 Please review and update database credentials as needed")

def create_production_env():
    """Create production environment variables"""
    env_content = f"""# Production Configuration
FLASK_ENV=production
FLASK_DEBUG=0
FLASK_APP=app_new.py
SECRET_KEY={generate_secret_key()}

# JWT Configuration
JWT_SECRET_KEY={generate_jwt_secret()}
JWT_EXPIRATION_HOURS=8

# Database Configuration (Update with your production values)
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DB=CarCustomShop

MONGO_HOST=your-mongo-host
MONGO_PORT=27017
MONGO_DB=CarCustomShop

# Security Settings
BCRYPT_LOG_ROUNDS=14

# CORS Settings (Update with your frontend domain)
CORS_ORIGINS=https://yourdomain.com

# Logging
LOG_LEVEL=WARNING
LOG_FILE=/var/log/car_custom_shop/app.log

# Rate Limiting
RATE_LIMIT_STORAGE_URL=redis://localhost:6379
"""
    
    with open('.env.production', 'w') as f:
        f.write(env_content)
    
    print("✅ Production .env file created")
    print("🔒 Please update with your actual production values")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == 'production':
        create_production_env()
    else:
        create_env_file()
