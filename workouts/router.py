from fastapi import APIRouter, HTTPException,Depends,status
from workouts.models import WorkoutSession,MuscleGroup,WorkoutExercise,Exercise,Set
from workouts.schemas import WorkoutSessionCreate,WorkoutSessionOut,WorkoutExerciseCreate, WorkoutExerciseOut, SetCreate,SetOut,WorkoutExerciseDetailOut,WorkoutSessionDetailOut,ExerciseOut, MuscleGroupOut
from auth.jwt import get_current_user
from database import get_db
from auth.models import User
from sqlalchemy.orm import Session

router = APIRouter(prefix="/workouts",tags=['workouts'])


# Router to post the workout sessions
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


#Router to get all the wrokout sessions
@router.get("/",response_model=list[WorkoutSessionOut])
def list_workout_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    session = db.query(WorkoutSession).filter(current_user.id == WorkoutSession.user_id).all()

    return session


@router.get("/exercises", response_model=list[ExerciseOut])
def list_exercises(db: Session = Depends(get_db)):
    return db.query(Exercise).all()

@router.get("/muscle-groups", response_model=list[MuscleGroupOut])
def list_muscle_groups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(MuscleGroup).all()



#Router to post the exercises
@router.post("/{session_id}/exercises",response_model=WorkoutExerciseOut,status_code=status.HTTP_201_CREATED)
def add_exercise_to_session(
    session_id: int,
    exercise_in: WorkoutExerciseCreate,
    current_user: User= Depends(get_current_user),
    db: Session= Depends(get_db)
):
    workout_session = db.query(WorkoutSession).filter(session_id == WorkoutSession.id, WorkoutSession.user_id == current_user.id).first()

    if not workout_session:
        raise HTTPException(status_code=404,detail="Session not found")

    exercise = db.query(Exercise).filter(exercise_in.exercise_id == Exercise.id).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    new_exercise = WorkoutExercise(
        workout_session_id = session_id,
        exercise_id = exercise.id
    )

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise


#Router to post sets and reps
@router.post("/workout-exercises/{workout_exercise_id}/sets",response_model=SetOut,status_code=status.HTTP_201_CREATED)
def add_set_to_exercise(
    workout_exercise_id: int,
    set_in: SetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workout_exercise = (
        db.query(WorkoutExercise)
        .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
        .filter(
            WorkoutExercise.id == workout_exercise_id,
            WorkoutSession.user_id == current_user.id
        )
        .first()
    )

    if not workout_exercise:
        raise HTTPException(status_code=404, detail="Exercise Not found")

    new_set = Set(
        workout_exercise_id = workout_exercise_id,
        reps = set_in.reps,
        weight = set_in.weight
    )

    db.add(new_set)
    db.commit()
    db.refresh(new_set)

    return new_set


# Router to get all the workout details
@router.get("/{session_id}",response_model=WorkoutSessionDetailOut)
def get_workout_session_details(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_detail = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        current_user.id == WorkoutSession.user_id
    ).first()

    if not session_detail:
        raise HTTPException(status_code=404, detail="Session not found")

    return session_detail
