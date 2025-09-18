import { memo } from "react";

export const Tooltips = memo(function Memoized() {
  return (
    <>
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

      {/* Quadrant Labels (outside corners, stacked, rotated along diagonal) */}
      <span className="absolute top-0 left-0 -translate-y-full -translate-x-1/2 translate text-xs xs:text-sm sm:text-base text-muted-foreground pointer-events-none select-none leading-tight text-left rotate-[-15deg]">
        Anxious
        <br />
        Angry
      </span>
      <span className="absolute top-0 right-0 -translate-y-full translate-x-1/2  text-xs xs:text-sm sm:text-base text-muted-foreground pointer-events-none select-none leading-tight text-right rotate-[15deg]">
        Excited
        <br />
        Energized
      </span>
      <span className="absolute  bottom-0 left-0 translate-y-full -translate-x-1/2  text-xs xs:text-sm sm:text-base text-muted-foreground pointer-events-none select-none leading-tight text-left rotate-[15deg]">
        Sad
        <br />
        Low
      </span>
      <span className="absolute  bottom-0 right-0 translate-y-full translate-x-1/2  text-xs xs:text-sm sm:text-base text-muted-foreground pointer-events-none select-none leading-tight text-right rotate-[-15deg]">
        Peaceful
        <br />
        Relaxed
      </span>
    </>
  );
});
