import { apiFetch } from "./client";


interface MuscleGroup {
  id: number;
  name: string;
}

interface WorkoutSession {
  id: number;
  workout_date: string;
  muscle_groups: MuscleGroup[];
}

export function getWorkoutSessions(): Promise<WorkoutSession[]> {
  return apiFetch<WorkoutSession[]>("/workouts/");
}