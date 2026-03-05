from flask import Blueprint, request, jsonify
from services.customer_service import CustomerService
from middleware.auth import token_required, role_required
from middleware.validation import validate_json

customer_bp = Blueprint('customers', __name__, url_prefix='/customers')

@customer_bp.route('', methods=['GET'])
@token_required
@role_required('admin', 'manager', 'mechanic')
def get_all_customers():
    try:
        customers = CustomerService.get_all_customers()
        return jsonify([customer.to_dict() for customer in customers]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch customers', 'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>', methods=['GET'])
@token_required
def get_customer(customer_id):
    try:
        # Customers can only view their own data
        if (request.current_user_role == 'customer' and 
            request.current_customer_id != customer_id):
            return jsonify({'error': 'Access denied'}), 403
        
        customer = CustomerService.get_customer_by_id(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        return jsonify(customer.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch customer', 'message': str(e)}), 500

@customer_bp.route('', methods=['POST'])
@token_required
@role_required('admin', 'manager')
@validate_json({'name': str, 'email': str, 'phone': str, 'address': str})
def create_customer():
    try:
        customer_data = request.get_json()
        customer = CustomerService.create_customer(customer_data)
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create customer', 'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>', methods=['PUT'])
@token_required
@role_required('admin', 'manager')
@validate_json({'name': str, 'email': str, 'phone': str, 'address': str})
def update_customer(customer_id):
    try:
        customer_data = request.get_json()
        customer = CustomerService.update_customer(customer_id, customer_data)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        return jsonify(customer.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update customer', 'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_customer(customer_id):
    try:
        success = CustomerService.delete_customer(customer_id)
        if not success:
            return jsonify({'error': 'Customer not found'}), 404
        
        return jsonify({'message': 'Customer deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete customer', 'message': str(e)}), 500
