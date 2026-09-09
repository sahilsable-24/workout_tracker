from sqlalchemy import text
from database import engine

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print(result.fetchone())


# from security import hash_password,verify_password

# h1 = hash_password("sahil")
# h2 = hash_password("sahil")

# print(h1)
# print(h2)
# print(h1 == h2)

# print(verify_password("sahil",h1))
# print(verify_password("sahils",h1))
