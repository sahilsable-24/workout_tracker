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

# Setup: User 1 creates a session, adds an exercise, logs a set
session_resp = requests.post(f"{BASE_URL}/workouts/", json={
    "workout_date": "2026-09-18", "muscle_group_ids": [1]
}, headers=user1_headers)
session_id = session_resp.json()["id"]

we_resp = requests.post(f"{BASE_URL}/workouts/{session_id}/exercises", json={
    "exercise_id": 1
}, headers=user1_headers)
we_id = we_resp.json()["id"]

set_resp = requests.post(f"{BASE_URL}/workouts/workout-exercises/{we_id}/sets", json={
    "reps": 10, "weight": 60.0
}, headers=user1_headers)
set_id = set_resp.json()["id"]
print("SETUP - created set:", set_id)

# Attack: User 2 tries to delete User 1's set
attack = requests.delete(f"{BASE_URL}/workouts/workout-exercises/{we_id}/sets/{set_id}", headers=user2_headers)
print("USER 2 ATTACK:", attack.status_code, attack.text)

# Legit: User 1 deletes their own set
legit = requests.delete(f"{BASE_URL}/workouts/workout-exercises/{we_id}/sets/{set_id}", headers=user1_headers)
print("USER 1 DELETE:", legit.status_code)

# Confirm: fetching the session should no longer show this set
check = requests.get(f"{BASE_URL}/workouts/{session_id}", headers=user1_headers)
print("SESSION AFTER DELETE:", check.json())