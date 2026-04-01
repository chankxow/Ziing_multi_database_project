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
import os

if os.getenv("TESTING") != "true" and os.getenv("SKIP_DB_CHECK") != "true":
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
            "SELECT u.*, r.RoleName FROM user u JOIN role r ON u.RoleID = r.RoleID WHERE u.Username = %s",
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
        hashed = bcrypt.hashpw(b["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        execute(
            "INSERT INTO User (Username,PasswordHash,FirstName,LastName,RoleID,CustomerID) VALUES(%s,%s,%s,%s,%s,NULL)",
            (b["username"], hashed, b["firstName"], b["lastName"], role_id)
        )
        new_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        return jsonify({"status": "created", "user_id": new_id}), 201
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/users/staff/<int:user_id>", methods=["PATCH"])
@token_required
@role_required(1)
def toggle_staff_active(user_id):
    """PATCH /users/staff/<id>  Body: { is_active: bool }"""
    try:
        b = request.json
        execute("UPDATE User SET IsActive = %s WHERE UserID = %s", (b["is_active"], user_id))
        return jsonify({"status": "updated"})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/users/staff/<int:user_id>", methods=["DELETE"])
@token_required
@role_required(1)
def delete_staff(user_id):
    """DELETE /users/staff/<id> — ลบพนักงาน (ถ้าไม่มี work order)"""
    try:
        wo = query("SELECT WorkOrderID FROM WorkOrder WHERE UserID = %s LIMIT 1", (user_id,))
        if wo:
            return jsonify({"error": "ไม่สามารถลบพนักงานที่มี work order อยู่"}), 400
        execute("DELETE FROM User WHERE UserID = %s AND RoleID != 4", (user_id,))
        return jsonify({"status": "deleted"})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/dashboard/admin", methods=["GET"])
@token_required
@role_required(1, 3)
def admin_dashboard():
    try:
        summary = {
            "total_customers":  query("SELECT COUNT(*) AS n FROM Customer")[0]["n"],
            "total_vehicles":   query("SELECT COUNT(*) AS n FROM Vehicle")[0]["n"],
            "total_workorders": query("SELECT COUNT(*) AS n FROM WorkOrder")[0]["n"],
            "total_revenue":    float(query("SELECT COALESCE(SUM(TotalCost),0) AS n FROM WorkOrder WHERE Status='Completed'")[0]["n"]),
        }
        status_rows = query("SELECT Status, COUNT(*) AS cnt FROM WorkOrder GROUP BY Status")
        status_breakdown = {r["Status"]: r["cnt"] for r in status_rows}

        recent_orders = query("""
            SELECT wo.WorkOrderID, wo.Description, wo.Status, wo.TotalCost, wo.CreatedDate,
                   v.Make, v.Model, v.Year,
                   c.FirstName AS CustFirst, c.LastName AS CustLast,
                   u.FirstName AS StaffFirst, u.LastName AS StaffLast
            FROM WorkOrder wo
            JOIN Vehicle v  ON wo.VehicleID = v.VehicleID
            JOIN Customer c ON v.CustomerID = c.CustomerID
            JOIN User u     ON wo.UserID    = u.UserID
            ORDER BY wo.CreatedDate DESC LIMIT 8
        """)
        for r in recent_orders:
            r["TotalCost"] = float(r["TotalCost"]) if r["TotalCost"] else 0
            r["CreatedDate"] = str(r["CreatedDate"])

        staff_list = query("""
            SELECT u.UserID, u.FirstName, u.LastName, r.RoleName,
                   COUNT(wo.WorkOrderID) AS assigned_jobs
            FROM User u JOIN Role r ON u.RoleID=r.RoleID
            LEFT JOIN WorkOrder wo ON u.UserID=wo.UserID
            WHERE u.RoleID IN (1,2,3)
            GROUP BY u.UserID, u.FirstName, u.LastName, r.RoleName
        """)

        parts_col = get_parts_collection()
        parts_agg = list(parts_col.aggregate([{"$group": {
            "_id": "$category", "count": {"$sum": 1},
            "total_stock": {"$sum": "$stock"},
            "total_value": {"$sum": {"$multiply": ["$price","$stock"]}}
        }}]))
        parts_summary = [{"category": p["_id"] or "Unknown", "count": p["count"],
                          "total_stock": p["total_stock"], "total_value": p["total_value"]}
                         for p in sorted(parts_agg, key=lambda x: x["count"], reverse=True)]

        return jsonify({"summary": summary, "status_breakdown": status_breakdown,
                        "recent_orders": recent_orders, "staff_list": staff_list,
                        "parts_summary": parts_summary})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/dashboard/staff", methods=["GET"])
@token_required
@role_required(2)
def staff_dashboard():
    try:
        uid = request.current_user_id
        my_orders = query("""
            SELECT wo.WorkOrderID, wo.Description, wo.Status, wo.TotalCost,
                   wo.CreatedDate, wo.CompletedDate,
                   v.Make, v.Model, v.Year, v.LicensePlate,
                   c.FirstName AS CustFirst, c.LastName AS CustLast
            FROM WorkOrder wo
            JOIN Vehicle v  ON wo.VehicleID = v.VehicleID
            JOIN Customer c ON v.CustomerID = c.CustomerID
            WHERE wo.UserID = %s
            ORDER BY FIELD(wo.Status,'In Progress','Pending','Completed','Cancelled'), wo.CreatedDate DESC
        """, (uid,))
        for r in my_orders:
            r["TotalCost"]     = float(r["TotalCost"]) if r["TotalCost"] else 0
            r["CreatedDate"]   = str(r["CreatedDate"])
            r["CompletedDate"] = str(r["CompletedDate"]) if r["CompletedDate"] else None

        summary = {
            "total_assigned": len(my_orders),
            "in_progress":    sum(1 for o in my_orders if o["Status"]=="In Progress"),
            "pending":        sum(1 for o in my_orders if o["Status"]=="Pending"),
            "completed":      sum(1 for o in my_orders if o["Status"]=="Completed"),
        }
        low_stock = list(get_parts_collection().find(
            {"stock": {"$lt": 5}}, {"_id":0,"name":1,"category":1,"stock":1,"part_id":1}
        ).limit(10))
        return jsonify({"summary": summary, "my_orders": my_orders, "low_stock_parts": low_stock})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


# =========================
# WORK ORDERS — Full CRUD
# RoleID 1,3 = Admin/Receptionist (full access)
# RoleID 2   = Mechanic (status update only)
# =========================

@app.route("/workorders", methods=["GET"])
@token_required
@role_required(1, 2, 3)
def get_workorders():
    """
    GET /workorders
    Query params:
      - status   : filter by status string
      - user_id  : filter by assigned mechanic
      - vehicle_id: filter by vehicle
    """
    try:
        conditions = []
        params = []

        status_filter = request.args.get("status")
        uid_filter    = request.args.get("user_id")
        vid_filter    = request.args.get("vehicle_id")

        if status_filter:
            conditions.append("wo.Status = %s")
            params.append(status_filter)
        if uid_filter:
            conditions.append("wo.UserID = %s")
            params.append(uid_filter)
        if vid_filter:
            conditions.append("wo.VehicleID = %s")
            params.append(vid_filter)

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        rows = query(f"""
            SELECT wo.WorkOrderID, wo.Description, wo.Status,
                   wo.TotalCost, wo.CreatedDate, wo.CompletedDate,
                   wo.VehicleID, wo.UserID,
                   v.Make, v.Model, v.Year, v.LicensePlate,
                   c.CustomerID, c.FirstName AS CustFirst, c.LastName AS CustLast,
                   COALESCE(u.FirstName, 'Unassigned') AS StaffFirst,
                   COALESCE(u.LastName, '')            AS StaffLast
            FROM WorkOrder wo
            JOIN Vehicle v   ON wo.VehicleID = v.VehicleID
            JOIN Customer c  ON v.CustomerID = c.CustomerID
            LEFT JOIN User u ON wo.UserID    = u.UserID
            {where}
            ORDER BY FIELD(wo.Status,'In Progress','Pending','Completed','Cancelled'),
                     wo.CreatedDate DESC
        """, params or [])

        for r in rows:
            r["TotalCost"]     = float(r["TotalCost"]) if r["TotalCost"] else 0
            r["CreatedDate"]   = str(r["CreatedDate"])
            r["CompletedDate"] = str(r["CompletedDate"]) if r["CompletedDate"] else None

        return jsonify(rows)
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/workorders", methods=["POST"])
@token_required
@role_required(1, 3)
def create_workorder():
    """
    POST /workorders
    Body: { vehicle_id, user_id, description, total_cost, status? }
    """
    try:
        b = request.json
        execute("""
            INSERT INTO WorkOrder (VehicleID, UserID, Description, Status, TotalCost)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            b["vehicle_id"],
            b["user_id"],
            b.get("description", ""),
            b.get("status", "Pending"),
            b.get("total_cost", 0),
        ))
        # คืน WorkOrderID ล่าสุด
        new_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        return jsonify({"status": "created", "work_order_id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/workorders/<int:order_id>", methods=["GET"])
@token_required
@role_required(1, 2, 3)
def get_workorder(order_id):
    try:
        rows = query("""
            SELECT wo.*, v.Make, v.Model, v.Year, v.LicensePlate,
                   c.FirstName AS CustFirst, c.LastName AS CustLast,
                   u.FirstName AS StaffFirst, u.LastName AS StaffLast
            FROM WorkOrder wo
            JOIN Vehicle v  ON wo.VehicleID = v.VehicleID
            JOIN Customer c ON v.CustomerID = c.CustomerID
            JOIN User u     ON wo.UserID    = u.UserID
            WHERE wo.WorkOrderID = %s
        """, (order_id,))
        if not rows:
            return jsonify({"error": "Not found"}), 404
        r = rows[0]
        r["TotalCost"]     = float(r["TotalCost"]) if r["TotalCost"] else 0
        r["CreatedDate"]   = str(r["CreatedDate"])
        r["CompletedDate"] = str(r["CompletedDate"]) if r["CompletedDate"] else None
        return jsonify(r)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/workorders/<int:order_id>", methods=["PUT"])
@token_required
@role_required(1, 3)
def update_workorder(order_id):
    """
    PUT /workorders/<id>
    Body: { description?, total_cost?, user_id?, vehicle_id? }
    Admin/Receptionist เท่านั้น — แก้ข้อมูลทั่วไป
    """
    try:
        b = request.json
        fields, params = [], []
        if "description" in b:
            fields.append("Description = %s"); params.append(b["description"])
        if "total_cost" in b:
            fields.append("TotalCost = %s"); params.append(b["total_cost"])
        if "user_id" in b:
            fields.append("UserID = %s"); params.append(b["user_id"])
        if "vehicle_id" in b:
            fields.append("VehicleID = %s"); params.append(b["vehicle_id"])
        if not fields:
            return jsonify({"error": "No fields to update"}), 400
        params.append(order_id)
        execute(f"UPDATE WorkOrder SET {', '.join(fields)} WHERE WorkOrderID = %s", params)
        return jsonify({"status": "updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/workorders/<int:order_id>/status", methods=["PATCH"])
@token_required
@role_required(1, 2, 3)
def update_workorder_status(order_id):
    """
    PATCH /workorders/<id>/status
    Body: { status: "Pending"|"In Progress"|"Completed"|"Cancelled" }
    Mechanic เปลี่ยนได้เฉพาะงานตัวเอง, Admin/Receptionist เปลี่ยนได้ทั้งหมด
    """
    try:
        new_status = request.json.get("status")
        if new_status not in ("Pending", "In Progress", "Completed", "Cancelled"):
            return jsonify({"error": "Invalid status"}), 400

        # Mechanic ตรวจสอบว่าเป็นงานตัวเองหรือเปล่า
        if request.current_user_role == 2:
            owner = query("SELECT UserID FROM WorkOrder WHERE WorkOrderID=%s", (order_id,))
            if not owner or owner[0]["UserID"] != request.current_user_id:
                return jsonify({"error": "Access denied — not your job"}), 403

        if new_status == "Completed":
            execute("UPDATE WorkOrder SET Status=%s, CompletedDate=NOW() WHERE WorkOrderID=%s",
                    (new_status, order_id))
        else:
            execute("UPDATE WorkOrder SET Status=%s, CompletedDate=NULL WHERE WorkOrderID=%s",
                    (new_status, order_id))
        return jsonify({"status": "updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/workorders/<int:order_id>", methods=["DELETE"])
@token_required
@role_required(1)
def delete_workorder(order_id):
    """Admin only"""
    try:
        execute("DELETE FROM WorkOrder WHERE WorkOrderID=%s", (order_id,))
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# PARTS — Full CRUD (MongoDB)
# RoleID 1,3 = full CRUD
# RoleID 2   = read only
# =========================

@app.route("/parts", methods=["GET"])
@token_required
@role_required(1, 2, 3)
def get_parts():
    """
    GET /parts
    Query params:
      - category : filter by category
      - search   : search in name field
      - low_stock: "true" → stock < 5
    """
    try:
        col = get_parts_collection()
        mongo_filter = {}

        cat    = request.args.get("category")
        search = request.args.get("search")
        low    = request.args.get("low_stock")

        if cat:
            mongo_filter["category"] = cat
        if search:
            mongo_filter["name"] = {"$regex": search, "$options": "i"}
        if low == "true":
            mongo_filter["stock"] = {"$lt": 5}

        parts = list(col.find(mongo_filter, {"_id": 0}))
        return jsonify(parts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts/categories", methods=["GET"])
@token_required
@role_required(1, 2, 3, 4)
def get_parts_categories():
    """GET /parts/categories — รายชื่อ category ทั้งหมด"""
    try:
        cats = get_parts_collection().distinct("category")
        return jsonify(sorted([c for c in cats if c]))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts/<string:part_id>", methods=["GET"])
@token_required
@role_required(1, 2, 3)
def get_part(part_id):
    try:
        part = get_parts_collection().find_one({"part_id": part_id}, {"_id": 0})
        if not part:
            return jsonify({"error": "Part not found"}), 404
        return jsonify(part)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts", methods=["POST"])
@token_required
@role_required(1, 3)
def add_part():
    """
    POST /parts
    Body: { part_id, name, category, brand, price, stock, compatible_models? }
    """
    try:
        body = request.json
        col  = get_parts_collection()

        # ตรวจสอบ part_id ซ้ำ
        if col.find_one({"part_id": body.get("part_id")}):
            return jsonify({"error": "part_id already exists"}), 400

        required = ["part_id", "name", "category", "price", "stock"]
        for field in required:
            if field not in body:
                return jsonify({"error": f"Missing field: {field}"}), 400

        col.insert_one({k: v for k, v in body.items() if k != "_id"})
        return jsonify({"status": "added", "part_id": body["part_id"]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts/<string:part_id>", methods=["PUT"])
@token_required
@role_required(1, 3)
def update_part(part_id):
    """
    PUT /parts/<part_id>
    Body: fields to update (ยกเว้น part_id)
    """
    try:
        body = request.json
        body.pop("part_id", None)  # ไม่ให้เปลี่ยน part_id
        body.pop("_id",     None)

        result = get_parts_collection().update_one(
            {"part_id": part_id},
            {"$set": body}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Part not found"}), 404
        return jsonify({"status": "updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts/<string:part_id>/stock", methods=["PATCH"])
@token_required
@role_required(1, 2, 3)
def update_part_stock(part_id):
    """
    PATCH /parts/<part_id>/stock
    Body: { delta: +N หรือ -N }  → เพิ่ม/ลด stock
    หรือ { stock: N }            → ตั้งค่าตรงๆ
    """
    try:
        body = request.json
        col  = get_parts_collection()

        if "delta" in body:
            result = col.update_one(
                {"part_id": part_id},
                {"$inc": {"stock": int(body["delta"])}}
            )
        elif "stock" in body:
            result = col.update_one(
                {"part_id": part_id},
                {"$set": {"stock": int(body["stock"])}}
            )
        else:
            return jsonify({"error": "Provide delta or stock"}), 400

        if result.matched_count == 0:
            return jsonify({"error": "Part not found"}), 404
        return jsonify({"status": "stock updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/parts/<string:part_id>", methods=["DELETE"])
@token_required
@role_required(1)
def delete_part(part_id):
    """Admin only"""
    try:
        result = get_parts_collection().delete_one({"part_id": part_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Part not found"}), 404
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# Customers / Vehicles (read)
# =========================
@app.route("/customers", methods=["GET"])
@token_required
@role_required(1, 3)
def get_customers():
    return jsonify(query("SELECT * FROM Customer"))

@app.route("/customers", methods=["POST"])
@token_required
@role_required(1, 3)
def add_customer():
    b = request.json
    execute("INSERT INTO Customer (FirstName,LastName,Phone,Email) VALUES(%s,%s,%s,%s)",
            (b["FirstName"],b["LastName"],b["Phone"],b["Email"]))
    return jsonify({"status": "added"})

@app.route("/vehicles", methods=["GET"])
@token_required
@role_required(1, 2, 3)
def get_vehicles():
    rows = query("""
        SELECT v.*, c.FirstName AS CustFirst, c.LastName AS CustLast
        FROM Vehicle v JOIN Customer c ON v.CustomerID = c.CustomerID
        ORDER BY v.CreatedDate DESC
    """)
    for r in rows:
        r["CreatedDate"] = str(r["CreatedDate"])
    return jsonify(rows)

# =========================
# Staff list (for dropdowns)
# =========================
@app.route("/staff", methods=["GET"])
@token_required
@role_required(1, 3)
def get_staff():
    rows = query("""
        SELECT u.UserID, u.FirstName, u.LastName, r.RoleName
        FROM User u JOIN Role r ON u.RoleID = r.RoleID
        WHERE u.RoleID IN (1,2,3) AND u.IsActive = TRUE
        ORDER BY u.FirstName
    """)
    return jsonify(rows)

# =========================
# Error Handlers
# =========================


# =========================
# CUSTOMER ENDPOINTS (RoleID = 4)
# =========================

@app.route("/dashboard/customer", methods=["GET"])
@token_required
@role_required(4)
def customer_dashboard():
    try:
        cid = request.current_customer_id
        if not cid:
            return jsonify({"error": "No customer profile linked"}), 400
        customer = query("SELECT * FROM Customer WHERE CustomerID = %s", (cid,))
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
        vehicles = query("SELECT * FROM Vehicle WHERE CustomerID = %s ORDER BY CreatedDate DESC", (cid,))
        for v in vehicles:
            v["CreatedDate"] = str(v["CreatedDate"])
        vehicle_ids = [v["VehicleID"] for v in vehicles]
        work_orders = []
        if vehicle_ids:
            placeholders = ",".join(["%s"] * len(vehicle_ids))
            work_orders = query(f"""
                SELECT wo.*, v.Make, v.Model, v.Year, v.LicensePlate,
                       u.FirstName AS StaffFirst, u.LastName AS StaffLast
                FROM WorkOrder wo
                JOIN Vehicle v ON wo.VehicleID = v.VehicleID
                JOIN User u    ON wo.UserID    = u.UserID
                WHERE wo.VehicleID IN ({placeholders})
                ORDER BY wo.CreatedDate DESC
            """, vehicle_ids)
            for w in work_orders:
                w["TotalCost"]     = float(w["TotalCost"]) if w["TotalCost"] else 0
                w["CreatedDate"]   = str(w["CreatedDate"])
                w["CompletedDate"] = str(w["CompletedDate"]) if w["CompletedDate"] else None
        summary = {
            "total_vehicles": len(vehicles),
            "active_builds":  sum(1 for w in work_orders if w["Status"] in ("Pending", "In Progress")),
            "total_spent":    sum(w["TotalCost"] for w in work_orders if w["Status"] == "Completed"),
        }
        return jsonify({"customer": customer[0], "vehicles": vehicles, "work_orders": work_orders, "summary": summary})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed"}), 500


@app.route("/customer/vehicles", methods=["GET"])
@token_required
@role_required(4)
def customer_get_vehicles():
    try:
        cid = request.current_customer_id
        if not cid:
            return jsonify({"error": "No customer profile"}), 400
        rows = query("SELECT * FROM Vehicle WHERE CustomerID = %s ORDER BY CreatedDate DESC", (cid,))
        for r in rows:
            r["CreatedDate"] = str(r["CreatedDate"])
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/vehicles", methods=["POST"])
@token_required
@role_required(4)
def customer_add_vehicle():
    try:
        cid = request.current_customer_id
        if not cid:
            return jsonify({"error": "No customer profile"}), 400
        b = request.json
        if query("SELECT VehicleID FROM Vehicle WHERE LicensePlate = %s", (b.get("license_plate"),)):
            return jsonify({"error": "ป้ายทะเบียนนี้มีในระบบแล้ว"}), 400
        execute(
            "INSERT INTO Vehicle (CustomerID, Make, Model, Year, Color, LicensePlate) VALUES(%s,%s,%s,%s,%s,%s)",
            (cid, b.get("make",""), b.get("model",""), b.get("year"), b.get("color",""), b.get("license_plate",""))
        )
        new_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        return jsonify({"status": "added", "vehicle_id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/vehicles/<int:vehicle_id>", methods=["DELETE"])
@token_required
@role_required(4)
def customer_delete_vehicle(vehicle_id):
    try:
        cid = request.current_customer_id
        v = query("SELECT CustomerID FROM Vehicle WHERE VehicleID = %s", (vehicle_id,))
        if not v or v[0]["CustomerID"] != cid:
            return jsonify({"error": "ไม่พบรถหรือไม่มีสิทธิ์"}), 403
        active = query("SELECT WorkOrderID FROM WorkOrder WHERE VehicleID=%s AND Status IN ('Pending','In Progress')", (vehicle_id,))
        if active:
            return jsonify({"error": "ไม่สามารถลบรถที่มีงานค้างอยู่"}), 400
        execute("DELETE FROM Vehicle WHERE VehicleID = %s", (vehicle_id,))
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/workorders", methods=["POST"])
@token_required
@role_required(4)
def customer_create_workorder():
    try:
        cid = request.current_customer_id
        b   = request.json
        v = query("SELECT CustomerID FROM Vehicle WHERE VehicleID = %s", (b.get("vehicle_id"),))
        if not v or v[0]["CustomerID"] != cid:
            return jsonify({"error": "ไม่พบรถหรือไม่มีสิทธิ์"}), 403
        default_staff = query("SELECT UserID FROM User WHERE RoleID = 2 LIMIT 1")
        if not default_staff:
            return jsonify({"error": "ยังไม่มีช่างในระบบ กรุณาติดต่อ Admin"}), 400
        staff_id = default_staff[0]["UserID"]
        execute("INSERT INTO WorkOrder (VehicleID, UserID, Description, Status, TotalCost) VALUES (%s,%s,%s,'Pending',0)",
                (b["vehicle_id"], staff_id, b.get("description","")))
        new_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        return jsonify({"status": "created", "work_order_id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/parts", methods=["GET"])
@token_required
@role_required(4)
def customer_get_parts():
    try:
        col = get_parts_collection()
        qf  = {}
        cat    = request.args.get("category")
        search = request.args.get("search")
        if cat:    qf["category"] = cat
        if search: qf["name"] = {"$regex": search, "$options": "i"}
        parts = list(col.find(qf, {"_id": 0, "part_id": 1, "name": 1, "category": 1, "brand": 1, "compatible_models": 1, "stock": 1}))
        return jsonify(parts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/register/customer", methods=["POST"])
def register_customer():
    try:
        b = request.json
        for f in ["username", "password", "firstName", "lastName"]:
            if not b.get(f):
                return jsonify({"error": f"Missing: {f}"}), 400
        if query("SELECT UserID FROM user WHERE Username = %s", (b["username"],)):
            return jsonify({"error": "Username already exists"}), 400
        execute("INSERT INTO customer (FirstName, LastName, Phone, Email) VALUES(%s,%s,%s,%s)",
                (b["firstName"], b["lastName"], b.get("phone",""), b.get("email","")))
        customer_id = query("SELECT MAX(CustomerID) as id FROM customer")[0]["id"]
        hashed = bcrypt.hashpw(b["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        execute("INSERT INTO user (Username,PasswordHash,FirstName,LastName,RoleID,CustomerID) VALUES(%s,%s,%s,%s,%s,%s)",
                (b["username"], hashed, b["firstName"], b["lastName"], 4, customer_id))
        return jsonify({"status": "registered", "customer_id": customer_id}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500
@app.errorhandler(Exception)
def handle_error(e):
    traceback.print_exc()
    return jsonify({"error": "Internal Server Error"}), 500

@app.route("/favicon.ico")
def favicon():
    return "", 204

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)