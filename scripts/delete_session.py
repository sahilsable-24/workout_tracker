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

# 1. User 1 creates a fresh session with a muscle group, no exercises
session_resp = requests.post(f"{BASE_URL}/workouts/", json={
    "workout_date": "2026-09-18",
    "muscle_group_ids": [1]
}, headers=user1_headers)
print("CREATE SESSION:", session_resp.status_code, session_resp.json())
session_id = session_resp.json()["id"]

# 2. User 2 tries to delete User 1's session -> should be 404
attack = requests.delete(f"{BASE_URL}/workouts/{session_id}", headers=user2_headers)
print("USER 2 DELETE ATTEMPT:", attack.status_code, attack.text)

# 3. User 1 deletes their own empty session -> should be 204
legit = requests.delete(f"{BASE_URL}/workouts/{session_id}", headers=user1_headers)
print("USER 1 DELETE:", legit.status_code)

# 4. Confirm it's actually gone -> fetching it should now 404
check = requests.get(f"{BASE_URL}/workouts/{session_id}", headers=user1_headers)
print("FETCH AFTER DELETE:", check.status_code, check.text)