import pytest
import sys
import os

# 👇 เอา path backend เข้า Python
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

print("DEBUG PATH:", BASE_DIR)

from app import app   # ✅ ใช้ได้แล้ว

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client