from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, create_refresh_token
)
import bcrypt

from db_mysql import query, execute
from db_mongo import get_parts_collection
from config import check_db_connection

app = Flask(__name__)
CORS(app)   # 🔥 สำคัญมากสำหรับ React

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for demo
jwt = JWTManager(app)

# ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่ม
check_db_connection()

# =========================
# Root Test
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend Running 🚀"})

# =========================
# Authentication API
# =========================
@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.json
        username = body.get("username")
        password = body.get("password")
        email = body.get("email")
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
        
        # Check if user already exists
        existing_user = query("SELECT * FROM Users WHERE username = %s", (username,))
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        sql = """
            INSERT INTO Users (username, password_hash, email, created_at)
            VALUES (%s, %s, %s, NOW())
        """
        execute(sql, (username, password_hash, email))
        
        return jsonify({"message": "User created successfully"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        body = request.json
        username = body.get("username")
        password = body.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
        
        # Get user from database
        users = query("SELECT * FROM Users WHERE username = %s", (username,))
        if not users:
            return jsonify({"error": "Invalid credentials"}), 401
        
        user = users[0]
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Create access token
        access_token = create_access_token(identity=username)
        
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email']
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    try:
        current_user = get_jwt_identity()
        users = query("SELECT id, username, email, created_at FROM Users WHERE username = %s", (current_user,))
        if not users:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"user": users[0]})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# Customers API (MySQL)
# =========================
@app.route("/customers", methods=["GET"])
@jwt_required()
def get_customers():
    try:
        data = query("SELECT * FROM Customer")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/customers", methods=["POST"])
@jwt_required()
def add_customer():
    try:
        body = request.json

        sql = """
            INSERT INTO Customer (FirstName, LastName, Phone, Email)
            VALUES (%s, %s, %s, %s)
        """

        execute(sql, (
            body["FirstName"],
            body["LastName"],
            body["Phone"],
            body["Email"]
        ))

        return jsonify({"status": "added"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# =========================
# Vehicles API (MySQL)
# =========================
@app.route("/vehicles", methods=["GET"])
@jwt_required()
def get_vehicles():
    try:
        data = query("SELECT * FROM Vehicle")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# Parts API (MongoDB)
# =========================
@app.route("/parts", methods=["GET"])
@jwt_required()
def get_parts():
    try:
        parts_collection = get_parts_collection()
        parts = list(parts_collection.find({}, {"_id": 0}))
        return jsonify(parts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/parts", methods=["POST"])
@jwt_required()
def add_part():
    try:
        body = request.json
        parts_collection = get_parts_collection()
        parts_collection.insert_one(body)
        return jsonify({"status": "part added"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# Work Orders API (MySQL)
# =========================
@app.route("/workorders", methods=["GET"])
@jwt_required()
def get_workorders():
    try:
        data = query("SELECT * FROM WorkOrder")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# Error Handling
# =========================
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error": str(e)}), 500

# =========================
# Run Server
# =========================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
