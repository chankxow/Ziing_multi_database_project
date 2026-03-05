from typing import Dict, Any, List, Tuple
from flask import request
import math

def format_response(success: bool, data: Any = None, message: str = "", status_code: int = 200) -> Tuple[Dict[str, Any], int]:
    """Format API response consistently"""
    response = {
        'success': success,
        'message': message
    }
    
    if data is not None:
        response['data'] = data
    
    return response, status_code

def paginate_results(items: List[Any], page: int = 1, per_page: int = 10, total: int = None) -> Dict[str, Any]:
    """Paginate results and return pagination metadata"""
    if total is None:
        total = len(items)
    
    # Calculate pagination
    total_pages = math.ceil(total / per_page)
    start_index = (page - 1) * per_page
    end_index = start_index + per_page
    
    # Get items for current page
    paginated_items = items[start_index:end_index]
    
    return {
        'items': paginated_items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }

def calculate_total_cost(parts_cost: float, labor_hours: float, labor_rate: float = 50.0) -> float:
    """Calculate total cost including parts and labor"""
    labor_cost = labor_hours * labor_rate
    return parts_cost + labor_cost

def get_pagination_params() -> Tuple[int, int]:
    """Get pagination parameters from request"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Validate and limit per_page
    per_page = min(max(per_page, 1), 100)  # Between 1 and 100
    page = max(page, 1)  # At least 1
    
    return page, per_page

def format_currency(amount: float, currency: str = 'USD') -> str:
    """Format currency amount"""
    return f"{currency} {amount:.2f}"

def sanitize_string(text: str) -> str:
    """Sanitize string input"""
    if not text:
        return ""
    return text.strip().replace('<', '&lt;').replace('>', '&gt;')

def build_query_string(filters: Dict[str, Any]) -> str:
    """Build query string from filters"""
    query_parts = []
    for key, value in filters.items():
        if value is not None and value != "":
            query_parts.append(f"{key}={value}")
    return "&".join(query_parts)

def extract_search_params() -> Dict[str, Any]:
    """Extract search and filter parameters from request"""
    return {
        'search': request.args.get('search', '').strip(),
        'category': request.args.get('category', '').strip(),
        'status': request.args.get('status', '').strip(),
        'sort_by': request.args.get('sort_by', 'created_at'),
        'sort_order': request.args.get('sort_order', 'desc'),
        'page': request.args.get('page', 1, type=int),
        'per_page': request.args.get('per_page', 10, type=int)
    }
