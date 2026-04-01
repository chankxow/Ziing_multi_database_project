from unittest.mock import patch
from tests.utils import generate_token

def test_get_staff_success(client):
    token = generate_token(role=1)

    fake_data = [{
        "UserID": 1,
        "Username": "admin",
        "FirstName": "John",
        "LastName": "Doe",
        "IsActive": True,
        "CreatedDate": "2024-01-01",
        "RoleID": 1,
        "RoleName": "Admin"
    }]

    with patch("app.query", return_value=fake_data):
        res = client.get(
            "/users/staff",
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    assert isinstance(res.get_json(), list)


def test_get_staff_no_token(client):
    res = client.get("/users/staff")
    assert res.status_code == 401