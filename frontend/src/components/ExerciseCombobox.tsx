import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";

interface Exercise {
  id: number;
  name: string;
}

interface Props {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

function ExerciseCombobox({ exercises, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const filtered =
    query === ""
      ? exercises
      : exercises.filter((ex) =>
          ex.name.toLowerCase().includes(query.toLowerCase())
        );

  function handleChange(exercise: Exercise | null) {
    setSelected(exercise);
    if (exercise){
        onSelect(exercise);
    }
  }

  return (
    <Combobox value={selected} onChange={handleChange}>
      <ComboboxInput
        className="w-full bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
        displayValue={(ex: Exercise | null) => ex?.name ?? ""}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search exercises..."
      />
      <ComboboxOptions className="mt-1 bg-graphite-deep border border-steel/30 rounded-lg overflow-hidden">
        {filtered.map((ex) => (
          <ComboboxOption
            key={ex.id}
            value={ex}
            className="px-4 py-2 text-sm text-chalk data-focus:bg-brass data-focus:text-graphite cursor-pointer"
          >
            {ex.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

export default ExerciseCombobox;