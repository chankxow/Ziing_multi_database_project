import jwt
import bcrypt
import datetime
from typing import Optional, Dict, Any
from models.user import User, UserRole
from config import get_config
import logging

# Get configuration
config = get_config()

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    @staticmethod
    def generate_token(user: User) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value,
            'customer_id': user.customer_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=config.JWT_EXPIRATION_HOURS),
            'iat': datetime.datetime.utcnow()
        }
        return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)

    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            logging.warning("Token has expired")
            return None
        except jwt.InvalidTokenError:
            logging.warning("Invalid token")
            return None

    @staticmethod
    def authenticate_user(username: str, password: str) -> Optional[User]:
        """Authenticate user with username and password"""
        try:
            from database import query
            
            # Query users table for the username
            result = query("SELECT * FROM users WHERE username = %s", (username,))
            
            if not result:
                logging.info(f"User not found: {username}")
                return None
            
            user_data = result[0]
            
            # Verify the password
            if not AuthService.verify_password(password, user_data['password_hash']):
                logging.info(f"Invalid password for user: {username}")
                return None
            
            # Create and return user object
            user = User(
                id=user_data['id'],
                username=user_data['username'],
                email=user_data['email'],
                password_hash=user_data['password_hash'],
                role=UserRole(user_data['role']),
                customer_id=user_data.get('customer_id'),
                is_active=user_data['is_active']
            )
            
            logging.info(f"User authenticated successfully: {username}")
            return user
            
        except Exception as e:
            logging.error(f"Authentication error: {str(e)}")
            return None

    @staticmethod
    def create_user(user_data: Dict[str, Any]) -> User:
        """Create a new user"""
        try:
            from database import query
            
            # Hash the password
            hashed_password = AuthService.hash_password(user_data['password'])
            
            # Insert user into database
            query_str = """
                INSERT INTO users (username, email, password_hash, role, customer_id, is_active)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            user_id = query(query_str, (
                user_data['username'],
                user_data['email'],
                hashed_password,
                user_data.get('role', 'customer'),
                user_data.get('customer_id'),
                user_data.get('is_active', True)
            ))
            
            # Get the created user from database
            result = query("SELECT * FROM users WHERE id = %s", (user_id,))
            if result:
                user_record = result[0]
                user = User(
                    id=user_record['id'],
                    username=user_record['username'],
                    email=user_record['email'],
                    password_hash=user_record['password_hash'],
                    role=UserRole(user_record['role']),
                    customer_id=user_record.get('customer_id'),
                    is_active=user_record['is_active']
                )
                logging.info(f"Created new user: {user.username}")
                return user
            
            raise Exception("Failed to retrieve created user")
            
        except Exception as e:
            logging.error(f"Error creating user: {str(e)}")
            raise

    @staticmethod
    def change_password(user_id: int, old_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            # In a real implementation:
            # 1. Get current user from database
            # 2. Verify old password
            # 3. Hash new password
            # 4. Update database
            logging.info(f"Password change attempt for user ID: {user_id}")
            return True
        except Exception as e:
            logging.error(f"Error changing password: {str(e)}")
            return False

    @staticmethod
    def refresh_token(token: str) -> Optional[str]:
        """Refresh JWT token"""
        try:
            payload = AuthService.verify_token(token)
            if not payload:
                return None
            
            # Create new token with same user data
            new_payload = {
                'user_id': payload['user_id'],
                'username': payload['username'],
                'email': payload['email'],
                'role': payload['role'],
                'customer_id': payload.get('customer_id'),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=config.JWT_EXPIRATION_HOURS),
                'iat': datetime.datetime.utcnow()
            }
            return jwt.encode(new_payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
        except Exception as e:
            logging.error(f"Error refreshing token: {str(e)}")
            return None
