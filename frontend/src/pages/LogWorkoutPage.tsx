import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExercises,
  getWorkoutSession,
  deleteWorkoutSession,
  addExerciseToSession,
  deleteExerciseFromSession,
  addSetToWorkoutExercise,
  updateSet,
  deleteSet,
  type WorkoutExerciseDetail,
  type SetOut,
} from "../api/workouts";
import ExerciseCombobox from "../components/ExerciseCombobox";
import Header from "../components/Header";

interface SetRowProps {
  workoutExerciseId: number;
  set: SetOut;
  index: number;
  onChanged: () => void;
}

function SetRow({ workoutExerciseId, set, index, onChanged }: SetRowProps) {
  const [editing, setEditing] = useState(false);
  const [reps, setReps] = useState(String(set.reps));
  const [weight, setWeight] = useState(set.weight);

  const updateMutation = useMutation({
    mutationFn: () => updateSet(workoutExerciseId, set.id, Number(reps), Number(weight)),
    onSuccess: () => {
      setEditing(false);
      onChanged();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSet(workoutExerciseId, set.id),
    onSuccess: onChanged,
  });

  if (editing) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-16 bg-graphite-deep border border-steel/50 focus:border-brass focus:outline-none rounded px-2 py-1"
        />
        <span className="text-steel">reps ×</span>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-16 bg-graphite-deep border border-steel/50 focus:border-brass focus:outline-none rounded px-2 py-1"
        />
        <span className="text-steel">kg</span>
        <button onClick={() => updateMutation.mutate()} className="text-brass hover:underline ml-2">
          Save
        </button>
        <button onClick={() => setEditing(false)} className="text-steel hover:underline">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm text-steel">
      <span>
        Set {index + 1}: {set.reps} reps × {set.weight}kg
      </span>
      <span className="flex gap-3">
        <button onClick={() => setEditing(true)} className="hover:text-brass transition-colors">
          Edit
        </button>
        <button onClick={() => deleteMutation.mutate()} className="hover:text-brick transition-colors">
          Delete
        </button>
      </span>
    </div>
  );
}

interface SectionProps {
  sessionId: number;
  workoutExercise: WorkoutExerciseDetail;
  onChanged: () => void;
}

function ExerciseSection({ sessionId, workoutExercise, onChanged }: SectionProps) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const addSetMutation = useMutation({
    mutationFn: () => addSetToWorkoutExercise(workoutExercise.id, Number(reps), Number(weight)),
    onSuccess: () => {
      setReps("");
      setWeight("");
      onChanged();
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: () => deleteExerciseFromSession(sessionId, workoutExercise.id),
    onSuccess: onChanged,
  });

  return (
    <div className="border-t border-steel/20 pt-5 mt-5">
      <div className="flex justify-between items-center mb-3">
        <p className="font-display text-base font-medium">{workoutExercise.exercise.name}</p>
        <button
          onClick={() => {
            if (window.confirm(`Remove ${workoutExercise.exercise.name} from this workout?`)) {
              deleteExerciseMutation.mutate();
            }
          }}
          className="text-xs text-steel hover:text-brick transition-colors"
        >
          Remove exercise
        </button>
      </div>

      {workoutExercise.sets.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {workoutExercise.sets.map((s, i) => (
            <SetRow
              key={s.id}
              workoutExerciseId={workoutExercise.id}
              set={s}
              index={i}
              onChanged={onChanged}
            />
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
          onClick={() => addSetMutation.mutate()}
          disabled={!reps || !weight || addSetMutation.isPending}
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
    onSuccess: () => refetchSession(),
  });

  const deleteSessionMutation = useMutation({
    mutationFn: () => deleteWorkoutSession(id),
    onSuccess: () => navigate("/"),
  });

  function refetchSession() {
    queryClient.invalidateQueries({ queryKey: ["workout-session", id] });
  }

  function handleFinish() {
    const hasExercises = (sessionQuery.data?.workout_exercises.length ?? 0) > 0;

    if (hasExercises) {
      navigate("/");
    } else {
      if (window.confirm("You haven't logged anything yet. Discard this workout?")) {
        deleteSessionMutation.mutate();
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
          <ExerciseSection key={we.id} sessionId={id} workoutExercise={we} onChanged={refetchSession} />
        ))}

        <button
          onClick={handleFinish}
          className="mt-8 text-sm text-steel hover:text-brass transition-colors cursor-pointer"
        >
          {session.workout_exercises.length > 0 ? "Back to calendar" : "Discard workout"}
        </button>
      </div>
    </div>
  );
}

export default LogWorkoutPage;