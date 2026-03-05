from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard_bp.route('/customer', methods=['OPTIONS'])
def customer_dashboard_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@dashboard_bp.route('/customer', methods=['GET'])
@token_required
@role_required('customer')
def get_customer_dashboard():
    try:
        # Return mock customer dashboard data
        data = {
            'customer': {
                'id': 1,
                'name': 'Test Customer',
                'email': 'test@example.com',
                'phone': '1234567890'
            },
            'vehicles': [
                {
                    'VehicleID': 1,
                    'Make': 'Toyota',
                    'Model': 'Camry',
                    'Year': 2020,
                    'Color': 'Blue',
                    'LicensePlate': 'ABC123'
                }
            ],
            'work_orders': [
                {
                    'WorkOrderID': 1,
                    'Description': 'Oil Change',
                    'Status': 'In Progress',
                    'TotalCost': 50.00,
                    'CreatedDate': '2026-03-05'
                }
            ]
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data', 'message': str(e)}), 500

@dashboard_bp.route('/staff', methods=['GET', 'OPTIONS'])
@token_required
@role_required('admin', 'manager', 'mechanic')
def get_staff_dashboard():
    """Handle preflight OPTIONS request"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        # Return mock staff dashboard data
        data = {
            'work_orders': [
                {
                    'WorkOrderID': 1,
                    'Description': 'Oil Change',
                    'Status': 'In Progress',
                    'TotalCost': 50.00,
                    'Make': 'Toyota',
                    'Model': 'Camry',
                    'LicensePlate': 'ABC123',
                    'CustFirst': 'Test',
                    'CustLast': 'Customer'
                }
            ],
            'parts': [
                {
                    'part_id': '1',
                    'name': 'Oil Filter',
                    'category': 'Engine',
                    'stock': 25
                }
            ]
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data', 'message': str(e)}), 500

@dashboard_bp.route('/admin', methods=['GET', 'OPTIONS'])
@token_required
@role_required('admin')
def get_admin_dashboard():
    """Handle preflight OPTIONS request"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        # Return mock admin dashboard data
        data = {
            'work_orders': [
                {
                    'WorkOrderID': 1,
                    'Description': 'Oil Change',
                    'Status': 'In Progress',
                    'TotalCost': 50.00,
                    'Make': 'Toyota',
                    'Model': 'Camry',
                    'LicensePlate': 'ABC123',
                    'CustFirst': 'Test',
                    'CustLast': 'Customer',
                    'StaffFirst': 'John',
                    'StaffLast': 'Doe'
                }
            ],
            'parts': [
                {
                    'part_id': '1',
                    'name': 'Oil Filter',
                    'category': 'Engine',
                    'stock': 25,
                    'price': 15.99
                }
            ],
            'staff': [
                {
                    'id': 1,
                    'username': 'johndoe',
                    'email': 'john@example.com',
                    'role': 'mechanic'
                }
            ]
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data', 'message': str(e)}), 500
