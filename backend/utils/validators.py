import re
from typing import Dict, Any, List

def validate_customer_data(data: Dict[str, Any]) -> List[str]:
    """Validate customer data and return list of errors"""
    errors = []
    
    # Name validation
    if not data.get('name', '').strip():
        errors.append('Name is required')
    elif len(data['name'].strip()) < 2:
        errors.append('Name must be at least 2 characters long')
    
    # Email validation
    email = data.get('email', '').strip()
    if not email:
        errors.append('Email is required')
    elif not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        errors.append('Invalid email format')
    
    # Phone validation
    phone = data.get('phone', '').strip()
    if not phone:
        errors.append('Phone is required')
    elif not re.match(r'^[+]?[\d\s\-\(\)]{10,}$', phone):
        errors.append('Invalid phone format')
    
    # Address validation
    if not data.get('address', '').strip():
        errors.append('Address is required')
    
    return errors

def validate_vehicle_data(data: Dict[str, Any]) -> List[str]:
    """Validate vehicle data and return list of errors"""
    errors = []
    
    # Customer ID validation
    if not data.get('customer_id'):
        errors.append('Customer ID is required')
    elif not isinstance(data['customer_id'], int) or data['customer_id'] <= 0:
        errors.append('Invalid customer ID')
    
    # Make validation
    if not data.get('make', '').strip():
        errors.append('Vehicle make is required')
    
    # Model validation
    if not data.get('model', '').strip():
        errors.append('Vehicle model is required')
    
    # Year validation
    year = data.get('year')
    if not year:
        errors.append('Year is required')
    elif not isinstance(year, int) or year < 1900 or year > 2100:
        errors.append('Invalid year (must be between 1900 and 2100)')
    
    # License plate validation
    if not data.get('license_plate', '').strip():
        errors.append('License plate is required')
    
    # VIN validation (optional but if provided, should be valid)
    vin = data.get('vin', '').strip()
    if vin and len(vin) != 17:
        errors.append('VIN must be exactly 17 characters long')
    
    return errors

def validate_work_order_data(data: Dict[str, Any]) -> List[str]:
    """Validate work order data and return list of errors"""
    errors = []
    
    # Customer ID validation
    if not data.get('customer_id'):
        errors.append('Customer ID is required')
    elif not isinstance(data['customer_id'], int) or data['customer_id'] <= 0:
        errors.append('Invalid customer ID')
    
    # Vehicle ID validation
    if not data.get('vehicle_id'):
        errors.append('Vehicle ID is required')
    elif not isinstance(data['vehicle_id'], int) or data['vehicle_id'] <= 0:
        errors.append('Invalid vehicle ID')
    
    # Description validation
    if not data.get('description', '').strip():
        errors.append('Description is required')
    elif len(data['description'].strip()) < 10:
        errors.append('Description must be at least 10 characters long')
    
    # Status validation
    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    status = data.get('status', 'pending')
    if status not in valid_statuses:
        errors.append(f'Invalid status. Must be one of: {", ".join(valid_statuses)}')
    
    # Total cost validation
    total_cost = data.get('total_cost', 0)
    if not isinstance(total_cost, (int, float)) or total_cost < 0:
        errors.append('Total cost must be a non-negative number')
    
    # Labor hours validation
    labor_hours = data.get('labor_hours', 0)
    if not isinstance(labor_hours, (int, float)) or labor_hours < 0:
        errors.append('Labor hours must be a non-negative number')
    
    return errors

def validate_part_data(data: Dict[str, Any]) -> List[str]:
    """Validate part data and return list of errors"""
    errors = []
    
    # Name validation
    if not data.get('name', '').strip():
        errors.append('Part name is required')
    
    # Price validation
    price = data.get('price', 0)
    if not isinstance(price, (int, float)) or price < 0:
        errors.append('Price must be a non-negative number')
    
    # Quantity validation
    quantity = data.get('quantity', 0)
    if not isinstance(quantity, int) or quantity < 0:
        errors.append('Quantity must be a non-negative integer')
    
    # Part number validation (optional but if provided, should be unique)
    part_number = data.get('part_number', '').strip()
    if part_number and len(part_number) < 3:
        errors.append('Part number must be at least 3 characters long')
    
    return errors
