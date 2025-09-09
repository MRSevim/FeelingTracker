import { Dispatch, memo, SetStateAction } from "react";
import { getColor } from "../../utils/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Selected } from "./MoodSelector";

export const Dot = memo(function Dot({
  x,
  y,
  isSelected,
  setSelected,
}: {
  x: number;
  y: number;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<Selected>>;
}) {
  const color = getColor(x, y);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => setSelected(isSelected ? null : { x, y })}
          className="w-1/5 h-1/5 rounded-full transition-transform cursor-pointer"
          style={{
            backgroundColor: isSelected ? "var(--color-primary)" : color,
            transform: isSelected ? "scale(1.5)" : "scale(1)",
          }}
        />
      </TooltipTrigger>
      <TooltipContent>
        ({x}, {y})
      </TooltipContent>
    </Tooltip>
  );
});
