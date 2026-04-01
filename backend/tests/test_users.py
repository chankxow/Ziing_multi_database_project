from unittest.mock import patch

def fake_decode(*args, **kwargs):
    return {
        "user_id": 1,
        "role": 1,
        "customer_id": None
    }

@patch("app.jwt.decode", side_effect=fake_decode)
def test_get_staff(mock_jwt, client):

    with patch("app.query", return_value=[]):
        res = client.get("/users/staff", headers={
            "Authorization": "Bearer faketoken"
        })

        assert res.status_code == 200