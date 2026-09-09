from fastapi import FastAPI
from settings import settings
from auth.router import router as auth_router

app = FastAPI(title=settings.app_name)

@app.get("/health")
def health():
    return {'status': 'ok'}

app.include_router(auth_router)