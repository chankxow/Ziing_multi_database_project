from flask import Blueprint, request, jsonify
from services.vehicle_service import VehicleService
from middleware.auth import token_required, role_required
from middleware.validation import validate_json

vehicle_bp = Blueprint('vehicles', __name__, url_prefix='/vehicles')

@vehicle_bp.route('', methods=['GET'])
@token_required
@role_required('admin', 'manager', 'mechanic')
def get_all_vehicles():
    try:
        vehicles = VehicleService.get_all_vehicles()
        return jsonify([vehicle.to_dict() for vehicle in vehicles]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch vehicles', 'message': str(e)}), 500

@vehicle_bp.route('/<int:vehicle_id>', methods=['GET'])
@token_required
def get_vehicle(vehicle_id):
    try:
        vehicle = VehicleService.get_vehicle_by_id(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        # Check access permissions
        if (request.current_user_role == 'customer' and 
            request.current_customer_id != vehicle.customer_id):
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify(vehicle.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch vehicle', 'message': str(e)}), 500

@vehicle_bp.route('/customer/<int:customer_id>', methods=['GET'])
@token_required
def get_vehicles_by_customer(customer_id):
    try:
        # Customers can only view their own vehicles
        if (request.current_user_role == 'customer' and 
            request.current_customer_id != customer_id):
            return jsonify({'error': 'Access denied'}), 403
        
        vehicles = VehicleService.get_vehicles_by_customer(customer_id)
        return jsonify([vehicle.to_dict() for vehicle in vehicles]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch vehicles', 'message': str(e)}), 500

@vehicle_bp.route('', methods=['POST'])
@token_required
@role_required('admin', 'manager', 'mechanic')
@validate_json({'customer_id': int, 'make': str, 'model': str, 'year': int, 'license_plate': str, 'vin': str})
def create_vehicle():
    try:
        vehicle_data = request.get_json()
        vehicle = VehicleService.create_vehicle(vehicle_data)
        return jsonify(vehicle.to_dict()), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create vehicle', 'message': str(e)}), 500

@vehicle_bp.route('/<int:vehicle_id>', methods=['PUT'])
@token_required
@role_required('admin', 'manager', 'mechanic')
@validate_json({'customer_id': int, 'make': str, 'model': str, 'year': int, 'license_plate': str, 'vin': str})
def update_vehicle(vehicle_id):
    try:
        vehicle_data = request.get_json()
        vehicle = VehicleService.update_vehicle(vehicle_id, vehicle_data)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        return jsonify(vehicle.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update vehicle', 'message': str(e)}), 500

@vehicle_bp.route('/<int:vehicle_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_vehicle(vehicle_id):
    try:
        success = VehicleService.delete_vehicle(vehicle_id)
        if not success:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        return jsonify({'message': 'Vehicle deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete vehicle', 'message': str(e)}), 500
