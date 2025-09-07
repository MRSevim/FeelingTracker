"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";
import { useState } from "react";
import { Label } from "@/components/shadcn/label";

// helper to get color based on x,y
const getColor = (x: number, y: number) => {
  const valence = (x + 5) / 10; // 0-1 (unpleasant → pleasant)
  const arousal = (y + 5) / 10; // 0-1 (low → high)

  // interpolate between red → green for valence
  const r = Math.round(255 * (1 - valence));
  const g = Math.round(200 * valence);
  const b = Math.round(100 * arousal); // more arousal = brighter

  return `rgb(${r}, ${g}, ${b})`;
};

export default function MoodSelector() {
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(
    null
  );
  const range = 11; // -5 .. +5 (11 points)

  return (
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
                      <div className="group w-1/5 h-1/5 relative flex items-center justify-center">
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSelected(null);
                            } else setSelected({ x, y });
                          }}
                          className="w-full h-full rounded-full transition-transform cursor-pointer"
                          style={{
                            backgroundColor: isSelected
                              ? "var(--color-primary)"
                              : color,
                            transform: isSelected ? "scale(1.5)" : "scale(1)",
                          }}
                        />

                        {/* Hover coordinates tooltip */}
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 px-1 py-0.5 text-[12px] 
                            rounded bg-popover text-popover-foreground opacity-0 group-hover:opacity-100
                            transition-opacity pointer-events-none whitespace-nowrap z-50 
                            ${x < 0 ? "left-4" : "right-4"}`}
                        >
                          {" "}
                          ({x}, {y})
                        </span>
                      </div>
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
            id="about-text-area"
            placeholder="Write about your day..."
          />
        </div>

        {/* Submit */}
        <Button className="w-full">Save Mood</Button>
      </CardContent>
    </Card>
  );
}
