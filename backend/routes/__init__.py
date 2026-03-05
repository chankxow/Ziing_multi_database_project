from .customer_routes import customer_bp
from .vehicle_routes import vehicle_bp
from .work_order_routes import work_order_bp
from .part_routes import part_bp
from .auth_routes import auth_bp

__all__ = ['customer_bp', 'vehicle_bp', 'work_order_bp', 'part_bp', 'auth_bp']
