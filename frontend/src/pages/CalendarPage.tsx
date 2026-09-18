import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCalendarMonth } from "../api/progress";
import { getProgressSummary } from "../api/progress";
import Header from "../components/Header";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);

  const summaryQuery = useQuery({ queryKey: ["progress-summary"], queryFn: getProgressSummary });
  const calendarQuery = useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => getCalendarMonth(year, month),
  });

  const sessionsByDay = new Map<number, { id: number }>();
  calendarQuery.data?.sessions.forEach((s) => {
    const day = Number(s.workout_date.split("-")[2]);
    sessionsByDay.set(day, s);
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  function goToPreviousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function isFutureDay(day: number): boolean {
    const cellDate = new Date(year, month - 1, day);
    const todayMidnight = new Date(todayYear, todayMonth - 1, todayDate);
    return cellDate.getTime() > todayMidnight.getTime();
  }

  function handleDayClick(day: number) {
    const session = sessionsByDay.get(day);

    if (session) {
      navigate(`/log/${session.id}`);
      return;
    }

    if (isFutureDay(day)) {
      return;
    }

    const dateStr = formatDate(year, month, day);
    navigate(`/log/new/${dateStr}`);
  }

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-graphite text-chalk">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <Header />

        {summaryQuery.data && (
          <div className="flex gap-10 mb-10">
            <div>
              <p className="text-xs text-steel mb-1">This week</p>
              <p className="font-display text-3xl font-medium">
                {summaryQuery.data.workout_last_7_days}
              </p>
              <p className="text-xs text-steel">workouts</p>
            </div>
            <div>
              <p className="text-xs text-steel mb-1">Last 30 days</p>
              <p className="font-display text-3xl font-medium">
                {summaryQuery.data.workout_last_30_days}
              </p>
              <p className="text-xs text-steel">workouts</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <button onClick={goToPreviousMonth} className="text-steel hover:text-brass transition-colors text-sm px-2">
            ←
          </button>
          <p className="font-display text-lg font-medium">
            {MONTH_NAMES[month - 1]} {year}
          </p>
          <button onClick={goToNextMonth} className="text-steel hover:text-brass transition-colors text-sm px-2">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <p key={label} className="text-center text-xs text-steel">{label}</p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} />;

            const hasSession = sessionsByDay.has(day);
            const isToday = year === todayYear && month === todayMonth && day === todayDate;
            const future = isFutureDay(day);
            const isClickable = hasSession || !future;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${
                  hasSession
                    ? "bg-brass text-graphite font-medium cursor-pointer"
                    : isToday
                    ? "border border-brass text-brass hover:bg-brass/10 cursor-pointer"
                    : future
                    ? "text-steel/30 cursor-default"
                    : "text-steel hover:bg-graphite-deep cursor-pointer"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {calendarQuery.data && (
          <p className="text-xs text-steel mt-6">
            {calendarQuery.data.workout_count} workout{calendarQuery.data.workout_count !== 1 ? "s" : ""} this month
          </p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;