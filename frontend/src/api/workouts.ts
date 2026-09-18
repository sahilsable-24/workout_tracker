import { apiFetch } from "./client";

export interface MuscleGroup {
  id: number;
  name: string;
}

export function getMuscleGroups(): Promise<MuscleGroup[]> {
  return apiFetch<MuscleGroup[]>("/workouts/muscle-groups");
}

export interface Exercise {
  id: number;
  name: string;
}

export function getExercises(): Promise<Exercise[]> {
  return apiFetch<Exercise[]>("/workouts/exercises");
}

interface CreateSessionPayload {
  workout_date: string;
  muscle_group_ids: number[];
}

export interface Session {
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

export function deleteWorkoutSession(sessionId: number): Promise<void> {
  return apiFetch<void>(`/workouts/${sessionId}`, { method: "DELETE" });
}

export interface SetOut {
  id: number;
  reps: number;
  weight: string;
}

export interface WorkoutExerciseDetail {
  id: number;
  exercise: Exercise;
  sets: SetOut[];
}

export interface SessionDetail {
  id: number;
  workout_date: string;
  muscle_groups: MuscleGroup[];
  workout_exercises: WorkoutExerciseDetail[];
}

export function getWorkoutSession(sessionId: number): Promise<SessionDetail> {
  return apiFetch<SessionDetail>(`/workouts/${sessionId}`);
}

export function addExerciseToSession(sessionId: number, exerciseId: number): Promise<WorkoutExerciseDetail> {
  return apiFetch<WorkoutExerciseDetail>(`/workouts/${sessionId}/exercises`, {
    method: "POST",
    body: JSON.stringify({ exercise_id: exerciseId }),
  });
}

export function deleteExerciseFromSession(sessionId: number, workoutExerciseId: number): Promise<void> {
  return apiFetch<void>(`/workouts/${sessionId}/exercises/${workoutExerciseId}`, {
    method: "DELETE",
  });
}

export function addSetToWorkoutExercise(workoutExerciseId: number, reps: number, weight: number): Promise<SetOut> {
  return apiFetch<SetOut>(`/workouts/workout-exercises/${workoutExerciseId}/sets`, {
    method: "POST",
    body: JSON.stringify({ reps, weight }),
  });
}

export function updateSet(workoutExerciseId: number, setId: number, reps: number, weight: number): Promise<SetOut> {
  return apiFetch<SetOut>(`/workouts/workout-exercises/${workoutExerciseId}/sets/${setId}`, {
    method: "PATCH",
    body: JSON.stringify({ reps, weight }),
  });
}

export function deleteSet(workoutExerciseId: number, setId: number): Promise<void> {
  return apiFetch<void>(`/workouts/workout-exercises/${workoutExerciseId}/sets/${setId}`, {
    method: "DELETE",
  });
}
