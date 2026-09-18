from fastapi import APIRouter, HTTPException,Depends,status
from workouts.models import WorkoutSession,MuscleGroup,WorkoutExercise,Exercise,Set
from workouts.schemas import WorkoutSessionCreate,WorkoutSessionOut,WorkoutExerciseCreate, WorkoutExerciseOut, SetCreate,SetOut,WorkoutExerciseDetailOut,WorkoutSessionDetailOut,ExerciseOut, MuscleGroupOut,SetUpdate
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


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        WorkoutSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()

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

#Router to delete a single set
@router.delete("/workout-exercises/{workout_exercise_id}/sets/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_set(
    workout_exercise_id: int,
    set_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    set_obj = (
        db.query(Set)
        .join(WorkoutExercise, Set.workout_exercise_id == WorkoutExercise.id)
        .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
        .filter(
            Set.id == set_id,
            Set.workout_exercise_id == workout_exercise_id,
            WorkoutSession.user_id == current_user.id
        )
        .first()
    )

    if not set_obj:
        raise HTTPException(status_code=404, detail="Set not found")

    db.delete(set_obj)
    db.commit()

# Router to edit a single set
@router.patch("/workout-exercises/{workout_exercise_id}/sets/{set_id}", response_model=SetOut)
def update_set(
    workout_exercise_id: int,
    set_id: int,
    set_in: SetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    set_obj = (
        db.query(Set)
        .join(WorkoutExercise, Set.workout_exercise_id == WorkoutExercise.id)
        .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
        .filter(
            Set.id == set_id,
            Set.workout_exercise_id == workout_exercise_id,
            WorkoutSession.user_id == current_user.id
        )
        .first()
    )

    if not set_obj:
        raise HTTPException(status_code=404, detail="Set not found")

    set_obj.reps = set_in.reps
    set_obj.weight = set_in.weight

    db.commit()
    db.refresh(set_obj)

    return set_obj

# Router to delete an exercise (and its sets, via cascade) from a session
@router.delete("/{session_id}/exercises/{workout_exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exercise_from_session(
    session_id: int,
    workout_exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workout_exercise = (
        db.query(WorkoutExercise)
        .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
        .filter(
            WorkoutExercise.id == workout_exercise_id,
            WorkoutExercise.workout_session_id == session_id,
            WorkoutSession.user_id == current_user.id
        )
        .first()
    )

    if not workout_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    db.delete(workout_exercise)
    db.commit()


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
