from unittest.mock import patch
import bcrypt

def test_login_success(client):
    fake_password = "1234"
    hashed = bcrypt.hashpw(fake_password.encode(), bcrypt.gensalt())

    fake_user = [{
        "UserID": 1,
        "Username": "test",
        "PasswordHash": hashed,
        "RoleID": 1,
        "RoleName": "Admin"
    }]

    with patch("app.query", return_value=fake_user):
        res = client.post("/login", json={
            "username": "test",
            "password": "1234"
        })

        assert res.status_code == 200