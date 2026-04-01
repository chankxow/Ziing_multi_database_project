from unittest.mock import patch

class FakeCollection:
    def find(self, *args, **kwargs):
        return [{"part_id": "P001", "name": "Brake Pad", "stock": 10}]

def fake_decode(*args, **kwargs):
    return {"user_id": 1, "role": 1}

@patch("app.jwt.decode", side_effect=fake_decode)
def test_get_parts(mock_jwt, client):

    with patch("app.get_parts_collection", return_value=FakeCollection()):
        res = client.get("/parts", headers={
            "Authorization": "Bearer faketoken"
        })

        assert res.status_code == 200