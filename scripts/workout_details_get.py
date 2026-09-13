import requests

BASE_URL = "http://127.0.0.1:8000"

user1_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com", "password": "sahil"
})
user1_headers = {"Authorization": f"Bearer {user1_login.json()['access_token']}"}

user2_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user2@example.com", "password": "anotherpassword123"
})
user2_headers = {"Authorization": f"Bearer {user2_login.json()['access_token']}"}

# Legit: User 1 fetches their own session (id 1)
legit = requests.get(f"{BASE_URL}/workouts/1", headers=user1_headers)
print("LEGIT:", legit.status_code, legit.json())

# Attack: User 2 tries to fetch User 1's session
attack = requests.get(f"{BASE_URL}/workouts/1", headers=user2_headers)
print("ATTACK:", attack.status_code, attack.json())