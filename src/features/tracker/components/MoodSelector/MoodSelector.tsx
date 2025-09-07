"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";
import { useActionState, useState } from "react";
import { Label } from "@/components/shadcn/label";
import { addMood } from "../../lib/database";
import { Spinner } from "@/components/shadcn/shadcn-io/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { getColor } from "../../utils/helpers";
import { AddMood } from "../../utils/types";

const range = 11; // -5 .. +5 (11 points)

export default function MoodSelector({
  editedEntry,
}: {
  editedEntry?: AddMood;
}) {
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(
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
          {/* 2D Selector */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative min-w-[200px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[400px] aspect-square border rounded-md bg-muted">
              {/* Axis lines */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical line (valence = 0) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-foreground/50" />
                {/* Horizontal line (arousal = 0) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-foreground/50" />
              </div>
              {/* Axis labels */}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">
                High Arousal
              </span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm">
                Low Arousal
              </span>
              <span className="absolute top-1/2 -left-12 -translate-y-1/2 text-sm -rotate-90">
                Unpleasant
              </span>
              <span className="absolute top-1/2 -right-10 -translate-y-1/2 text-sm rotate-90">
                Pleasant
              </span>

              {/* Grid */}
              <div className="grid grid-cols-11 grid-rows-11 w-full h-full">
                {Array.from({ length: range }).map((_, row) =>
                  Array.from({ length: range }).map((_, col) => {
                    const x = col - 5; // -5..+5
                    const y = 5 - row; // invert so top is +5
                    const isSelected = selected?.x === x && selected?.y === y;
                    const color = getColor(x, y);

                    return (
                      <div
                        key={`${row}-${col}`}
                        className="flex items-center justify-center"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => {
                                if (isSelected) {
                                  setSelected(null);
                                } else setSelected({ x, y });
                              }}
                              className="w-1/5 h-1/5 rounded-full transition-transform cursor-pointer"
                              style={{
                                backgroundColor: isSelected
                                  ? "var(--color-primary)"
                                  : color,
                                transform: isSelected
                                  ? "scale(1.5)"
                                  : "scale(1)",
                              }}
                            />
                          </TooltipTrigger>

                          {/* Hover coordinates tooltip */}
                          <TooltipContent>
                            {" "}
                            ({x}, {y})
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

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
