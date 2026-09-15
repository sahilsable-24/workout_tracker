from fastapi import APIRouter, HTTPException, Depends, status
from database import get_db
from auth.jwt import get_current_user
from auth.models import User
from progress.schemas import ProgressOut
from workouts.models import WorkoutExercise,WorkoutSession
from datetime import date, timedelta
from sqlalchemy.orm import Session

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/summary", response_model=ProgressOut)
def get_progress_summary(
    current_user : User = Depends(get_current_user),
    db : Session = Depends(get_db) 
):

    seven_days_ago = date.today() - timedelta(7)
    thirty_days_ago = date.today() - timedelta(30)

    seven_day_count = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.workout_date >= seven_days_ago
    ).count()

    thirty_day_count = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.workout_date >= thirty_days_ago
    ).count()


    return {
        "workout_last_7_days": seven_day_count,
        "workout_last_30_days": thirty_day_count,
    }