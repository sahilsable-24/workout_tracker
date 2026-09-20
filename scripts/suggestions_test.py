from database import SessionLocal
from workouts.models import WorkoutExercise, WorkoutSession

db = SessionLocal()
results = (
    db.query(WorkoutExercise)
    .join(WorkoutSession, WorkoutExercise.workout_session_id == WorkoutSession.id)
    .filter(
        WorkoutSession.user_id == 2,
        WorkoutExercise.exercise_id == 10,
        WorkoutSession.id != 24,
    )
    .order_by(WorkoutSession.workout_date.desc())
    .limit(2)
    .all()
)
for r in results:
    print(r.id, r.workout_session_id, [(s.reps, s.weight) for s in r.sets])