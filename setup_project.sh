#!/bin/bash

# Car Customization Shop - Project Setup Script
# This script sets up the entire project with the new structure

echo "🚗 Car Customization Shop - Project Setup Script"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL might not be installed or running."
    echo "   Please ensure MySQL is running on localhost:3306"
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB might not be installed or running."
    echo "   Please ensure MongoDB is running on localhost:27017"
fi

echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "   Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "   Installing Python dependencies..."
pip install -r requirements.txt

# Setup secure environment
echo "   Setting up secure environment..."
python setup_security.py

# Create logs directory
mkdir -p logs

echo "✅ Backend setup complete!"
echo ""

echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
echo "   Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🗄️ Database Setup Instructions:"
echo "   1. Make sure MySQL is running on localhost:3306"
echo "   2. Make sure MongoDB is running on localhost:27017"
echo "   3. Import the SQL schema: mysql -u shopuser -p CarCustomShop < backend/sql/init.sql"
echo "   4. Run the seed script: python backend/seed_mongo.py"
echo ""

echo "🚀 Starting Instructions:"
echo "   1. Backend: cd backend && source .venv/bin/activate && python app_new.py"
echo "   2. Frontend: cd frontend && npm run dev"
echo "   3. Access: http://localhost:5173 (Frontend) and http://localhost:5000 (Backend API)"
echo ""

echo "📚 Documentation:"
echo "   - Read README_NEW.md for detailed information"
echo "   - Check backend/logs/app.log for application logs"
echo "   - API documentation available at http://localhost:5000"
echo ""

echo "✅ Project setup complete!"
echo "🎉 Your Car Customization Shop is ready to run!"
