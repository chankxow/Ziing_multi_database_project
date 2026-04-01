import pytest
from app import app as flask_app
from unittest.mock import MagicMock

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

        
def test_example(client):
    res = client.get("/")
    assert res.status_code == 200

# ✅ Mock MySQL
@pytest.fixture
def mock_db(monkeypatch):
    mock_query = MagicMock()
    mock_execute = MagicMock()

    monkeypatch.setattr("app.query", mock_query)
    monkeypatch.setattr("app.execute", mock_execute)

    return mock_query, mock_execute


# ✅ Mock MongoDB
@pytest.fixture
def mock_mongo(monkeypatch):
    mock_collection = MagicMock()

    monkeypatch.setattr("app.get_parts_collection", lambda: mock_collection)

    return mock_collection