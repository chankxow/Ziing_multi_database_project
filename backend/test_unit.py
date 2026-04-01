#!/usr/bin/env python3
"""
Unit tests สำหรับ backend - ไม่ต้องใช้ requests
"""

import pytest
import bcrypt
from app import app
from db_mysql import query, execute

@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def cleanup_test_data():
    """Cleanup test data before and after each test"""
    # Clean up before test
    try:
        execute("DELETE FROM user WHERE Username LIKE 'test_%'")
        execute("DELETE FROM customer WHERE FirstName LIKE 'Test%'")
    except:
        pass
    
    yield
    
    # Clean up after test
    try:
        execute("DELETE FROM user WHERE Username LIKE 'test_%'")
        execute("DELETE FROM customer WHERE FirstName LIKE 'Test%'")
    except:
        pass

def test_login_success(client):
    """Test login success"""
    # Create test user
    hashed = bcrypt.hashpw("test123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    execute("INSERT INTO user (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s,%s,%s,%s,%s)",
            ("test_user", hashed, "Test", "User", 1))
    
    # Test login
    response = client.post('/login', 
                          json={"username": "test_user", "password": "test123"},
                          content_type='application/json')
    
    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
    assert data["message"] == "Login successful"

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/login',
                          json={"username": "nonexistent", "password": "wrong"},
                          content_type='application/json')
    
    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Invalid credentials"

def test_register_success(client):
    """Test register success"""
    response = client.post('/register/customer',
                          json={
                              "username": "test_newuser",
                              "password": "test123",
                              "firstName": "Test",
                              "lastName": "User",
                              "phone": "0801234567",
                              "email": "test@example.com"
                          },
                          content_type='application/json')
    
    assert response.status_code == 201
    data = response.get_json()
    assert data["status"] == "registered"
    assert "customer_id" in data

def test_register_duplicate_username(client, cleanup_test_user):
    """Test register with duplicate username"""
    # Create existing user
    hashed = bcrypt.hashpw("test123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    execute("INSERT INTO user (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s,%s,%s,%s,%s)",
            ("test_duplicate", hashed, "Test", "User", 1))
    
    # Try to register same username
    response = client.post('/register/customer',
                          json={
                              "username": "test_duplicate",
                              "password": "test123",
                              "firstName": "Test",
                              "lastName": "User"
                          },
                          content_type='application/json')
    
    assert response.status_code == 400
    data = response.get_json()
    assert "Username already exists" in data["error"]

def test_home_endpoint(client):
    """Test home endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Backend Running"

def test_parts_endpoint(client):
    """Test parts endpoint (requires auth)"""
    # First login to get token
    hashed = bcrypt.hashpw("test123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    execute("INSERT INTO user (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s,%s,%s,%s,%s)",
            ("test_parts", hashed, "Test", "User", 1))
    
    login_response = client.post('/login', 
                               json={"username": "test_parts", "password": "test123"},
                               content_type='application/json')
    
    token = login_response.get_json()["token"]
    
    # Test parts with token
    response = client.get('/parts', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
