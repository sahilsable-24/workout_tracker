import requests

BASE_URL = "http://127.0.0.1:8000"

login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "sahil@example.com", "password": "sahil"
})
headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

resp = requests.post(f"{BASE_URL}/ai/chat", json={
    "messages": [{"role": "user", "content": "How has my bench press been going?"}]
}, headers=headers)

print(resp.status_code)
print(resp.json())