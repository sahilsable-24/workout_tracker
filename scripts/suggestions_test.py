import requests

BASE_URL = "http://127.0.0.1:8000"

login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com", "password": "sahil"
})
headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

# Create a new session
session_resp = requests.post(f"{BASE_URL}/workouts/", json={
    "workout_date": "2026-09-15",
    "muscle_group_ids": [1]
}, headers=headers)
print("NEW SESSION:", session_resp.status_code, session_resp.json())
new_session_id = session_resp.json()["id"]

# Add Bench Press to it (exercise_id=1, per your earlier seeding)
we_resp = requests.post(f"{BASE_URL}/workouts/{new_session_id}/exercises", json={
    "exercise_id": 1
}, headers=headers)
print("WORKOUT EXERCISE:", we_resp.status_code, we_resp.json())
new_we_id = we_resp.json()["id"]

# Log a set matching last time's reps at the same weight -> should trigger INCREASE_REPS
set_resp = requests.post(f"{BASE_URL}/workouts/workout-exercises/{new_we_id}/sets", json={
    "reps": 10, "weight": 60.0
}, headers=headers)
print("SET:", set_resp.status_code, set_resp.json())

# Now get the suggestion
suggestion_resp = requests.get(f"{BASE_URL}/progress/suggestion/1", headers=headers)
print("SUGGESTION:", suggestion_resp.status_code, suggestion_resp.json())