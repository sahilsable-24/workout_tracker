import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCalendarMonth } from "../api/progress";
import Header from "../components/Header";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);

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
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = Sunday

  const isCurrentMonth = year === todayYear && month === todayMonth;

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

  function handleDayClick(day: number) {
    const session = sessionsByDay.get(day);

    if (session) {
      navigate(`/sessions/${session.id}`);
      return;
    }

    if (isCurrentMonth && day === todayDate) {
      navigate("/log");
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-graphite text-chalk">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="text-steel hover:text-brass transition-colors text-sm px-2"
          >
            ←
          </button>
          <p className="font-display text-lg font-medium">
            {MONTH_NAMES[month - 1]} {year}
          </p>
          <button
            onClick={goToNextMonth}
            className="text-steel hover:text-brass transition-colors text-sm px-2"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <p key={label} className="text-center text-xs text-steel">
              {label}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`blank-${i}`} />;
            }

            const hasSession = sessionsByDay.has(day);
            const isToday = isCurrentMonth && day === todayDate;
            const isClickable = hasSession || isToday;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${
                  hasSession
                    ? "bg-brass text-graphite font-medium"
                    : isToday
                    ? "border border-brass text-brass hover:bg-brass/10 cursor-pointer"
                    : "text-steel cursor-default"
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