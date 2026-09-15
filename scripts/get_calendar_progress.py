import requests

BASE_URL = "http://127.0.0.1:8000"

user1_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com", "password": "sahil"
})
headers = {"Authorization": f"Bearer {user1_login.json()['access_token']}"}

# Branch A: specific month (adjust to match your actual test session's month)
month_resp = requests.get(f"{BASE_URL}/progress/calendar?year=2026&month=9", headers=headers)
print("MONTH:", month_resp.status_code, month_resp.json())

# Branch B: year-wide breakdown
year_resp = requests.get(f"{BASE_URL}/progress/calendar?year=2026", headers=headers)
print("YEAR:", year_resp.status_code, year_resp.json())

# Validation: month without year should be 400
bad_resp = requests.get(f"{BASE_URL}/progress/calendar?month=9", headers=headers)
print("BAD REQUEST:", bad_resp.status_code, bad_resp.json())