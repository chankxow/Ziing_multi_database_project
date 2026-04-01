from unittest.mock import patch, MagicMock
from tests.utils import generate_token

def test_get_parts(client):
    token = generate_token(role=1)

    mock_collection = MagicMock()
    mock_collection.find.return_value = [
        {"part_id": "p1", "name": "Brake", "stock": 10}
    ]

    with patch("app.get_parts_collection", return_value=mock_collection):
        res = client.get(
            "/parts",
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.get_json()
    assert data[0]["part_id"] == "p1"