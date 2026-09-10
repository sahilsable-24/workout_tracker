import requests

login_resp = requests.post("http://127.0.0.1:8000/auth/login", json={
    "email": "sahil@example.com",
    "password": "sahil"
})
token = login_resp.json()["access_token"]
print("LOGIN:", login_resp.status_code, login_resp.json())

# 2. No token
no_token_resp = requests.get("http://127.0.0.1:8000/auth/me")
print("NO TOKEN:", no_token_resp.status_code, no_token_resp.json())

# 3. Garbage token
garbage_resp = requests.get("http://127.0.0.1:8000/auth/me", headers={
    "Authorization": "Bearer notarealtoken"
})
print("GARBAGE TOKEN:", garbage_resp.status_code, garbage_resp.json())

# 4. Real token
real_resp = requests.get("http://127.0.0.1:8000/auth/me", headers={
    "Authorization": f"Bearer {token}"
})
print("REAL TOKEN:", real_resp.status_code, real_resp.json())