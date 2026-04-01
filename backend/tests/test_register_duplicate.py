def test_register_duplicate(client, mock_db):
    mock_query, _ = mock_db

    # mock ว่ามี user อยู่แล้ว
    mock_query.return_value = [{"UserID": 1}]

    response = client.post("/register/customer", json={
        "username": "existing_user",
        "password": "1234",
        "firstName": "Test",
        "lastName": "User"
    })

    assert response.status_code == 400