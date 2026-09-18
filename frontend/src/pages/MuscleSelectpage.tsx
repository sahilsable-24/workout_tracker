import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getMuscleGroups, createWorkoutSession } from "../api/workouts";
import Header from "../components/Header";

function MuscleSelectPage() {
  const navigate = useNavigate();
  const { date } = useParams();
  const [selectedMuscleGroupIds, setSelectedMuscleGroupIds] = useState<number[]>([]);

  const muscleGroupsQuery = useQuery({ queryKey: ["muscle-groups"], queryFn: getMuscleGroups });

  const createSessionMutation = useMutation({
    mutationFn: () =>
      createWorkoutSession({
        workout_date: date!,
        muscle_group_ids: selectedMuscleGroupIds,
      }),
    onSuccess: (data) => navigate(`/log/${data.id}`),
  });

  function toggleMuscleGroup(id: number) {
    setSelectedMuscleGroupIds((prev) =>
      prev.includes(id) ? prev.filter((mgId) => mgId !== id) : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen bg-graphite text-chalk">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <Header />

        <p className="text-xs text-steel mb-1">{date}</p>
        <p className="font-display text-xl font-medium mb-8">What did you train?</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {muscleGroupsQuery.data?.map((mg) => (
            <button
              key={mg.id}
              onClick={() => toggleMuscleGroup(mg.id)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                selectedMuscleGroupIds.includes(mg.id)
                  ? "bg-brass text-graphite border-brass"
                  : "border-steel/50 text-chalk hover:border-steel"
              }`}
            >
              {mg.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => createSessionMutation.mutate()}
          disabled={selectedMuscleGroupIds.length === 0 || createSessionMutation.isPending}
          className="bg-brass hover:bg-brass/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-graphite font-medium py-3 px-6 rounded-lg"
        >
          {createSessionMutation.isPending ? "Starting..." : "Start workout"}
        </button>

        <div>
            <button
                onClick={() => navigate(`/`)}
                className="mt-8 text-sm text-steel hover:text-brass transition-colors cursor-pointer"  
                >
                Back to calendar
            </button>
        </div>  
      </div>
    </div>
  );
}

export default MuscleSelectPage;