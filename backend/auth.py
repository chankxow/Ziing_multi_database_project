from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import pymysql
from db_mysql import query, execute
from datetime import timedelta

# JWT Configuration
jwt = JWTManager()

def init_jwt(app):
    """เริ่มต้นการตั้งค่า JWT กับ Flask app"""
    app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    jwt.init_app(app)

def hash_password(password):
    """เข้ารหัสรหัสผ่านโดยใช้ bcrypt"""
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    """ตรวจสอบรหัสผ่านกับ hash ที่เก็บไว้"""
    return check_password_hash(hashed_password, password)

# Role-based access control decorator
def role_required(*allowed_roles):
    """ตัวตรวจสอบสิทธิ์การเข้าถึงตามบทบาทผู้ใช้"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user_role = get_user_role(current_user_id)
            
            if user_role not in allowed_roles:
                return jsonify({"error": "สิทธิ์การเข้าถึงไม่เพียงพอ"}), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def get_user_role(user_id):
    """ดึงข้อมูลบทบาทของผู้ใช้จากฐานข้อมูล"""
    try:
        result = query("SELECT Role FROM User WHERE UserID = %s", (user_id,))
        return result[0]['Role'] if result else None
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการดึงข้อมูลบทบาทผู้ใช้: {e}")
        return None

def authenticate_user(username, password):
    """ตรวจสอบสิทธิ์ผู้ใช้และส่งคืน access token หากถูกต้อง"""
    try:
        result = query("SELECT UserID, Username, PasswordHash, Role FROM User WHERE Username = %s", (username,))
        
        if not result:
            return None
            
        user = result[0]
        
        if verify_password(user['PasswordHash'], password):
            access_token = create_access_token(identity=user['UserID'])
            return {
                'access_token': access_token,
                'user': {
                    'id': user['UserID'],
                    'username': user['Username'],
                    'role': user['Role']
                }
            }
        
        return None
        
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์: {e}")
        return None

def create_user(username, password, role, email=None, full_name=None):
    """สร้างผู้ใช้ใหม่"""
    try:
        # ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่แล้วหรือไม่
        existing = query("SELECT UserID FROM User WHERE Username = %s", (username,))
        if existing:
            return False, "ชื่อผู้ใช้นี้มีอยู่แล้ว"
        
        # เข้ารหัสรหัสผ่านและสร้างผู้ใช้
        password_hash = hash_password(password)
        
        sql = """
            INSERT INTO User (Username, PasswordHash, Role, Email, FullName, CreatedDate)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        
        execute(sql, (username, password_hash, role, email, full_name))
        return True, "สร้างผู้ใช้สำเร็จแล้ว"
        
    except Exception as e:
        return False, str(e)
