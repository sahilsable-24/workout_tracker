from pydantic import BaseModel,ConfigDict
from datetime import date
from decimal import Decimal

class MuscleGroupOut(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class WorkoutSessionCreate(BaseModel):
    workout_date: date
    muscle_group_ids: list[int]

class WorkoutSessionOut(BaseModel):
    id: int
    workout_date: date
    muscle_groups: list[MuscleGroupOut]
    model_config = ConfigDict(from_attributes=True)

class WorkoutExerciseCreate(BaseModel):
    exercise_id: int

class WorkoutExerciseOut(BaseModel):
    id: int
    exercise_id: int
    model_config = ConfigDict(from_attributes=True)

class SetCreate(BaseModel):
    reps: int
    weight: Decimal

class SetOut(BaseModel):
    id: int
    reps: int
    weight: Decimal
    model_config = ConfigDict(from_attributes=True)