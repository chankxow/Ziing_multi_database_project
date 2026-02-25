# 🚗 Car Customization Project - Multi-Database System

## Project Overview

This is a Full-Stack application for managing a car customization shop using modern technologies:
- **Backend**: Flask (Python)
- **Databases**: MySQL + MongoDB
- **Frontend**: React + TypeScript + Vite
- **Infrastructure**: Docker + Docker Compose OR Local Development

### Purpose
Manage customers, vehicles, parts, and work orders using databases optimized for each data type.

---

## 🚀 Quick Start

### ✅ Option 1: Local Development (Recommended for Beginners)

**Prerequisites:**
- Python 3.8+
- Node.js 16+
- MySQL Server
- MongoDB

**Windows:**
```bash
start-local.bat
```

**Linux/Mac:**
```bash
chmod +x start-local.sh
./start-local.sh
```

👉 **[See Local Setup Guide](LOCAL-SETUP.md)** for complete instructions

### 🐳 Option 2: Docker Setup (For Containerized Environment)

**Prerequisites:**
- Docker Desktop installed
- ~10GB free disk space

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Access Services
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306 (local) or localhost:3307 (docker)
- **MongoDB**: localhost:27017

---

## 📦 Project Structure

```
Ziing_multi_database_project/
├── backend/                    # Flask Backend
│   ├── app.py                 # Main application file
│   ├── config.py              # Environment configuration
│   ├── db_mysql.py            # MySQL connector
│   ├── db_mongo.py            # MongoDB connector
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker build file
│   ├── sql/                   # Database initialization scripts
│   ├── .env                   # Environment variables (not tracked)
│   └── .dockerignore          # Files to ignore in Docker build
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/                   # React components
│   ├── public/                # Static files
│   ├── index.html             # Main HTML file
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── Dockerfile             # Docker build file
│
├── docker-compose.yml         # Docker orchestration file
├── .gitignore                 # Git ignore rules
├── .env.example               # Example environment file
├── README.md                  # This file
├── QUICKSTART.md              # Quick start guide
├── start.bat                  # Startup script for Windows
└── start.sh                   # Startup script for Linux/Mac
```

---

## 🗄️ Databases

### MySQL - Relational Data
Used for:
- **Customers**: Personal information, contact details
- **Vehicles**: Model, year, license plate
- **WorkOrders**: Job details, status, cost

### MongoDB - Flexible Data
Used for:
- **Parts**: Part information, prices, inventory

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|---|
| GET | `/` | Server health check |
| GET | `/customers` | Get all customers |
| POST | `/customers` | Add new customer |
| GET | `/vehicles` | Get all vehicles |
| GET | `/workorders` | Get all work orders |
| GET | `/parts` | Get all parts (MongoDB) |
| POST | `/parts` | Add new part (MongoDB) |

---

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f mongodb
```

### Access Databases
```bash
# MySQL
docker-compose exec mysql mysql -u shopuser -pshoppass CarCustomShop

# MongoDB
docker-compose exec mongodb mongosh admin --username admin --password adminpass
```

### Stop Services
```bash
# Stop all
docker-compose down

# Remove all data (WARNING: deletes databases)
docker-compose down -v
```

---

## 🔧 Configuration

### .env File for Environment Variables
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py

# MySQL Configuration (Localhost)
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
MYSQL_DB=CarCustomShop

# MongoDB Configuration (Localhost)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
```

---

## 🔒 Security

- **Do not share .env files** in version control
- **Change passwords** in environment configuration
- **Never hardcode credentials** in code
- Use `.gitignore` to prevent sensitive files from being tracked

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 👥 Team Members

- **Chankxow**: Dev
- **puriwat2953**: Dev
- **Ampser**: Dev

---

## 💡 Note

This project was created for educational purposes to understand:
- Multi-Database Systems
- Docker & Container Technology
- Full-Stack Development
- Python Flask Framework
- React TypeScript Development

---

## 📞 Support

If you have questions or issues:
1. Check the Docker logs with `docker-compose logs -f`
2. Verify all services are running with `docker-compose ps`
3. Create an issue with detailed description

---

**Last Updated**: February 2026
**Version**: 0.0.2B-T (Localhost Only)