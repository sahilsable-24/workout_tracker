from pydantic import BaseModel, ConfigDict
from datetime import date
from workouts.schemas import WorkoutSessionOut


class ProgressOut(BaseModel):
    workout_last_7_days: int
    workout_last_30_days: int
    model_config = ConfigDict(from_attributes=True)

class CalendarMonthOut(BaseModel):
    year: int
    month: int
    workout_count: int
    sessions: list[WorkoutSessionOut]

class CalendarYearOut(BaseModel):
    year: int
    monthly_counts: dict[str,int]