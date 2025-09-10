import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { CalendarDays } from "lucide-react";
import { getColor } from "../../utils/helpers";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getMoodsByDate } from "../../lib/database";
import ErrorMessage from "@/components/ErrorMessage";

const Calendar = async () => {
  const { data, error } = await getMoodsByDate();

  if (!data || error) {
    return <ErrorMessage error={error || "Could not fetch the calendar"} />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize today to 00:00:00
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // create full month array
  const calendarDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const day = new Date(today.getFullYear(), today.getMonth(), i + 1);
    day.setHours(0, 0, 0, 0); // normalize each day too
    const iso = day.toISOString().split("T")[0];

    const entry = data.entries.find((e) => e.day.toISOString().startsWith(iso));

    return {
      day,
      iso,
      entry,
      isFuture: day > today,
    };
  });

  return (
    <TooltipProvider>
      {calendarDays.map((day) => (
        <Tooltip key={day.iso}>
          <TooltipTrigger asChild>
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-md cursor-pointer border"
              style={{
                backgroundColor: day.entry
                  ? getColor(day.entry.valence, day.entry.arousal)
                  : day.isFuture
                  ? "var(--color-muted-foreground)" // dark gray for future
                  : "var(--color-muted)", // gray for unreported
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{day.day.toDateString()}</p>
            {day.entry ? (
              <p className="text-xs text-muted mt-1">
                {day.entry.note || "No note"}
              </p>
            ) : day.isFuture ? (
              <p className="text-xs text-muted mt-1 italic">Future day</p>
            ) : (
              <p className="text-xs text-muted mt-1 italic">No entry</p>
            )}
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
};

export const CalendarWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <CardTitle>Mood Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <div className="grid grid-cols-7 gap-2">{children}</div>{" "}
      </CardContent>
    </Card>
  );
};

export const CalendarSkeleton = () => {
  return (
    <>
      {Array.from({ length: 30 }).map((_, i) => (
        <Skeleton key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border" />
      ))}
    </>
  );
};

export default Calendar;
