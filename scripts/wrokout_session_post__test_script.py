import requests

BASE_URL = "http://127.0.0.1:8000"

# 1. Log in (use a user you already registered)
login_resp = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com",
    "password": "sahil"
})
print("LOGIN:", login_resp.status_code, login_resp.json())

token = login_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Create a workout session
session_resp = requests.post(f"{BASE_URL}/workouts/", json={
    "workout_date": "2026-09-12",
    "muscle_group_ids": [1, 2]  # adjust to match your actual seeded IDs for Chest/Back
}, headers=headers)

print("CREATE SESSION:", session_resp.status_code)
print(session_resp.json())