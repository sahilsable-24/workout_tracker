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

# User 2 attacks User 1's session (id: 1)
attack = requests.post(f"{BASE_URL}/workouts/1/exercises", json={"exercise_id": 1}, headers=user2_headers)
print("ATTACK:", attack.status_code, attack.json())

# User 1 does it legitimately on their own session
legit = requests.post(f"{BASE_URL}/workouts/1/exercises", json={"exercise_id": 1}, headers=user1_headers)
print("LEGIT:", legit.status_code, legit.json())