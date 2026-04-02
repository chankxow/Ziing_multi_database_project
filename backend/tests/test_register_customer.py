from unittest.mock import MagicMock, patch

def test_register_success(client, mock_db):
    mock_query, _ = mock_db

    # check duplicate username → ไม่พบ user
    mock_query.return_value = []

    # Mock get_connection ที่ register_customer ใช้โดยตรง
    mock_cursor = MagicMock()
    mock_cursor.lastrowid = 42
    mock_conn = MagicMock()
    mock_conn.cursor.return_value.__enter__ = MagicMock(return_value=mock_cursor)
    mock_conn.cursor.return_value.__exit__ = MagicMock(return_value=False)

    with patch("app.get_connection", return_value=mock_conn):
        res = client.post("/register/customer", json={
            "username": "newuser",
            "password": "1234",
            "firstName": "Test",
            "lastName": "User"
        })

    assert res.status_code == 201