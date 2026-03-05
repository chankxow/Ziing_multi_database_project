from functools import wraps
from flask import request, jsonify
import json

def validate_json(schema):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({"error": "Content-Type must be application/json"}), 400
            
            try:
                data = request.get_json()
                # Basic validation - can be extended with marshmallow or pydantic
                for field, field_type in schema.items():
                    if field in data and not isinstance(data[field], field_type):
                        return jsonify({"error": f"Field '{field}' must be of type {field_type.__name__}"}), 400
            except Exception as e:
                return jsonify({"error": "Invalid JSON format", "message": str(e)}), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
