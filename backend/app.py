from flask import Flask, jsonify, request
from flask_cors import CORS
import traceback
from db_mysql import query, execute
from db_mongo import get_parts_collection
from config import check_db_connection

app = Flask(__name__)
CORS(app)   # 🔥 สำคัญมากสำหรับ React

# ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่ม
check_db_connection()

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
    body = request.json
    # ค้น User จาก Username และเช็ค PasswordHash (ตอนนียัง plain text ไปก่อน)
    user = query("SELECT * FROM User WHERE Username = %s", (body["username"],))
    if not user or user[0]["PasswordHash"] != body["password"]:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"user": {"username": user[0]["Username"], "role": user[0]["RoleID"]}})

# POST /register
@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.json
        # ตรวจสอบว่า username ซ้ำไหม
        existing = query("SELECT UserID FROM User WHERE Username = %s", (body["username"],))
        if existing:
            return jsonify({"error": "Username already exists"}), 400
        
        # สร้างผู้ใช้ใหม่ (ตอนนี้เก็บ password เป็น plain text ก่อน)
        execute(
            "INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s, %s, %s, %s, %s)",
            (body["username"], body["password"], body.get("firstName", ""), body.get("lastName", ""), 3)  # RoleID=3 = Receptionist
        )
        return jsonify({"status": "registered", "username": body["username"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
