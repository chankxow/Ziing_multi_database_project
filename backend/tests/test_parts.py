import bcrypt

def test_parts_endpoint(client, mock_db, mock_mongo):
    mock_query, _ = mock_db

    # mock login
    mock_user = {
        "UserID": 1,
        "Username": "test",
        "PasswordHash": bcrypt.hashpw("1234".encode(), bcrypt.gensalt()).decode(),
        "RoleID": 1,
        "RoleName": "Admin"
    }

    mock_query.return_value = [mock_user]

    # mock mongo
    mock_mongo.find.return_value = [
        {"name": "Oil", "category": "Engine", "price": 100}
    ]

    # login
    login = client.post("/login", json={
        "username": "test",
        "password": "1234"
    })

    token = login.get_json()["token"]

    res = client.get("/parts", headers={
        "Authorization": f"Bearer {token}"
    })

    assert res.status_code == 200
    assert len(res.get_json()) > 0