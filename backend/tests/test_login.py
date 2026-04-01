import bcrypt

def test_login_success(client, mock_db):
    mock_query, _ = mock_db

    mock_user = {
        "UserID": 1,
        "Username": "test",
        "PasswordHash": bcrypt.hashpw("1234".encode(), bcrypt.gensalt()).decode(),
        "RoleID": 1,
        "RoleName": "Admin"
    }

    mock_query.return_value = [mock_user]

    res = client.post("/login", json={
        "username": "test",
        "password": "1234"
    })

    assert res.status_code == 200
    assert "token" in res.get_json()    