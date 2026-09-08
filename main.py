from fastapi import FastAPI
from settings import settings

app = FastAPI(title=settings.app_name)

@app.get("/health")
def health():
    return {'status': 'ok'}