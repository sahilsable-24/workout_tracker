import requests

BASE_URL = "http://127.0.0.1:8000"

# User 1 — already has a session (id: 1) from before
user1_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com",
    "password": "sahil"
})
user1_token = user1_login.json()["access_token"]
user1_headers = {"Authorization": f"Bearer {user1_token}"}

user1_sessions = requests.get(f"{BASE_URL}/workouts/", headers=user1_headers)
print("USER 1 SESSIONS:", user1_sessions.status_code, user1_sessions.json())

# User 2 — brand new, register + login
requests.post(f"{BASE_URL}/auth/register", json={
    "email": "user2@example.com",
    "password": "anotherpassword123"
})
user2_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user2@example.com",
    "password": "anotherpassword123"
})
user2_token = user2_login.json()["access_token"]
user2_headers = {"Authorization": f"Bearer {user2_token}"}

user2_sessions = requests.get(f"{BASE_URL}/workouts/", headers=user2_headers)
print("USER 2 SESSIONS:", user2_sessions.status_code, user2_sessions.json())