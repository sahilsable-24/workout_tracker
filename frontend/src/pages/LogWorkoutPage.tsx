import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getMuscleGroups,
  getExercises,
  createWorkoutSession,
  addExerciseToSession,
  addSetToWorkoutExercise,
} from "../api/workouts";
import ExerciseCombobox from "../components/ExerciseCombobox";
import Header from "../components/Header";

interface SessionExercise {
  workoutExerciseId: number;
  exerciseName: string;
}

function ExerciseSection({ workoutExerciseId, exerciseName }: SessionExercise) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [loggedSets, setLoggedSets] = useState<{ reps: number; weight: string }[]>([]);

  const mutation = useMutation({
    mutationFn: () => addSetToWorkoutExercise(workoutExerciseId, Number(reps), Number(weight)),
    onSuccess: (data) => {
      setLoggedSets((prev) => [...prev, { reps: data.reps, weight: data.weight }]);
      setReps("");
      setWeight("");
    },
  });

  return (
    <div className="border-t border-steel/20 pt-5 mt-5">
      <p className="font-display text-base font-medium mb-3">{exerciseName}</p>

      {loggedSets.length > 0 && (
        <div className="mb-3 space-y-1">
          {loggedSets.map((s, i) => (
            <p key={i} className="text-sm text-steel">
              Set {i + 1}: {s.reps} reps × {s.weight}kg
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-24 bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-24 bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={() => mutation.mutate()}
          disabled={!reps || !weight || mutation.isPending}
          className="bg-brass hover:bg-brass/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-graphite text-sm font-medium px-4 rounded-lg"
        >
          Log set
        </button>
      </div>
    </div>
  );
}

function LogWorkoutPage() {
  const navigate = useNavigate();
  const [selectedMuscleGroupIds, setSelectedMuscleGroupIds] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);

  const muscleGroupsQuery = useQuery({ queryKey: ["muscle-groups"], queryFn: getMuscleGroups });
  const exercisesQuery = useQuery({ queryKey: ["exercises"], queryFn: getExercises });

  const createSessionMutation = useMutation({
    mutationFn: () =>
      createWorkoutSession({
        workout_date: new Date().toISOString().split("T")[0],
        muscle_group_ids: selectedMuscleGroupIds,
      }),
    onSuccess: (data) => setSessionId(data.id),
  });

  const addExerciseMutation = useMutation({
    mutationFn: (exerciseId: number) => addExerciseToSession(sessionId!, exerciseId),
    onSuccess: (data, exerciseId) => {
      const exercise = exercisesQuery.data?.find((ex) => ex.id === exerciseId);
      if (exercise) {
        setSessionExercises((prev) => [
          ...prev,
          { workoutExerciseId: data.id, exerciseName: exercise.name },
        ]);
      }
    },
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

        {!sessionId && (
          <div>
            <p className="text-xs text-steel mb-3">What are you training today?</p>
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
              Start workout
            </button>
          </div>
        )}

        {sessionId && (
          <div>
            <p className="text-xs text-steel mb-3">Add an exercise</p>
            {exercisesQuery.data && (
              <ExerciseCombobox
                key={sessionExercises.length}
                exercises={exercisesQuery.data}
                onSelect={(ex) => addExerciseMutation.mutate(ex.id)}
              />
            )}

            {sessionExercises.map((se) => (
              <ExerciseSection
                key={se.workoutExerciseId}
                workoutExerciseId={se.workoutExerciseId}
                exerciseName={se.exerciseName}
              />
            ))}

            <button
              onClick={() => navigate("/")}
              className="mt-8 text-sm text-steel hover:text-brass transition-colors"
            >
              Finish workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogWorkoutPage;