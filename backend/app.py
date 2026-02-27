from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import timedelta

from db_mysql import query, execute
from db_mongo import get_parts_collection
from config import check_db_connection

app = Flask(__name__)
CORS(app)  # 🔥 สำคัญมากสำหรับ React

# =========================
# JWT + Auth (ภายในไฟล์เดียว)
# =========================
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(hashed_password: str, password: str) -> bool:
    return check_password_hash(hashed_password, password)


def get_user_role(user_id: int):
    try:
        result = query("SELECT Role FROM User WHERE UserID = %s", (user_id,))
        return result[0]['Role'] if result else None
    except Exception:
        return None


def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user_role = get_user_role(current_user_id)
            if user_role not in allowed_roles:
                return jsonify({"error": "สิทธิ์การเข้าถึงไม่เพียงพอ"}), 403
            return f(*args, **kwargs)

        return decorated_function

    return decorator


def authenticate_user(username: str, password: str):
    result = query(
        "SELECT UserID, Username, PasswordHash, Role FROM User WHERE Username = %s",
        (username,),
    )
    if not result:
        return None

    user = result[0]
    if not verify_password(user['PasswordHash'], password):
        return None

    access_token = create_access_token(identity=user['UserID'])
    return {
        'access_token': access_token,
        'user': {
            'id': user['UserID'],
            'username': user['Username'],
            'role': user['Role'],
        },
    }


def create_user(username: str, password: str, role: str, email=None, full_name=None):
    existing = query("SELECT UserID FROM User WHERE Username = %s", (username,))
    if existing:
        return False, "ชื่อผู้ใช้นี้มีอยู่แล้ว"

    password_hash = hash_password(password)
    sql = """
        INSERT INTO User (Username, PasswordHash, Role, Email, FullName, CreatedDate)
        VALUES (%s, %s, %s, %s, %s, NOW())
    """
    execute(sql, (username, password_hash, role, email, full_name))
    return True, "สร้างผู้ใช้สำเร็จแล้ว"


# ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่ม
check_db_connection()

# =========================
# API การตรวจสอบสิทธิ์
# =========================
@app.route("/auth/login", methods=["POST"])
def login():
    try:
        body = request.json or {}
        username = body.get("username")
        password = body.get("password")

        if not username or not password:
            return jsonify({"error": "ต้องการชื่อผู้ใช้และรหัสผ่าน"}), 400

        auth_result = authenticate_user(username, password)
        if auth_result:
            return jsonify(auth_result)
        return jsonify({"error": "ข้อมูลรับรองไม่ถูกต้อง"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auth/register", methods=["POST"])
def register():
    try:
        body = request.json or {}
        username = body.get("username")
        password = body.get("password")
        role = body.get("role", "customer")
        email = body.get("email")
        full_name = body.get("full_name")

        if not username or not password:
            return jsonify({"error": "ต้องการชื่อผู้ใช้และรหัสผ่าน"}), 400

        success, message = create_user(username, password, role, email, full_name)
        if success:
            return jsonify({"message": message})
        return jsonify({"error": message}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auth/me", methods=["GET"])
@jwt_required()
def me():
    try:
        current_user_id = get_jwt_identity()
        user_data = query(
            """
            SELECT UserID, Username, Role, Email, FullName, Phone, CreatedDate
            FROM User WHERE UserID = %s
            """,
            (current_user_id,),
        )

        if not user_data:
            return jsonify({"error": "ไม่พบผู้ใช้"}), 404

        u = user_data[0]
        return jsonify(
            {
                "id": u.get("UserID"),
                "username": u.get("Username"),
                "role": u.get("Role"),
                "email": u.get("Email"),
                "full_name": u.get("FullName"),
                "phone": u.get("Phone"),
                "created_date": str(u.get("CreatedDate")),
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
@jwt_required()
@role_required('admin', 'mechanic')
def get_customers():
    try:
        data = query("SELECT * FROM Customer")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/customers", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
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
@role_required('admin', 'mechanic')
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
@role_required('admin', 'mechanic', 'supplier')
def get_parts():
    try:
        parts_collection = get_parts_collection()
        parts = list(parts_collection.find({}, {"_id": 0}))
        return jsonify(parts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/parts", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic', 'supplier')
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
@role_required('admin', 'mechanic')
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
