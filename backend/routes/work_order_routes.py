from flask import Blueprint, request, jsonify
from services.work_order_service import WorkOrderService
from middleware.auth import token_required, role_required
from middleware.validation import validate_json

work_order_bp = Blueprint('work_orders', __name__, url_prefix='/workorders')

@work_order_bp.route('', methods=['GET'])
@token_required
@role_required('admin', 'manager', 'mechanic')
def get_all_work_orders():
    try:
        work_orders = WorkOrderService.get_all_work_orders()
        return jsonify([work_order.to_dict() for work_order in work_orders]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch work orders', 'message': str(e)}), 500

@work_order_bp.route('/<int:work_order_id>', methods=['GET'])
@token_required
def get_work_order(work_order_id):
    try:
        work_order = WorkOrderService.get_work_order_by_id(work_order_id)
        if not work_order:
            return jsonify({'error': 'Work order not found'}), 404
        
        # Check access permissions
        if (request.current_user_role == 'customer' and 
            request.current_customer_id != work_order.customer_id):
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify(work_order.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch work order', 'message': str(e)}), 500

@work_order_bp.route('/customer/<int:customer_id>', methods=['GET'])
@token_required
def get_work_orders_by_customer(customer_id):
    try:
        # Customers can only view their own work orders
        if (request.current_user_role == 'customer' and 
            request.current_customer_id != customer_id):
            return jsonify({'error': 'Access denied'}), 403
        
        work_orders = WorkOrderService.get_work_orders_by_customer(customer_id)
        return jsonify([work_order.to_dict() for work_order in work_orders]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch work orders', 'message': str(e)}), 500

@work_order_bp.route('', methods=['POST'])
@token_required
@role_required('admin', 'manager', 'mechanic')
@validate_json({'customer_id': int, 'vehicle_id': int, 'description': str})
def create_work_order():
    try:
        work_order_data = request.get_json()
        work_order = WorkOrderService.create_work_order(work_order_data)
        return jsonify(work_order.to_dict()), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create work order', 'message': str(e)}), 500

@work_order_bp.route('/<int:work_order_id>', methods=['PUT'])
@token_required
@role_required('admin', 'manager', 'mechanic')
@validate_json({'customer_id': int, 'vehicle_id': int, 'description': str, 'status': str, 'total_cost': float, 'labor_hours': float})
def update_work_order(work_order_id):
    try:
        work_order_data = request.get_json()
        work_order = WorkOrderService.update_work_order(work_order_id, work_order_data)
        if not work_order:
            return jsonify({'error': 'Work order not found'}), 404
        
        return jsonify(work_order.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update work order', 'message': str(e)}), 500

@work_order_bp.route('/<int:work_order_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_work_order(work_order_id):
    try:
        success = WorkOrderService.delete_work_order(work_order_id)
        if not success:
            return jsonify({'error': 'Work order not found'}), 404
        
        return jsonify({'message': 'Work order deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete work order', 'message': str(e)}), 500

@work_order_bp.route('/<int:work_order_id>/status', methods=['PATCH'])
@token_required
@role_required('admin', 'manager', 'mechanic')
@validate_json({'status': str})
def update_work_order_status(work_order_id):
    try:
        status_data = request.get_json()
        work_order = WorkOrderService.get_work_order_by_id(work_order_id)
        if not work_order:
            return jsonify({'error': 'Work order not found'}), 404
        
        # Update only the status
        work_order_data = {
            'customer_id': work_order.customer_id,
            'vehicle_id': work_order.vehicle_id,
            'description': work_order.description,
            'status': status_data['status'],
            'total_cost': work_order.total_cost,
            'parts_used': work_order.parts_used,
            'labor_hours': work_order.labor_hours
        }
        
        updated_work_order = WorkOrderService.update_work_order(work_order_id, work_order_data)
        return jsonify(updated_work_order.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update work order status', 'message': str(e)}), 500
