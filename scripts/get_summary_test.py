import requests

BASE_URL = "http://127.0.0.1:8000"


#User 1 Summary
user1_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com", "password": "sahil"
})
user1_headers = {"Authorization": f"Bearer {user1_login.json()['access_token']}"}

summary = requests.get(f"{BASE_URL}/progress/summary", headers=user1_headers)
print("User_1 Summary:", summary.status_code, summary.json())

#User 2 Summary
user2_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user2@example.com", "password": "anotherpassword123"
})
user2_headers = {"Authorization": f"Bearer {user2_login.json()['access_token']}"}

summary = requests.get(f"{BASE_URL}/progress/summary", headers=user2_headers)
print("User 2 Summary:", summary.status_code, summary.json())