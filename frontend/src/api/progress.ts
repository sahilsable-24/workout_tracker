import { apiFetch } from "./client";

interface ProgressSummary {
  workout_last_7_days: number;
  workout_last_30_days: number;
}

export function getProgressSummary(): Promise<ProgressSummary> {
  return apiFetch<ProgressSummary>("/progress/summary");
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  workout_count: number;
  sessions: { id: number; workout_date: string }[];
}

export function getCalendarMonth(year: number, month: number): Promise<CalendarMonthResponse> {
  return apiFetch<CalendarMonthResponse>(`/progress/calendar?year=${year}&month=${month}`);
}

interface SuggestionResponse {
  exercise_id: number;
  suggestion: "increase_reps" | "increase_weight" | "repeat" | "insufficient_data";
}

export function getSuggestion(session_id: number,exercise_id: number): Promise<SuggestionResponse>{
  return apiFetch<SuggestionResponse>(`/progress/suggestion/${session_id}/${exercise_id}`);
}