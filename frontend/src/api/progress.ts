import { apiFetch } from "./client";

interface ProgressSummary {
  workout_last_7_days: number;
  workout_last_30_days: number;
}

export function getProgressSummary(): Promise<ProgressSummary> {
  return apiFetch<ProgressSummary>("/progress/summary");
}

interface CalendarMonthResponse {
  year: number;
  month: number;
  workout_count: number;
  sessions: { id: number; workout_date: string }[];
}

export function getCalendarMonth(year: number, month: number): Promise<CalendarMonthResponse> {
  return apiFetch<CalendarMonthResponse>(`/progress/calendar?year=${year}&month=${month}`);
}