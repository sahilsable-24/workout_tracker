def test_register_creates_user(client):
    response = client.post("/auth/register", json={
        "email": "newuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "newuser@example.com"
    assert "hashed_password" not in response.json()


def test_register_duplicate_email_fails(client):
    client.post("/auth/register", json={
        "email": "dupe@example.com",
        "password": "password123"
    })
    response = client.post("/auth/register", json={
        "email": "dupe@example.com",
        "password": "password123"
    })
    assert response.status_code == 409


def test_register_short_password_fails(client):
    response = client.post("/auth/register", json={
        "email": "shortpass@example.com",
        "password": "123"
    })
    assert response.status_code == 422


def test_login_with_correct_credentials_returns_token(client):
    client.post("/auth/register", json={
        "email": "loginuser@example.com",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "loginuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_with_wrong_password_fails(client):
    client.post("/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_me_returns_current_user_with_valid_token(client):
    client.post("/auth/register", json={
        "email": "meuser@example.com",
        "password": "password123"
    })
    login_resp = client.post("/auth/login", json={
        "email": "meuser@example.com",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "meuser@example.com"