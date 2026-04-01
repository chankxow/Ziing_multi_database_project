from unittest.mock import patch
import bcrypt

def test_login_success(client):
    fake_user = [{
        "UserID": 1,
        "Username": "admin",
        "PasswordHash": bcrypt.hashpw(b"1234", bcrypt.gensalt()),
        "RoleID": 1,
        "RoleName": "Admin",
        "CustomerID": None
    }]

    with patch("app.query", return_value=fake_user):
        res = client.post("/login", json={
            "username": "admin",
            "password": "1234"
        })

    assert res.status_code == 200
    assert "token" in res.get_json()


def test_login_fail(client):
    with patch("app.query", return_value=[]):
        res = client.post("/login", json={
            "username": "wrong",
            "password": "1234"
        })

    assert res.status_code == 401