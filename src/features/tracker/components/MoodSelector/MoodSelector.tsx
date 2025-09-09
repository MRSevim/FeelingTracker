"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";
import {
  Dispatch,
  memo,
  SetStateAction,
  useActionState,
  useState,
} from "react";
import { Label } from "@/components/shadcn/label";
import { addMood } from "../../lib/database";
import { Spinner } from "@/components/shadcn/shadcn-io/spinner";
import { AddMood } from "../../utils/types";
import { Tooltips } from "./ToolTips";
import { Dot } from "./Dot";

const range = 11; // -5 .. +5 (11 points)

export type Selected = { x: number; y: number } | null;

export default function MoodSelector({
  editedEntry,
}: {
  editedEntry?: AddMood;
}) {
  const [selected, setSelected] = useState<Selected>(
    editedEntry ? { x: editedEntry.valence, y: editedEntry.arousal } : null
  );
  const [note, setNote] = useState(editedEntry?.note || "");
  const [error, action, isPending] = useActionState(async () => {
    if (!selected) return "Please select your mood before submitting";

    const { error } = await addMood({
      valence: selected?.x,
      arousal: selected?.y,
      note,
    });
    return error;
  }, "");

  return (
    <form className="flex-1 mt-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">How do you feel today?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <SelectorGrid selected={selected} setSelected={setSelected} />

          {/* Notes input */}
          <div className="flex flex-col gap-2 mt-5">
            <Label htmlFor="about-text-area">Add a note (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              id="about-text-area"
              placeholder="Write about your day..."
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          {/* Submit */}
          <Button
            formAction={action}
            className="w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? "Saving..." : editedEntry ? "Edit Mood" : "Save Mood"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

const SelectorGrid = memo(function Memoized({
  selected,
  setSelected,
}: {
  selected: Selected;
  setSelected: Dispatch<SetStateAction<Selected>>;
}) {
  return (
    <>
      {/* 2D Selector */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative min-w-[225px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[400px] aspect-square border rounded-md bg-muted">
          <Tooltips />

          {/* Grid */}
          <div className="grid grid-cols-11 grid-rows-11 w-full h-full">
            {Array.from({ length: range }).map((_, row) =>
              Array.from({ length: range }).map((_, col) => {
                const x = col - 5; // -5..+5
                const y = 5 - row; // invert so top is +5
                const isSelected = selected?.x === x && selected?.y === y;

                return (
                  <div
                    key={`${row}-${col}`}
                    className="flex items-center justify-center"
                  >
                    <Dot
                      x={x}
                      y={y}
                      isSelected={isSelected}
                      setSelected={setSelected}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
});
