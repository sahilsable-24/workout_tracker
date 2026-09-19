from fastapi import FastAPI
from settings import settings
from auth.router import router as auth_router
from workouts.router import router as workouts_router
from progress.router import router as progress_router
from fastapi.middleware.cors import CORSMiddleware
from ai.router import router as ai_router

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
def health():
    return {'status': 'ok'}

app.include_router(auth_router)
app.include_router(workouts_router)
app.include_router(progress_router)
app.include_router(ai_router)