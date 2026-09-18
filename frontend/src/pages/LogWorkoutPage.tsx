import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExercises,
  getWorkoutSession,
  deleteWorkoutSession,
  addExerciseToSession,
  addSetToWorkoutExercise,
  type WorkoutExerciseDetail,
} from "../api/workouts";
import ExerciseCombobox from "../components/ExerciseCombobox";
import Header from "../components/Header";

interface SectionProps {
  workoutExercise: WorkoutExerciseDetail;
  onSetLogged: () => void;
}

function ExerciseSection({ workoutExercise, onSetLogged }: SectionProps) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const mutation = useMutation({
    mutationFn: () => addSetToWorkoutExercise(workoutExercise.id, Number(reps), Number(weight)),
    onSuccess: () => {
      setReps("");
      setWeight("");
      onSetLogged();
    },
  });

  return (
    <div className="border-t border-steel/20 pt-5 mt-5">
      <p className="font-display text-base font-medium mb-3">{workoutExercise.exercise.name}</p>

      {workoutExercise.sets.length > 0 && (
        <div className="mb-3 space-y-1">
          {workoutExercise.sets.map((s, i) => (
            <p key={s.id} className="text-sm text-steel">
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
  const { sessionId } = useParams();
  const id = Number(sessionId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["workout-session", id],
    queryFn: () => getWorkoutSession(id),
  });

  const exercisesQuery = useQuery({ queryKey: ["exercises"], queryFn: getExercises });

  const addExerciseMutation = useMutation({
    mutationFn: (exerciseId: number) => addExerciseToSession(id, exerciseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workout-session", id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkoutSession(id),
    onSuccess: () => navigate("/"),
  });

  function refetchSession() {
    queryClient.invalidateQueries({ queryKey: ["workout-session", id] });
  }

  function handleFinish() {
    const hasExercises = (sessionQuery.data?.workout_exercises.length ?? 0) > 0;

    if (hasExercises) {
      if (window.confirm("Finish this workout?")) {
        navigate("/");
      }
    } else {
      if (window.confirm("You haven't logged anything yet. Discard this workout?")) {
        deleteMutation.mutate();
      }
    }
  }

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

        <p className="text-xs text-steel mb-1">
          {session.muscle_groups.map((mg) => mg.name).join(", ")}
        </p>
        <p className="font-display text-xl font-medium mb-6">{session.workout_date}</p>

        <p className="text-xs text-steel mb-3">Add an exercise</p>
        {exercisesQuery.data && (
          <ExerciseCombobox
            key={session.workout_exercises.length}
            exercises={exercisesQuery.data}
            onSelect={(ex) => addExerciseMutation.mutate(ex.id)}
          />
        )}

        {session.workout_exercises.map((we) => (
          <ExerciseSection key={we.id} workoutExercise={we} onSetLogged={refetchSession} />
        ))}

        <button
          onClick={handleFinish}
          className="mt-8 text-sm text-steel hover:text-brass transition-colors"
        >
          Finish workout
        </button>
      </div>
    </div>
  );
}

export default LogWorkoutPage;