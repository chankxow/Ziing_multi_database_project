import logging
import os
from datetime import datetime
from flask import request
from typing import Dict, Any

def setup_logger(name: str, log_file: str = None, level: int = logging.INFO) -> logging.Logger:
    """Setup logger with file and console handlers"""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (if log_file is provided)
    if log_file:
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger

def log_request(logger: logging.Logger, user_id: int = None, action: str = ""):
    """Log API request with user context"""
    timestamp = datetime.now().isoformat()
    method = request.method
    endpoint = request.endpoint
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    log_message = (
        f"Request - Method: {method}, Endpoint: {endpoint}, "
        f"IP: {ip_address}, User-Agent: {user_agent}"
    )
    
    if user_id:
        log_message += f", User ID: {user_id}"
    
    if action:
        log_message += f", Action: {action}"
    
    logger.info(log_message)

def log_error(logger: logging.Logger, error: Exception, context: Dict[str, Any] = None):
    """Log error with context information"""
    timestamp = datetime.now().isoformat()
    error_type = type(error).__name__
    error_message = str(error)
    
    log_message = f"Error - Type: {error_type}, Message: {error_message}"
    
    if context:
        context_str = ", ".join([f"{k}: {v}" for k, v in context.items()])
        log_message += f", Context: {context_str}"
    
    logger.error(log_message, exc_info=True)

def log_database_operation(logger: logging.Logger, operation: str, table: str, 
                          user_id: int = None, record_id: int = None):
    """Log database operations"""
    timestamp = datetime.now().isoformat()
    
    log_message = f"DB Operation - Operation: {operation}, Table: {table}"
    
    if user_id:
        log_message += f", User ID: {user_id}"
    
    if record_id:
        log_message += f", Record ID: {record_id}"
    
    logger.info(log_message)

def log_security_event(logger: logging.Logger, event_type: str, severity: str = 'INFO',
                      user_id: int = None, ip_address: str = None, details: str = ""):
    """Log security-related events"""
    timestamp = datetime.now().isoformat()
    
    log_message = f"Security Event - Type: {event_type}, Severity: {severity}"
    
    if user_id:
        log_message += f", User ID: {user_id}"
    
    if ip_address:
        log_message += f", IP: {ip_address}"
    else:
        log_message += f", IP: {request.remote_addr}"
    
    if details:
        log_message += f", Details: {details}"
    
    if severity.upper() == 'CRITICAL':
        logger.critical(log_message)
    elif severity.upper() == 'WARNING':
        logger.warning(log_message)
    else:
        logger.info(log_message)
