import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorkoutSession } from "../api/workouts";
import Header from "../components/Header";

function SessionDetailPage() {
  const { sessionId } = useParams();
  const id = Number(sessionId);

  const sessionQuery = useQuery({
    queryKey: ["workout-session", id],
    queryFn: () => getWorkoutSession(id),
  });

  if (sessionQuery.isLoading) {
    return <p className="text-steel text-sm p-8">Loading...</p>;
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return <p className="text-brick text-sm p-8">Couldn't load this workout.</p>;
  }

  const session = sessionQuery.data;

  return (
    <div className="min-h-screen bg-graphite text-chalk">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <Header />

        <Link to="/" className="text-xs text-steel hover:text-brass transition-colors mb-6 inline-block">
          ← Back to dashboard
        </Link>

        <p className="text-xs text-steel mb-1">
          {session.muscle_groups.map((mg) => mg.name).join(", ")}
        </p>
        <p className="font-display text-xl font-medium mb-8">{session.workout_date}</p>

        {session.workout_exercises.length === 0 && (
          <p className="text-steel text-sm">No exercises were logged for this session.</p>
        )}

        {session.workout_exercises.map((we) => (
          <div key={we.id} className="border-t border-steel/20 pt-5 mt-5 first:border-t-0 first:mt-0 first:pt-0">
            <p className="font-display text-base font-medium mb-3">{we.exercise.name}</p>

            {we.sets.length === 0 ? (
              <p className="text-sm text-steel">No sets logged.</p>
            ) : (
              <div className="space-y-1">
                {we.sets.map((s, i) => (
                  <p key={s.id} className="text-sm text-steel">
                    Set {i + 1}: {s.reps} reps × {s.weight}kg
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionDetailPage;