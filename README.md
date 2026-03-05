# 🚗 Car Customization Project - Multi-Database System v2.0

## Project Overview

This is a **Full-Stack application** for managing a car customization shop using modern technologies with enhanced architecture and security:

- **Backend**: Flask (Python) with modular architecture
- **Databases**: MySQL + MongoDB (Localhost)
- **Frontend**: React + TypeScript + Vite with component-based structure
- **Infrastructure**: Local Development Only (No Docker)

### Purpose
Manage customers, vehicles, parts, and work orders using databases optimized for each data type with improved scalability and maintainability.

---

## 🚀 Quick Start

### ✅ Local Development Setup (Standalone)

**Prerequisites:**
- Python 3.8+
- Node.js 16+
- MySQL Server (running on localhost:3306)
- MongoDB (running on localhost:27017)

### 📋 Setup Instructions

**Step 1: Start Databases**
```bash
# Make sure MySQL and MongoDB services are running
# MySQL: localhost:3306
# MongoDB: localhost:27017
```

**Step 2: Backend Setup**
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup secure environment
python setup_security.py

# Start the application
python app_new.py
# Backend runs on http://localhost:5000
```

**Step 3: Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Access Services
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Health Check**: http://localhost:5000/health
- **MySQL**: localhost:3306
- **MongoDB**: localhost:27017

---

## 📦 Project Structure v2.0

```
Ziing_multi_database_project/
├── backend/                           # Flask Backend (Modular Architecture)
│   ├── app_new.py                     # New main application file
│   ├── config_new.py                  # Enhanced configuration
│   ├── database.py                    # Database connection management
│   ├── setup_security.py              # Security setup script
│   ├── models/                        # Data models
│   │   ├── __init__.py
│   │   ├── customer.py
│   │   ├── vehicle.py
│   │   ├── work_order.py
│   │   ├── part.py
│   │   └── user.py
│   ├── routes/                        # API routes
│   │   ├── __init__.py
│   │   ├── auth_routes.py
│   │   ├── customer_routes.py
│   │   ├── vehicle_routes.py
│   │   ├── work_order_routes.py
│   │   └── part_routes.py
│   ├── services/                      # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── customer_service.py
│   │   ├── vehicle_service.py
│   │   ├── work_order_service.py
│   │   └── part_service.py
│   ├── middleware/                    # Request middleware
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── error_handler.py
│   │   └── validation.py
│   ├── validators/                    # Data validation schemas
│   │   ├── __init__.py
│   │   ├── customer_schema.py
│   │   ├── vehicle_schema.py
│   │   ├── work_order_schema.py
│   │   └── part_schema.py
│   ├── utils/                         # Utility functions
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   ├── helpers.py
│   │   └── logger.py
│   ├── sql/                          # Database initialization scripts
│   │   ├── init.sql
│   │   └── insert_test_users.sql
│   ├── requirements.txt               # Python dependencies
│   ├── .env.template                 # Environment template
│   └── .env                          # Environment variables (not tracked)
│
├── frontend/                         # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── Alert.tsx
│   │   │   ├── forms/                # Form components
│   │   │   └── layout/               # Layout components
│   │   ├── pages/                    # Page components
│   │   │   ├── auth/                 # Authentication pages
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── customers/            # Customer pages
│   │   │   ├── vehicles/             # Vehicle pages
│   │   │   ├── workorders/           # Work order pages
│   │   │   └── parts/                # Part pages
│   │   ├── services/                 # API services
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── customers.ts
│   │   │   ├── vehicles.ts
│   │   │   ├── workorders.ts
│   │   │   └── parts.ts
│   │   ├── types/                    # TypeScript definitions
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── customer.ts
│   │   │   ├── vehicle.ts
│   │   │   ├── workorder.ts
│   │   │   └── part.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utility libraries
│   │   │   └── utils.ts
│   │   ├── store/                    # State management
│   │   └── contexts/                 # React contexts
│   ├── public/                       # Static files
│   ├── index.html                    # Main HTML file
│   ├── package.json                  # Node.js dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── .env                          # Environment variables
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── Documentation.md                  # Full documentation
```

---

## 🗄️ Databases

### MySQL - Relational Data (localhost:3306)
Used for:
- **Customers**: Personal information, contact details
- **Vehicles**: Model, year, license plate
- **WorkOrders**: Job details, status, cost
- **Users**: Authentication and authorization

### MongoDB - Flexible Data (localhost:27017)
Used for:
- **Parts**: Part information, prices, inventory, compatibility

---

## 📡 API Endpoints v2.0

### Authentication
| Method | Endpoint | Description |
|--------|----------|---|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/verify` | Verify token validity |

### Customers
| Method | Endpoint | Description | Auth Required |
|--------|----------|---|---|
| GET | `/customers` | Get all customers | Admin, Manager, Mechanic |
| GET | `/customers/{id}` | Get customer by ID | Customer (own), Admin, Manager, Mechanic |
| POST | `/customers` | Create new customer | Admin, Manager |
| PUT | `/customers/{id}` | Update customer | Admin, Manager |
| DELETE | `/customers/{id}` | Delete customer | Admin |

### Vehicles
| Method | Endpoint | Description | Auth Required |
|--------|----------|---|---|
| GET | `/vehicles` | Get all vehicles | Admin, Manager, Mechanic |
| GET | `/vehicles/{id}` | Get vehicle by ID | Customer (own), Admin, Manager, Mechanic |
| GET | `/vehicles/customer/{id}` | Get vehicles by customer | Customer (own), Admin, Manager, Mechanic |
| POST | `/vehicles` | Create new vehicle | Admin, Manager, Mechanic |
| PUT | `/vehicles/{id}` | Update vehicle | Admin, Manager, Mechanic |
| DELETE | `/vehicles/{id}` | Delete vehicle | Admin |

### Work Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|---|---|
| GET | `/workorders` | Get all work orders | Admin, Manager, Mechanic |
| GET | `/workorders/{id}` | Get work order by ID | Customer (own), Admin, Manager, Mechanic |
| GET | `/workorders/customer/{id}` | Get work orders by customer | Customer (own), Admin, Manager, Mechanic |
| POST | `/workorders` | Create new work order | Admin, Manager, Mechanic |
| PUT | `/workorders/{id}` | Update work order | Admin, Manager, Mechanic |
| PATCH | `/workorders/{id}/status` | Update work order status | Admin, Manager, Mechanic |
| DELETE | `/workorders/{id}` | Delete work order | Admin |

### Parts
| Method | Endpoint | Description | Auth Required |
|--------|----------|---|---|
| GET | `/parts` | Get all parts | All authenticated users |
| GET | `/parts/{id}` | Get part by ID | All authenticated users |
| GET | `/parts/category/{category}` | Get parts by category | All authenticated users |
| GET | `/parts/search` | Search parts | All authenticated users |
| POST | `/parts` | Create new part | Admin, Manager |
| PUT | `/parts/{id}` | Update part | Admin, Manager |
| PATCH | `/parts/{id}/inventory` | Update inventory | Admin, Manager |
| DELETE | `/parts/{id}` | Delete part | Admin |

---

## 🔒 Security Features v2.0

### Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **Role-based access control** (Admin, Manager, Mechanic, Customer)
- **Password hashing** with bcrypt
- **Token refresh mechanism**

### API Security
- **Rate limiting** (200 requests/day, 50/hour)
- **CORS protection** with configurable origins
- **Input validation** using Marshmallow schemas
- **SQL injection prevention** with parameterized queries
- **Error handling** without information leakage

### Environment Security
- **Secure secret key generation**
- **Environment-based configuration**
- **Production-ready security settings**
- **Logging for security events**

---

## 🔧 Configuration

### Environment Variables
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app_new.py
SECRET_KEY=your-secret-key-here

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
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
```

---

## 🛠️ Development Tools

### Backend Development
```bash
# Install new dependencies
pip install -r requirements.txt

# Setup secure environment
python setup_security.py

# Run with new structure
python app_new.py

# Check database connections
python -c "from database import check_db_connection; check_db_connection()"
```

### Frontend Development
```bash
# Install enhanced dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

---

## 📊 Monitoring & Logging

### Backend Logging
- **Structured logging** with timestamps
- **File-based logging** in `logs/` directory
- **Security event logging**
- **Database operation logging**
- **Error tracking** with stack traces

### Health Monitoring
- **Health check endpoint** at `/health`
- **Database connection monitoring**
- **Application metrics** (future enhancement)

---

## 🚀 Deployment Considerations

### Production Setup
1. **Use production configuration**: `FLASK_ENV=production`
2. **Generate production secrets**: `python setup_security.py production`
3. **Configure reverse proxy** (nginx/Apache)
4. **Set up SSL/TLS certificates**
5. **Configure production databases**
6. **Set up monitoring and alerting**

### Security Checklist
- [ ] Change default passwords
- [ ] Update CORS origins
- [ ] Configure proper logging
- [ ] Set up backup strategies
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up intrusion detection

---

## 🤝 Contributing v2.0

### Development Workflow
1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Follow the new structure** when adding code
3. **Write tests** for new functionality
4. **Update documentation** for API changes
5. **Commit changes**: `git commit -m 'Add some feature'`
6. **Push to branch**: `git push origin feature/your-feature`
7. **Open Pull Request**

### Code Standards
- **Backend**: Follow PEP 8, use type hints
- **Frontend**: Use TypeScript, follow React best practices
- **Documentation**: Update README and API docs
- **Testing**: Write unit and integration tests

---

## 👥 Team Members

- **Chankxow**: Dev
- **puriwat2953**: Dev
- **Ampser**: Dev

---

## 💡 Version 2.0 Improvements

### Backend Enhancements
- ✅ **Modular architecture** with separation of concerns
- ✅ **Enhanced security** with JWT and role-based access
- ✅ **Proper error handling** and logging
- ✅ **Data validation** with Marshmallow schemas
- ✅ **Rate limiting** and CORS protection
- ✅ **Configuration management** for different environments

### Frontend Enhancements
- ✅ **Component-based architecture** with reusable UI components
- ✅ **TypeScript support** for better type safety
- ✅ **Modern React patterns** with hooks and contexts
- ✅ **Enhanced dependency management** with modern libraries
- ✅ **Scalable folder structure** for better maintainability

### Security Improvements
- ✅ **Secure secret key generation**
- ✅ **Environment-based configuration**
- ✅ **Input validation and sanitization**
- ✅ **Authentication middleware**
- ✅ **Security event logging**

---

## 📞 Support

If you have questions or issues:
1. **Check the logs**: `tail -f backend/logs/app.log`
2. **Verify database connections**: Check MySQL and MongoDB status
3. **Review environment configuration**: Ensure `.env` is properly set
4. **Create an issue** with detailed description and logs

---

**Last Updated**: March 2026
**Version**: 2.0.0 (Enhanced Architecture)
**Status**: Production Ready
