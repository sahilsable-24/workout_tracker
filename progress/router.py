from fastapi import APIRouter, HTTPException, Depends, status
from database import get_db
from auth.jwt import get_current_user
from auth.models import User
from progress.schemas import ProgressOut, CalendarMonthOut, CalendarYearOut
from workouts.models import WorkoutExercise,WorkoutSession
from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from progress.engine import SuggestionType,suggest_progression

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

@router.get("/calendar", response_model= CalendarYearOut | CalendarMonthOut)
def get_calendar_progress(
    year: int = None,
    month: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if month is not None and year is None:
        raise HTTPException(status_code=400, detail="Year is required when month is provided")

    if year is None:
        year = date.today().year

    if month is not None:
        sessions = db.query(WorkoutSession).filter(
            WorkoutSession.user_id == current_user.id,
            func.extract("year", WorkoutSession.workout_date) == year,
            func.extract("month", WorkoutSession.workout_date) == month
        ).all()

        return {
            "year": year,
            "month": month,
            "workout_count": len(sessions),
            "sessions": sessions
        }
    else:
        monthly_counts = {str(m): 0 for m in range(1,13)}

        results = (
            db.query(
                func.extract("month", WorkoutSession.workout_date).label("month"),
                func.count(WorkoutSession.id).label("count")
            )
            .filter(
                WorkoutSession.user_id == current_user.id,
                func.extract("year", WorkoutSession.workout_date) == year
            )
            .group_by(func.extract("month", WorkoutSession.workout_date))
            .all()
        )

        for row in results:
            monthly_counts[str(int(row[0]))] = row[1]

        return {"year":year, "monthly_counts": monthly_counts}


@router.get("/suggestion/{session_id}/{exercise_id}")
def get_suggestion(
    session_id: int,
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    recent_occurences = (
        db.query(WorkoutExercise)
        .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
        .filter(
            WorkoutSession.user_id == current_user.id,
            WorkoutExercise.exercise_id == exercise_id,
            WorkoutSession.id != session_id
        )
        .order_by(WorkoutSession.workout_date.desc())
        .limit(2)
        .all()
    )

    if len(recent_occurences) < 2:
        return {"exercise_id": exercise_id, "suggestion": SuggestionType.INSUFFICIENT_DATA.value}

    current_sets = [(s.reps,s.weight) for s in recent_occurences[0].sets]
    previous_sets = [(s.reps,s.weight) for s in recent_occurences[1].sets]

    suggestion = suggest_progression(previous_sets=previous_sets,current_sets=current_sets)

    return {
        "exercise_id": exercise_id,
        "suggestion": suggestion.value
    }