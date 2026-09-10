# from sqlalchemy import text
# from database import engine

# with engine.connect() as conn:
#     result = conn.execute(text("SELECT 1"))
#     print(result.fetchone())


# # from security import hash_password,verify_password

# # h1 = hash_password("sahil")
# # h2 = hash_password("sahil")

# # print(h1)
# # print(h2)
# # print(h1 == h2)

# # print(verify_password("sahil",h1))
# # print(verify_password("sahils",h1))

# import secrets

# print(secrets.token_hex(32))

import requests

login_resp = requests.post("http://127.0.0.1:8000/auth/login", json={
    "email": "sahil@example.com",
    "password": "sahil"
})
token = login_resp.json()["access_token"]
print("Token:", token)

me_resp = requests.get("http://127.0.0.1:8000/auth/me", headers={
    "Authorization": f"Bearer {token}"
})
print(me_resp.status_code, me_resp.json())
