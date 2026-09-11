from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import ForeignKey,Numeric,Table,Column
from database import Base
from datetime import date
from decimal import Decimal
from typing import Optional

workout_sessions_muscle_groups = Table(
    "workout_sessions_muscle_groups",
    Base.metadata,
    Column("workout_session_id", ForeignKey("workout_sessions.id"), primary_key=True),
    Column("muscle_group_id", ForeignKey("muscle_groups.id"), primary_key=True)
)

class MuscleGroup(Base):
    __tablename__ = "muscle_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
    sessions: Mapped[list["WorkoutSession"]] = relationship(
        secondary=workout_sessions_muscle_groups, back_populates="muscle_groups"
    )

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    workout_date: Mapped[date]
    muscle_group: Mapped[list["MuscleGroup"]] = relationship(
        secondary=workout_sessions_muscle_groups, back_populates="sessions"
    )

class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    created_by_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True),

class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    workout_session_id: Mapped[int] = mapped_column(ForeignKey("workout_sessions.id"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))

class Set(Base):
    __tablename__ = "sets"

    id: Mapped[int] = mapped_column(primary_key=True)
    workout_exercise_id: Mapped[int] = mapped_column(ForeignKey("workout_exercises.id"))
    reps: Mapped[int]
    weight: Mapped[Decimal] = mapped_column(Numeric(5,2))

