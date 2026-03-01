from flask import Flask, jsonify, request
from flask_cors import CORS
import traceback
from db_mysql import query, execute
from db_mongo import get_parts_collection
from config import check_db_connection

import jwt
import datetime
from config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRATION_HOURS

import bcrypt

from functools import wraps

app = Flask(__name__)
CORS(app)   # 🔥 สำคัญมากสำหรับ React

# ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่ม
check_db_connection()

# =========================
# JWT Middleware
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # ดึง token จาก Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({"error": "Bearer token malformed"}), 401
        
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            # ตรวจสอบและ decode token
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            current_user_id = data['user_id']
            current_user_role = data['role']
            
            # เพิ่ม user info ลงใน request context
            request.current_user_id = current_user_id
            request.current_user_role = current_user_role
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token is invalid"}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(request, 'current_user_role'):
                return jsonify({"error": "User role not found"}), 401
            
            if request.current_user_role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# =========================
# Root Test
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend Running 🚀"})

# =========================
# Customers API (MySQL)
# =========================
@app.route("/customers", methods=["GET"])
def get_customers():
    try:
        data = query("SELECT * FROM Customer")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/customers", methods=["POST"])
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
def get_parts():
    try:
        parts_collection = get_parts_collection()
        parts = list(parts_collection.find({}, {"_id": 0}))
        return jsonify(parts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/parts", methods=["POST"])
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
def get_workorders():
    try:
        data = query("SELECT * FROM WorkOrder")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# POST /login
@app.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    try:
        body = request.get_json()
        if not body:
            return jsonify({"error": "Invalid JSON"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to parse JSON"}), 400
    
    try:
        # ค้น User จาก Username
        print(f"DEBUG: Searching for user: {body['username']}")
        user = query("SELECT * FROM User WHERE Username = %s", (body["username"],))
        print(f"DEBUG: User found: {len(user) if user else 0}")
        
        if not user:
            print("DEBUG: User not found")
            return jsonify({"error": "Invalid credentials"}), 401
            
        user_data = user[0]
        print(f"DEBUG: User data keys: {list(user_data.keys())}")
        print(f"DEBUG: User role: {user_data.get('RoleID')}")
        
        # ตรวจสอบ password ด้วย bcrypt
        password_bytes = body["password"].encode('utf-8')
        stored_hash = user_data["PasswordHash"]
        print(f"DEBUG: Stored hash type: {type(stored_hash)}")
        
        # ถ้าเก็บเป็น string ใน DB ให้แปลงเป็น bytes
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
        
        print("DEBUG: Checking password...")
        try:
            # Debug: แสดง hash ที่ได้จาก DB
            print(f"DEBUG: Original hash from DB: '{stored_hash}'")
            print(f"DEBUG: Hash bytes: {stored_hash}")
            print(f"DEBUG: Hash repr: {repr(stored_hash)}")
            
            if not bcrypt.checkpw(password_bytes, stored_hash):
                print("DEBUG: Password check failed")
                return jsonify({"error": "Invalid credentials"}), 401
            print("DEBUG: Password check passed")
        except Exception as bcrypt_error:
            print(f"DEBUG: Bcrypt error: {str(bcrypt_error)}")
            print(f"DEBUG: Error type: {type(bcrypt_error)}")
            return jsonify({"error": "Password verification failed"}), 500
        
        # สร้าง JWT token
        token_payload = {
            "user_id": user_data["UserID"],
            "username": user_data["Username"],
            "role": user_data["RoleID"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_HOURS)
        }
        
        token = jwt.encode(token_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user_data["UserID"],
                "username": user_data["Username"],
                "role": user_data["RoleID"]
            }
        })
        
    except Exception as e:
        return jsonify({"error": "Login failed"}), 500
# POST /register
@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.json
        # ตรวจสอบว่า username ซ้ำไหม
        existing = query("SELECT UserID FROM User WHERE Username = %s", (body["username"],))
        if existing:
            return jsonify({"error": "Username already exists"}), 400
        
        # Hash password ด้วย bcrypt
        hashed_password = bcrypt.hashpw(body["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"DEBUG: Generated hash: {hashed_password}")
        print(f"DEBUG: Hash length: {len(hashed_password)}")
        
        # สร้างผู้ใช้ใหม่พร้อม password ที่ hash แล้ว
        execute(
            "INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s, %s, %s, %s, %s)",
            (body["username"], hashed_password, body.get("firstName", ""), body.get("lastName", ""), 3)  # RoleID=3 = Receptionist
        )
        
        # ตรวจสอบว่า hash ถูกเก็บไว้เต็มๆ หรือไม่
        saved_user = query("SELECT PasswordHash, LENGTH(PasswordHash) FROM User WHERE Username = %s", (body["username"],))
        if saved_user:
            print(f"DEBUG: Saved hash: {saved_user[0]['PasswordHash']}")
            print(f"DEBUG: Saved hash length: {saved_user[0]['LENGTH(PasswordHash)']}")
        
        return jsonify({"status": "registered", "username": body["username"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Protected route - ต้องมี token
@app.route("/protected", methods=["GET"])
@token_required
def protected_route():
    return jsonify({"message": "This is a protected route", "user_id": request.current_user_id})

# Admin only route
@app.route("/admin-only", methods=["GET"])
@token_required
@role_required(1)  # RoleID=1 = Admin
def admin_only_route():
    return jsonify({"message": "Admin only route"})
    

# =========================
# Error Handling
# =========================
@app.errorhandler(Exception)
def handle_error(e):
    traceback.print_exc()  
    return jsonify({"error": "Internal Server Error"}), 500

@app.route('/favicon.ico')
def favicon():
    return '', 204
# =========================
# Run Server
# =========================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
