from fastapi import APIRouter, HTTPException,Depends,status
from workouts.models import WorkoutSession,MuscleGroup
from workouts.schemas import WorkoutSessionCreate,WorkoutSessionOut
from auth.jwt import get_current_user
from database import get_db
from auth.models import User
from sqlalchemy.orm import Session

router = APIRouter(prefix="/workouts",tags=['workouts'])

@router.post("/",response_model=WorkoutSessionOut,status_code=status.HTTP_201_CREATED)
def create_workout_session(
    session_in:WorkoutSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    muscle_groups = db.query(MuscleGroup).filter(
        MuscleGroup.id.in_(session_in.muscle_group_ids)
    ).all()

    if len(muscle_groups) != len(session_in.muscle_group_ids):
        raise HTTPException(status_code=404,detail="Some id's not found")

    workout_session = WorkoutSession(
        user_id = current_user.id,
        workout_date= session_in.workout_date,
        muscle_groups=muscle_groups
    )

    db.add(workout_session)
    db.commit()
    db.refresh(workout_session)

    return workout_session

@router.get("/",response_model=list[WorkoutSessionOut])
def list_workout_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    session = db.query(WorkoutSession).filter(current_user.id == WorkoutSession.user_id).all()

    return session

