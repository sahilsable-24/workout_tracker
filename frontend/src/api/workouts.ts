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

interface Exercise {
  id: number;
  name: string;
}

export function getWorkoutSessions(): Promise<WorkoutSession[]> {
  return apiFetch<WorkoutSession[]>("/workouts/");
}

export function getExercises(): Promise<Exercise[]> {
  return apiFetch<Exercise[]>("/workouts/exercises");
}


export function getMuscleGroups(): Promise<MuscleGroup[]> {
  return apiFetch<MuscleGroup[]>("/workouts/muscle-groups"); // 
}

interface CreateSessionPayload {
  workout_date: string;
  muscle_group_ids: number[];
}

interface Session {
  id: number;
  workout_date: string;
  muscle_groups: MuscleGroup[];
}

export function createWorkoutSession(payload: CreateSessionPayload): Promise<Session> {
  return apiFetch<Session>("/workouts/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

interface WorkoutExercise {
  id: number;
  exercise_id: number;
}

export function addExerciseToSession(sessionId: number, exerciseId: number): Promise<WorkoutExercise> {
  return apiFetch<WorkoutExercise>(`/workouts/${sessionId}/exercises`, {
    method: "POST",
    body: JSON.stringify({ exercise_id: exerciseId }),
  });
}

interface Set {
  id: number;
  reps: number;
  weight: string;
}

export function addSetToWorkoutExercise(workoutExerciseId: number, reps: number, weight: number): Promise<Set> {
  return apiFetch<Set>(`/workouts/workout-exercises/${workoutExerciseId}/sets`, {
    method: "POST",
    body: JSON.stringify({ reps, weight }),
  });
}