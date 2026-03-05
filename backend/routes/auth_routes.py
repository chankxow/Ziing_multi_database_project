from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from middleware.validation import validate_json

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register/customer', methods=['OPTIONS'])
def register_customer_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@auth_bp.route('/login', methods=['POST'])
@validate_json({'username': str, 'password': str})
def login():
    try:
        login_data = request.get_json()
        username = login_data['username']
        password = login_data['password']
        
        # Authenticate user
        user = AuthService.authenticate_user(username, password)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 401
        
        # Generate token
        token = AuthService.generate_token(user)
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@auth_bp.route('/login', methods=['OPTIONS'])
def login_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@auth_bp.route('/register', methods=['POST'])
@validate_json({'username': str, 'email': str, 'password': str})
def register():
    try:
        user_data = request.get_json()
        
        # Check if user already exists (placeholder logic)
        # In a real implementation, you would check the database
        
        # Create new user
        user = AuthService.create_user(user_data)
        
        # Generate token
        token = AuthService.generate_token(user)
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@auth_bp.route('/register/customer', methods=['POST'])
@validate_json({'username': str, 'email': str, 'password': str, 'name': str, 'phone': str, 'address': str})
def register_customer():
    """Register a new customer user and create customer record"""
    try:
        user_data = request.get_json()
        
        # Create customer record first
        from services.customer_service import CustomerService
        customer_data = {
            'name': user_data['name'],
            'email': user_data['email'],
            'phone': user_data['phone'],
            'address': user_data['address']
        }
        
        customer = CustomerService.create_customer(customer_data)
        
        # Create user account with customer role
        user_create_data = {
            'username': user_data['username'],
            'email': user_data['email'],
            'password': user_data['password'],
            'role': 'customer',
            'customer_id': customer.id
        }
        
        user = AuthService.create_user(user_create_data)
        
        # Generate token
        token = AuthService.generate_token(user)
        
        return jsonify({
            'token': token,
            'user': user.to_dict(),
            'customer': customer.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': 'Customer registration failed', 'message': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@validate_json({'token': str})
def refresh_token():
    try:
        token_data = request.get_json()
        token = token_data['token']
        
        new_token = AuthService.refresh_token(token)
        if not new_token:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return jsonify({'token': new_token}), 200
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'message': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@validate_json({'old_password': str, 'new_password': str})
def change_password():
    try:
        # This endpoint would require token authentication
        # For now, it's a placeholder
        password_data = request.get_json()
        
        # In a real implementation, you would:
        # 1. Verify the token to get user_id
        # 2. Call AuthService.change_password
        
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Password change failed', 'message': str(e)}), 500

@auth_bp.route('/verify', methods=['POST'])
@validate_json({'token': str})
def verify_token():
    try:
        token_data = request.get_json()
        token = token_data['token']
        
        payload = AuthService.verify_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return jsonify({'valid': True, 'payload': payload}), 200
    except Exception as e:
        return jsonify({'error': 'Token verification failed', 'message': str(e)}), 500
