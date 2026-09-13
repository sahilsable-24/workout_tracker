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

# workout_exercise id 1 belongs to User 1 (created earlier)

# User 2 attacks — tries to log a set on User 1's workout-exercise
attack = requests.post(
    f"{BASE_URL}/workouts/workout-exercises/1/sets",
    json={"reps": 10, "weight": 60.0},
    headers=user2_headers
)
print("ATTACK:", attack.status_code, attack.json())

# User 1 does it legitimately
legit = requests.post(
    f"{BASE_URL}/workouts/workout-exercises/1/sets",
    json={"reps": 10, "weight": 60.0},
    headers=user1_headers
)
print("LEGIT:", legit.status_code, legit.json())