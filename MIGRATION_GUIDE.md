# Migration Guide: From v1.0 to v2.0

This guide helps you migrate from the old project structure to the new enhanced architecture.

## 🔄 Migration Steps

### 1. Backup Current Project
```bash
# Create a backup of your current project
cp -r Ziing_multi_database_project Ziing_multi_database_project_backup
```

### 2. Update Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Setup New Environment
```bash
# Generate secure environment variables
python setup_security.py

# This creates a new .env file with secure keys
```

### 4. Database Migration
The database schema remains compatible, but you may need to add the users table:

```sql
-- Add users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'mechanic', 'customer') DEFAULT 'customer',
    customer_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);
```

### 5. Frontend Dependencies
```bash
cd frontend
npm install
```

### 6. Configuration Updates

#### Backend Configuration Changes
- Old: `config.py` → New: `config_new.py`
- Old: `app.py` → New: `app_new.py`
- New: `database.py` (consolidated database connections)

#### Frontend Structure Changes
- New component-based architecture in `src/components/ui/`
- New TypeScript definitions in `src/types/`
- New API services in `src/services/`

### 7. Running the New Version

#### Backend
```bash
cd backend
source .venv/bin/activate  # If using virtual environment
python app_new.py
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 🔄 API Changes

### Authentication
New authentication endpoints are required:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh

All endpoints now require JWT authentication (except auth endpoints).

### Header Changes
All API requests now need:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 🔄 Breaking Changes

### Backend
1. **Authentication Required**: All endpoints now require JWT authentication
2. **New Response Format**: Consistent JSON response format
3. **Enhanced Error Handling**: Better error messages and status codes

### Frontend
1. **New Dependencies**: Added modern React libraries
2. **TypeScript**: Full TypeScript support
3. **Component Structure**: New reusable component architecture

## 🔄 Data Migration

### Existing Data
Your existing data in MySQL and MongoDB remains compatible. No data migration is required.

### User Accounts
You'll need to create user accounts for the new authentication system:

```python
# Example: Create admin user
from services.auth_service import AuthService

admin_data = {
    'username': 'admin',
    'email': 'admin@example.com',
    'password': 'secure_password',
    'role': 'admin'
}

user = AuthService.create_user(admin_data)
```

## 🔄 Testing the Migration

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Authentication Test
```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

### 3. API Test with Token
```bash
# Use the token from login response
curl -X GET http://localhost:5000/customers \
  -H "Authorization: Bearer <your_jwt_token>"
```

## 🔄 Rollback Plan

If you need to rollback to v1.0:

1. **Stop v2.0 services**
2. **Restore from backup**: `cp -r Ziing_multi_database_project_backup Ziing_multi_database_project`
3. **Start v1.0 services**:
   - Backend: `python app.py`
   - Frontend: `npm run dev`

## 🔄 Support

For migration issues:
1. Check logs: `backend/logs/app.log`
2. Verify database connections
3. Ensure environment variables are set correctly
4. Create an issue with detailed error information

---

**Migration typically takes 15-30 minutes depending on your setup.**
