from pydantic import BaseModel,ConfigDict
from datetime import date


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