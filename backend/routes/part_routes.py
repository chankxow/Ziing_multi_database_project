from flask import Blueprint, request, jsonify
from services.part_service import PartService
from middleware.auth import token_required, role_required
from middleware.validation import validate_json

part_bp = Blueprint('parts', __name__, url_prefix='/parts')

@part_bp.route('', methods=['GET'])
@token_required
def get_all_parts():
    try:
        parts = PartService.get_all_parts()
        return jsonify([part.to_dict() for part in parts]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch parts', 'message': str(e)}), 500

@part_bp.route('/<part_id>', methods=['GET'])
@token_required
def get_part(part_id):
    try:
        part = PartService.get_part_by_id(part_id)
        if not part:
            return jsonify({'error': 'Part not found'}), 404
        
        return jsonify(part.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch part', 'message': str(e)}), 500

@part_bp.route('/category/<category>', methods=['GET'])
@token_required
def get_parts_by_category(category):
    try:
        parts = PartService.get_parts_by_category(category)
        return jsonify([part.to_dict() for part in parts]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch parts by category', 'message': str(e)}), 500

@part_bp.route('/search', methods=['GET'])
@token_required
def search_parts():
    try:
        query_text = request.args.get('q', '')
        if not query_text:
            return jsonify({'error': 'Search query is required'}), 400
        
        parts = PartService.search_parts(query_text)
        return jsonify([part.to_dict() for part in parts]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to search parts', 'message': str(e)}), 500

@part_bp.route('', methods=['POST'])
@token_required
@role_required('admin', 'manager')
@validate_json({'name': str, 'price': float, 'quantity': int})
def create_part():
    try:
        part_data = request.get_json()
        part = PartService.create_part(part_data)
        return jsonify(part.to_dict()), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create part', 'message': str(e)}), 500

@part_bp.route('/<part_id>', methods=['PUT'])
@token_required
@role_required('admin', 'manager')
@validate_json({'name': str, 'price': float, 'quantity': int})
def update_part(part_id):
    try:
        part_data = request.get_json()
        part = PartService.update_part(part_id, part_data)
        if not part:
            return jsonify({'error': 'Part not found'}), 404
        
        return jsonify(part.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update part', 'message': str(e)}), 500

@part_bp.route('/<part_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_part(part_id):
    try:
        success = PartService.delete_part(part_id)
        if not success:
            return jsonify({'error': 'Part not found'}), 404
        
        return jsonify({'message': 'Part deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete part', 'message': str(e)}), 500

@part_bp.route('/<part_id>/inventory', methods=['PATCH'])
@token_required
@role_required('admin', 'manager')
@validate_json({'quantity_change': int})
def update_inventory(part_id):
    try:
        inventory_data = request.get_json()
        part = PartService.update_inventory(part_id, inventory_data['quantity_change'])
        if not part:
            return jsonify({'error': 'Part not found'}), 404
        
        return jsonify(part.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update inventory', 'message': str(e)}), 500
