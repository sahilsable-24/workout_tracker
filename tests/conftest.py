import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from database import Base, get_db
from main import app

TEST_DATABASE_URL = "postgresql://postgres:1234@localhost:5432/workout_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(client):
    def _make_user(email: str, password: str = "password123"):
        client.post("/auth/register", json={"email": email, "password": password})
        login_resp = client.post("/auth/login", json={"email": email, "password": password})
        token = login_resp.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    return _make_user