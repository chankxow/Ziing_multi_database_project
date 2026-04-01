import jwt
from config import JWT_SECRET_KEY, JWT_ALGORITHM

def generate_token(user_id=1, role=1, customer_id=None):
    payload = {
        "user_id": user_id,
        "role": role,
        "customer_id": customer_id
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)