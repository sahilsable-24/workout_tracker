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
print("SETUP - session:", session_id, "workout_exercise:", we_id, "set:", set_id)

print("\n--- Testing PATCH (edit set) ---")

# Attack: User 2 tries to edit User 1's set
patch_attack = requests.patch(
    f"{BASE_URL}/workouts/workout-exercises/{we_id}/sets/{set_id}",
    json={"reps": 99, "weight": 999.0},
    headers=user2_headers
)
print("USER 2 PATCH ATTACK:", patch_attack.status_code, patch_attack.text)

# Legit: User 1 edits their own set
patch_legit = requests.patch(
    f"{BASE_URL}/workouts/workout-exercises/{we_id}/sets/{set_id}",
    json={"reps": 12, "weight": 65.0},
    headers=user1_headers
)
print("USER 1 PATCH:", patch_legit.status_code, patch_legit.json())

print("\n--- Testing DELETE exercise ---")

# Attack: User 2 tries to delete User 1's exercise from the session
delete_ex_attack = requests.delete(
    f"{BASE_URL}/workouts/{session_id}/exercises/{we_id}",
    headers=user2_headers
)
print("USER 2 DELETE EXERCISE ATTACK:", delete_ex_attack.status_code, delete_ex_attack.text)

# Legit: User 1 deletes their own exercise (should cascade-delete the set too)
delete_ex_legit = requests.delete(
    f"{BASE_URL}/workouts/{session_id}/exercises/{we_id}",
    headers=user1_headers
)
print("USER 1 DELETE EXERCISE:", delete_ex_legit.status_code)

# Confirm: session should now show zero exercises
check = requests.get(f"{BASE_URL}/workouts/{session_id}", headers=user1_headers)
print("SESSION AFTER DELETE:", check.json())