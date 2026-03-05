from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import os
from datetime import datetime

# Import configuration
from database import check_db_connection

# Import middleware
from middleware.error_handler import error_handler
from utils.logger import setup_logger

# Import routes
from routes import (
    customer_bp, vehicle_bp, work_order_bp, part_bp, auth_bp
)

def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure CORS with more permissive settings
    CORS(app, 
         origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    # Setup rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )
    
    # Setup logging
    log_dir = os.path.join(os.path.dirname(__file__), 'logs')
    log_file = os.path.join(log_dir, 'app.log')
    app.logger = setup_logger('car_custom_shop', log_file)
    
    # Check database connections
    try:
        check_db_connection()
        app.logger.info("Database connections established successfully")
    except Exception as e:
        app.logger.error(f"Database connection failed: {str(e)}")
    
    # Register error handlers
    error_handler(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(vehicle_bp)
    app.register_blueprint(work_order_bp)
    app.register_blueprint(part_bp)
    
    # Health check endpoint
    @app.route('/health')
    @limiter.limit("10 per minute")
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '2.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/')
    @limiter.limit("10 per minute")
    def root():
        return jsonify({
            'message': 'Car Customization Shop API',
            'version': '2.0.0',
            'endpoints': {
                'auth': '/auth',
                'customers': '/customers',
                'vehicles': '/vehicles',
                'work_orders': '/workorders',
                'parts': '/parts',
                'health': '/health'
            }
        }), 200
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
