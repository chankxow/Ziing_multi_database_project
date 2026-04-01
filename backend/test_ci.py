#!/usr/bin/env python3
"""
CI Tests - ไม่ต้องเชื่อมต่อ database จริง
ใช้ mock แทน database connection
"""

import pytest
from unittest.mock import patch, MagicMock
import bcrypt
from app import app

@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_db():
    """Mock database functions"""
    with patch('app.query') as mock_query, \
         patch('app.execute') as mock_execute:
        # Mock query results
        mock_query.return_value = []
        mock_execute.return_value = None
        yield mock_query, mock_execute

def test_home_endpoint(client):
    """Test home endpoint (no database needed)"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Backend Running"

def test_login_success_mock(client, mock_db):
    """Test login success with mock database"""
    mock_query, mock_execute = mock_db
    
    # Mock user data
    mock_user = {
        'UserID': 1,
        'Username': 'test_user',
        'PasswordHash': bcrypt.hashpw('test123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'FirstName': 'Test',
        'LastName': 'User',
        'RoleID': 1,
        'RoleName': 'Admin'
    }
    mock_query.return_value = [mock_user]
    
    response = client.post('/login', 
                          json={"username": "test_user", "password": "test123"},
                          content_type='application/json')
    
    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
    assert data["message"] == "Login successful"

def test_login_invalid_credentials_mock(client, mock_db):
    """Test login with invalid credentials"""
    mock_query, mock_execute = mock_db
    mock_query.return_value = []  # No user found
    
    response = client.post('/login',
                          json={"username": "nonexistent", "password": "wrong"},
                          content_type='application/json')
    
    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Invalid credentials"

def test_register_success_mock(client, mock_db):
    """Test register success with mock database"""
    mock_query, mock_execute = mock_db
    
    # Mock username check (no existing user)
    mock_query.return_value = []
    
    # Mock customer ID
    mock_query.side_effect = [
        [],  # Username check
        [{'id': 1}]  # Customer ID
    ]
    
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

def test_register_duplicate_username_mock(client, mock_db):
    """Test register with duplicate username"""
    mock_query, mock_execute = mock_db
    
    # Mock existing user
    mock_query.return_value = [{'UserID': 1}]
    
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

def test_parts_endpoint_mock(client, mock_db):
    """Test parts endpoint with mock database"""
    mock_query, mock_execute = mock_db
    
    # Mock user for login
    mock_user = {
        'UserID': 1,
        'Username': 'test_parts',
        'PasswordHash': bcrypt.hashpw('test123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'FirstName': 'Test',
        'LastName': 'User',
        'RoleID': 1,
        'RoleName': 'Admin'
    }
    
    # Mock parts data
    mock_parts = [
        {'name': 'Engine Oil', 'category': 'Maintenance', 'price': 25.99},
        {'name': 'Brake Pads', 'category': 'Safety', 'price': 89.99}
    ]
    
    mock_query.side_effect = [
        [mock_user],  # Login query
        mock_parts    # Parts query
    ]
    
    # Login to get token
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
