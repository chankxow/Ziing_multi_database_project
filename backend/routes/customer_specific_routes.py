from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required

customer_bp = Blueprint('customer', __name__, url_prefix='/customer')

@customer_bp.route('/vehicles', methods=['OPTIONS'])
def customer_vehicles_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@customer_bp.route('/vehicles', methods=['GET'])
@token_required
@role_required('customer')
def get_customer_vehicles():
    try:
        # Return mock customer vehicles
        vehicles = [
            {
                'VehicleID': 1,
                'Make': 'Toyota',
                'Model': 'Camry',
                'Year': 2020,
                'Color': 'Blue',
                'LicensePlate': 'ABC123'
            },
            {
                'VehicleID': 2,
                'Make': 'Honda',
                'Model': 'Civic',
                'Year': 2019,
                'Color': 'Red',
                'LicensePlate': 'XYZ789'
            }
        ]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch vehicles', 'message': str(e)}), 500

@customer_bp.route('/workorders', methods=['OPTIONS'])
def customer_workorders_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@customer_bp.route('/workorders', methods=['GET'])
@token_required
@role_required('customer')
def get_customer_workorders():
    try:
        # Return mock customer work orders
        work_orders = [
            {
                'WorkOrderID': 1,
                'Description': 'Oil Change',
                'Status': 'In Progress',
                'TotalCost': 50.00,
                'CreatedDate': '2026-03-05',
                'CompletedDate': None,
                'Make': 'Toyota',
                'Model': 'Camry',
                'Year': 2020,
                'LicensePlate': 'ABC123',
                'StaffFirst': 'John',
                'StaffLast': 'Doe'
            }
        ]
        return jsonify(work_orders), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch work orders', 'message': str(e)}), 500

@customer_bp.route('/parts', methods=['OPTIONS'])
def customer_parts_options():
    """Handle preflight OPTIONS request"""
    return '', 200

@customer_bp.route('/parts', methods=['GET'])
@token_required
@role_required('customer')
def get_customer_parts():
    try:
        # Return mock parts available for customers
        parts = [
            {
                'part_id': '1',
                'name': 'Oil Filter',
                'category': 'Engine',
                'brand': 'Bosch',
                'price': 15.99,
                'stock': 25,
                'compatible_models': ['Toyota Camry', 'Honda Civic']
            },
            {
                'part_id': '2',
                'name': 'Brake Pads',
                'category': 'Brakes',
                'brand': 'Brembo',
                'price': 89.99,
                'stock': 15,
                'compatible_models': ['Toyota Camry', 'Honda Civic']
            }
        ]
        return jsonify(parts), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch parts', 'message': str(e)}), 500
