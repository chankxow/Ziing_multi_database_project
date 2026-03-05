from functools import wraps
import jwt
from flask import request, jsonify
from config import get_config
from models.user import UserRole

# Get configuration
config = get_config()

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
            data = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
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
            
            user_role = request.current_user_role
            if user_role not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def rate_limiter(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Simple rate limiting logic can be implemented here
        # For now, just pass through
        return f(*args, **kwargs)
    return decorated_function
