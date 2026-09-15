from pydantic import BaseModel, ConfigDict
from datetime import date


class ProgressOut(BaseModel):
    workout_last_7_days: int
    workout_last_30_days: int
    model_config = ConfigDict(from_attributes=True)