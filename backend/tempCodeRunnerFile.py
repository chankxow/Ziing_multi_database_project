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
CORS(app)
check_db_connection()

# =========================
# JWT Middleware
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            try:
                token = request.headers["Authorization"].split(" ")[1]
            except IndexError:
                return jsonify({"error": "Bearer token malformed"}), 401
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.current_user_id     = data["user_id"]
            request.current_user_role   = data["role"]
            request.current_customer_id = data.get("customer_id")
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
            if not hasattr(request, "current_user_role"):
                return jsonify({"error": "User role not found"}), 401
            if request.current_user_role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route("/")
def home():
    return jsonify({"message": "Backend Running"})

# =========================
# Auth
# =========================
@app.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    body = request.get_json()
    if not body:
        return jsonify({"error": "Invalid JSON"}), 400
    try:
        user = query(
            "SELECT u.*, r.RoleName FROM User u JOIN Role r ON u.RoleID = r.RoleID WHERE u.Username = %s",
            (body["username"],)
        )
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        ud = user[0]
        stored_hash = ud["PasswordHash"]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode("utf-8")
        if not bcrypt.checkpw(body["password"].encode("utf-8"), stored_hash):
            return jsonify({"error": "Invalid credentials"}), 401
        payload = {
            "user_id":     ud["UserID"],
            "username":    ud["Username"],
            "role":        ud["RoleID"],
            "customer_id": ud.get("CustomerID"),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id":     ud["UserID"],
                "username":    ud["Username"],
                "role":        ud["RoleID"],
                "role_name":   ud["RoleName"],
                "customer_id": ud.get("CustomerID"),
            },
        })
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Login failed"}), 500


@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.json
        if query("SELECT UserID FROM User WHERE Username = %s", (body["username"],)):
            return jsonify({"error": "Username already exists"}), 400
        hashed = bcrypt.hashpw(body["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        execute(
            "INSERT INTO User (Username,PasswordHash,FirstName,LastName,RoleID,CustomerID) VALUES(%s,%s,%s,%s,%s,%s)",
            (body["username"], hashed, body.get("firstName",""), body.get("lastName",""),
             body.get("role_id", 3), body.get("customer_id"))
        )
        return jsonify({"status": "registered", "username": body["username"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# DASHBOARD APIs
# =========================

@app.route("/users/staff", methods=["GET"])
@token_required
@role_required(1)
def get_staff_list():
    """GET /users/staff — รายชื่อ staff ทั้งหมด พร้อม role"""
    try:
        rows = query("""
            SELECT u.UserID, u.Username, u.FirstName, u.LastName,
                   u.IsActive, u.CreatedDate, r.RoleID, r.RoleName
            FROM User u
            JOIN Role r ON u.RoleID = r.RoleID
            WHERE r.RoleID IN (1,2,3)
            ORDER BY r.RoleID, u.FirstName
        """)
        for r in rows:
            r["CreatedDate"] = str(r["CreatedDate"])
        return jsonify(rows)
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/users/staff", methods=["POST"])
@token_required
@role_required(1)
def create_staff():
    """
    POST /users/staff
    Body: { username, password, firstName, lastName, role_id }
    role_id: 1=Admin, 2=Mechanic, 3=Receptionist
    """
    try:
        b = request.json
        for f in ["username", "password", "firstName", "lastName", "role_id"]:
            if not b.get(f):
                return jsonify({"error": f"Missing: {f}"}), 400
        role_id = int(b["role_id"])
        if role_id not in (1, 2, 3):
            return jsonify({"error": "role_id ต้องเป็น 1, 2 หรือ 3"}), 400
        if query("SELECT UserID FROM User WHERE Username = %s", (b["username"],)):
            return jsonify({"error": "Username already exists"}), 400
