from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

from db_mysql import query, execute
from db_mongo import get_parts_collection
from config import check_db_connection
from auth import init_jwt, authenticate_user, create_user, role_required

app = Flask(__name__)
CORS(app)   # 🔥 สำคัญมากสำหรับ React

# เริ่มต้น JWT
init_jwt(app)

# ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่ม
check_db_connection()

# =========================
# API การตรวจสอบสิทธิ์
# =========================
@app.route("/auth/login", methods=["POST"])
def login():
    """เข้าสู่ระบบสำหรับผู้ใช้"""
    try:
        body = request.json
        username = body.get("username")
        password = body.get("password")
        
        if not username or not password:
            return jsonify({"error": "ต้องการชื่อผู้ใช้และรหัสผ่าน"}), 400
        
        auth_result = authenticate_user(username, password)
        
        if auth_result:
            return jsonify(auth_result)
        else:
            return jsonify({"error": "ข้อมูลรับรองไม่ถูกต้อง"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/auth/register", methods=["POST"])
def register():
    """สมัครสมาชิกผู้ใช้ใหม่"""
    try:
        body = request.json
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
        else:
            return jsonify({"error": message}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """ดูข้อมูลผู้ใช้ปัจจุบัน"""
    try:
        current_user_id = get_jwt_identity()
        user_data = query("""
            SELECT UserID, Username, Role, Email, FullName, Phone, CreatedDate
            FROM User WHERE UserID = %s
        """, (current_user_id,))
        
        if user_data:
            return jsonify(user_data[0])
        else:
            return jsonify({"error": "ไม่พบผู้ใช้"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# ทดสอบระบบ
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend กำลังทำงาน 🚀"})

# =========================
# API ลูกค้า (MySQL)
# =========================
@app.route("/customers", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic')
def get_customers():
    """ดูข้อมูลลูกค้าทั้งหมด (เฉพาะ admin และ mechanic)"""
    try:
        data = query("SELECT * FROM Customer")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/customers", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
def add_customer():
    """เพิ่มลูกค้าใหม่ (เฉพาะ admin และ mechanic)"""
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

        return jsonify({"status": "เพิ่มลูกค้าแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# =========================
# API ยานพาหนะ (MySQL)
# =========================
@app.route("/vehicles", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic')
def get_vehicles():
    """ดูข้อมูลยานพาหนะทั้งหมด (เฉพาะ admin และ mechanic)"""
    try:
        data = query("SELECT * FROM Vehicle")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API ชิ้นส่วน (MongoDB)
# =========================
@app.route("/parts", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'supplier')
def get_parts():
    """ดูข้อมูลชิ้นส่วนทั้งหมดจาก MongoDB"""
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
    """เพิ่มชิ้นส่วนใหม่ใน MongoDB"""
    try:
        body = request.json
        parts_collection = get_parts_collection()
        parts_collection.insert_one(body)
        return jsonify({"status": "เพิ่มชิ้นส่วนแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API คำสั่งงาน (MySQL)
# =========================
@app.route("/workorders", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic')
def get_workorders():
    """ดูคำสั่งงานทั้งหมด (เฉพาะ admin และ mechanic)"""
    try:
        data = query("SELECT * FROM WorkOrder")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API โครงการสร้าง (MySQL)
# =========================
@app.route("/build-projects", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'customer')
def get_build_projects():
    """ดูโครงการสร้างทั้งหมด"""
    try:
        current_user_id = get_jwt_identity()
        user_role = query("SELECT Role FROM User WHERE UserID = %s", (current_user_id,))
        
        if user_role and user_role[0]['Role'] == 'customer':
            # ลูกค้าเห็นเฉพาะโครงการของตนเอง
            data = query("""
                SELECT bp.*, v.Make, v.Model, v.Year, c.FirstName, c.LastName
                FROM BuildProject bp
                JOIN Vehicle v ON bp.VehicleID = v.VehicleID
                JOIN Customer c ON bp.CustomerID = c.CustomerID
                WHERE bp.CustomerID = (SELECT CustomerID FROM Customer WHERE Email = 
                    (SELECT Email FROM User WHERE UserID = %s))
            """, (current_user_id,))
        else:
            # Admin และ mechanic เห็นโครงการทั้งหมด
            data = query("""
                SELECT bp.*, v.Make, v.Model, v.Year, c.FirstName, c.LastName
                FROM BuildProject bp
                JOIN Vehicle v ON bp.VehicleID = v.VehicleID
                JOIN Customer c ON bp.CustomerID = c.CustomerID
            """)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/build-projects", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
def create_build_project():
    """สร้างโครงการสร้างใหม่ (เฉพาะ admin และ mechanic)"""
    try:
        body = request.json
        
        sql = """
            INSERT INTO BuildProject 
            (ProjectName, VehicleID, CustomerID, LeadMechanicID, StartDate, 
             EstimatedCompletionDate, TotalBudget, Description, Goals)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        execute(sql, (
            body["ProjectName"],
            body["VehicleID"],
            body["CustomerID"],
            body.get("LeadMechanicID"),
            body.get("StartDate"),
            body.get("EstimatedCompletionDate"),
            body.get("TotalBudget"),
            body.get("Description"),
            body.get("Goals")
        ))
        
        return jsonify({"status": "สร้างโครงการแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API ผู้จัดจำหน่าย (MySQL)
# =========================
@app.route("/suppliers", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'supplier')
def get_suppliers():
    """ดูข้อมูลผู้จัดจำหน่ายทั้งหมด"""
    try:
        data = query("SELECT * FROM Supplier WHERE IsActive = TRUE")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/suppliers", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
def create_supplier():
    """สร้างผู้จัดจำหน่ายใหม่ (เฉพาะ admin และ mechanic)"""
    try:
        body = request.json
        
        sql = """
            INSERT INTO Supplier (Name, ContactPerson, Email, Phone, Address, Website)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        execute(sql, (
            body["Name"],
            body.get("ContactPerson"),
            body.get("Email"),
            body.get("Phone"),
            body.get("Address"),
            body.get("Website")
        ))
        
        return jsonify({"status": "สร้างผู้จัดจำหน่ายแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API ชิ้นส่วนที่ปรับปรุง (MySQL)
# =========================
@app.route("/parts-mysql", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'supplier')
def get_parts_mysql():
    """ดูข้อมูลชิ้นส่วนทั้งหมดจาก MySQL"""
    try:
        data = query("""
            SELECT p.*, s.Name as SupplierName
            FROM Part p
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierID
            WHERE p.IsActive = TRUE
        """)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/parts-mysql", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic', 'supplier')
def create_part_mysql():
    """สร้างชิ้นส่วนใหม่ใน MySQL"""
    try:
        body = request.json
        
        sql = """
            INSERT INTO Part (PartNumber, Name, Description, Category, Brand, Model,
                              YearCompatibility, Price, Cost, Weight, Dimensions,
                              SupplierID, StockQuantity, MinStockLevel, MaxStockLevel, ReorderPoint)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        execute(sql, (
            body["PartNumber"],
            body["Name"],
            body.get("Description"),
            body.get("Category"),
            body.get("Brand"),
            body.get("Model"),
            body.get("YearCompatibility"),
            body.get("Price"),
            body.get("Cost"),
            body.get("Weight"),
            body.get("Dimensions"),
            body.get("SupplierID"),
            body.get("StockQuantity", 0),
            body.get("MinStockLevel", 5),
            body.get("MaxStockLevel", 100),
            body.get("ReorderPoint", 10)
        ))
        
        return jsonify({"status": "สร้างชิ้นส่วนแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API ขั้นตอนการสร้าง (MySQL)
# =========================
@app.route("/build-stages/<int:project_id>", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'customer')
def get_build_stages(project_id):
    """ดูขั้นตอนของโครงการ"""
    try:
        data = query("SELECT * FROM BuildStage WHERE BuildProjectID = %s ORDER BY CreatedDate", (project_id,))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/build-stages", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
def create_build_stage():
    """สร้างขั้นตอนการสร้างใหม่ (เฉพาะ admin และ mechanic)"""
    try:
        body = request.json
        
        sql = """
            INSERT INTO BuildStage (BuildProjectID, StageName, Description, 
                                   EstimatedHours, Status, Dependencies)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        execute(sql, (
            body["BuildProjectID"],
            body["StageName"],
            body.get("Description"),
            body.get("EstimatedHours"),
            body.get("Status", "not_started"),
            body.get("Dependencies")
        ))
        
        return jsonify({"status": "สร้างขั้นตอนแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# API ข้อมูลสมรรถนะ (MySQL)
# =========================
@app.route("/performance-data/<int:project_id>", methods=["GET"])
@jwt_required()
@role_required('admin', 'mechanic', 'customer')
def get_performance_data(project_id):
    """ดูข้อมูลสมรรถนะของโครงการ"""
    try:
        data = query("SELECT * FROM PerformanceData WHERE BuildProjectID = %s ORDER BY TestDate DESC", (project_id,))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/performance-data", methods=["POST"])
@jwt_required()
@role_required('admin', 'mechanic')
def create_performance_data():
    """เพิ่มข้อมูลสมรรถนะใหม่ (เฉพาะ admin และ mechanic)"""
    try:
        body = request.json
        
        sql = """
            INSERT INTO PerformanceData (BuildProjectID, TestType, Horsepower, Torque,
                                        QuarterMileTime, TopSpeed, BrakingDistance60to0,
                                        LateralG, WeatherConditions, Track, Notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        execute(sql, (
            body["BuildProjectID"],
            body["TestType"],
            body.get("Horsepower"),
            body.get("Torque"),
            body.get("QuarterMileTime"),
            body.get("TopSpeed"),
            body.get("BrakingDistance60to0"),
            body.get("LateralG"),
            body.get("WeatherConditions"),
            body.get("Track"),
            body.get("Notes")
        ))
        
        return jsonify({"status": "เพิ่มข้อมูลสมรรถนะแล้ว"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# การจัดการข้อผิดพลาด
# =========================
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error": str(e)}), 500

# =========================
# เริ่มต้นเซิร์ฟเวอร์
# =========================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
