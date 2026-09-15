import { apiFetch } from "./client";

interface ProgressSummary {
  workout_last_7_days: number;
  workout_last_30_days: number;
}

export function getProgressSummary(): Promise<ProgressSummary> {
  return apiFetch<ProgressSummary>("/progress/summary");
}