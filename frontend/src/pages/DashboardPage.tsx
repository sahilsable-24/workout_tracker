import { useQuery } from "@tanstack/react-query";
import { getProgressSummary } from "../api/progress";

function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["progress-summary"],
    queryFn: getProgressSummary,
  });

  return (
    <div className="min-h-screen bg-graphite text-chalk p-8">
      <p className="font-display text-lg font-medium mb-10">Workout tracker</p>

      {isLoading && <p className="text-steel text-sm">Loading...</p>}

      {isError && (
        <p className="text-brick text-sm">Couldn't load your summary. Try refreshing.</p>
      )}

      {data && (
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-steel mb-1">This week</p>
            <p className="font-display text-3xl font-medium">{data.workout_last_7_days}</p>
            <p className="text-xs text-steel">workouts</p>
          </div>
          <div>
            <p className="text-xs text-steel mb-1">Last 30 days</p>
            <p className="font-display text-3xl font-medium">{data.workout_last_30_days}</p>
            <p className="text-xs text-steel">workouts</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;