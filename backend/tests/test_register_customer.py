def test_register_success(client, mock_db):
    mock_query, mock_execute = mock_db

    mock_query.side_effect = [
        [],   # check duplicate username
        [{"id": 1}]  # LAST_INSERT_ID
    ]

    res = client.post("/register/customer", json={
        "username": "newuser",
        "password": "1234",
        "firstName": "Test",
        "lastName": "User"
    })

    assert res.status_code == 201
    