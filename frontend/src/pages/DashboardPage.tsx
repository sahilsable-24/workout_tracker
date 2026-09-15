import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProgressSummary } from "../api/progress";
import { getWorkoutSessions } from "../api/workouts";
import Header from "../components/Header";

function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ["progress-summary"],
    queryFn: getProgressSummary,
  });

  const sessionsQuery = useQuery({
    queryKey: ["workout-sessions"],
    queryFn: getWorkoutSessions,
  });

  return (
    <div className="min-h-screen bg-graphite text-chalk">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <Header />

        <Link
          to="/log"
          className="inline-block bg-brass hover:bg-brass/90 transition-colors text-graphite font-medium py-3 px-6 rounded-lg mb-10"
        >
          Log workout
        </Link>

        {summaryQuery.isLoading && <p className="text-steel text-sm">Loading...</p>}

        {summaryQuery.isError && (
          <p className="text-brick text-sm">Couldn't load your summary. Try refreshing.</p>
        )}

        {summaryQuery.data && (
          <div className="flex gap-10 mb-12">
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

        <div className="border-t border-steel/20 pt-6">
          <p className="text-xs text-steel mb-4">Recent</p>

          {sessionsQuery.isLoading && <p className="text-steel text-sm">Loading...</p>}

          {sessionsQuery.isError && (
            <p className="text-brick text-sm">Couldn't load your sessions.</p>
          )}

          {sessionsQuery.data && sessionsQuery.data.length === 0 && (
            <p className="text-steel text-sm">No workouts logged yet.</p>
          )}

          {sessionsQuery.data && sessionsQuery.data.length > 0 && (
            <div className="divide-y divide-steel/10">
              {sessionsQuery.data.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-4 py-3"
                >
                  <span className="text-sm">{session.workout_date}</span>
                  <span className="text-sm text-steel">
                    {session.muscle_groups.map((mg) => mg.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;