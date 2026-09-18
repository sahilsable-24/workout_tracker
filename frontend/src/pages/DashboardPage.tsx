import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProgressSummary } from "../api/progress";
import Header from "../components/Header";

function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ["progress-summary"],
    queryFn: getProgressSummary,
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

        <Link
          to="/calendar"
          className="inline-block text-sm text-steel hover:text-brass transition-colors border-t border-steel/20 pt-6 w-full"
        >
          View calendar →
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;