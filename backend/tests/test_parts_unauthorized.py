def test_parts_unauthorized(client):
    response = client.get("/parts")

    assert response.status_code in [401, 403]