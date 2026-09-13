from database import SessionLocal
from workouts.models import Exercise
from auth.models import User

exercises = [
    # Chest
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Dumbbell Bench Press",
    "Incline Dumbbell Press",
    "Dumbbell Fly",
    "Cable Fly",
    "Push-Up",
    "Chest Dip",

    # Back
    "Deadlift",
    "Barbell Row",
    "Dumbbell Row",
    "Seated Cable Row",
    "Lat Pulldown",
    "Pull-Up",
    "Chin-Up",
    "T-Bar Row",
    "Face Pull",

    # Shoulders
    "Overhead Press",
    "Barbell Shoulder Press",
    "Dumbbell Shoulder Press",
    "Arnold Press",
    "Lateral Raise",
    "Front Raise",
    "Rear Delt Fly",
    "Upright Row",
    "Shrug",

    # Biceps
    "Barbell Curl",
    "Dumbbell Curl",
    "Hammer Curl",
    "Incline Dumbbell Curl",
    "Preacher Curl",
    "Cable Curl",
    "Concentration Curl",

    # Triceps
    "Tricep Pushdown",
    "Rope Tricep Pushdown",
    "Overhead Tricep Extension",
    "Skull Crusher",
    "Close-Grip Bench Press",
    "Tricep Dip",
    "Dumbbell Tricep Extension",

    # Legs / Quads
    "Barbell Squat",
    "Front Squat",
    "Goblet Squat",
    "Leg Press",
    "Hack Squat",
    "Leg Extension",
    "Bulgarian Split Squat",
    "Walking Lunge",
    "Reverse Lunge",
    "Step-Up",

    # Hamstrings / Glutes
    "Romanian Deadlift",
    "Stiff-Leg Deadlift",
    "Leg Curl",
    "Seated Leg Curl",
    "Lying Leg Curl",
    "Hip Thrust",
    "Glute Bridge",
    "Good Morning",

    # Calves
    "Standing Calf Raise",
    "Seated Calf Raise",
    "Leg Press Calf Raise",

    # Core
    "Plank",
    "Side Plank",
    "Crunch",
    "Cable Crunch",
    "Hanging Leg Raise",
    "Hanging Knee Raise",
    "Ab Wheel Rollout",
    "Russian Twist",

    # Full Body / Conditioning
    "Kettlebell Swing",
    "Clean and Press",
    "Burpee",
    "Mountain Climber",
    "Box Jump",
    "Farmer Walk",
]

db = SessionLocal()

for i in exercises:
    exist_exercise = db.query(Exercise).filter(Exercise.name == i).first()

    if not exist_exercise:
        exercise = Exercise(name=i)
        db.add(exercise)

db.commit()
db.close()

