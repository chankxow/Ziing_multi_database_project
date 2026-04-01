from unittest.mock import patch
from tests.utils import generate_token

def test_create_workorder(client):
    token = generate_token(role=1)

    with patch("app.execute"), \
         patch("app.query", return_value=[{"id": 1}]):

        res = client.post(
            "/workorders",
            json={
                "vehicle_id": 1,
                "user_id": 1,
                "description": "Test"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 201
    assert res.get_json()["work_order_id"] == 1