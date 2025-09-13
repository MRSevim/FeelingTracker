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
import { getMoodsByMonth } from "../../lib/database";
import ErrorMessage from "@/components/ErrorMessage";
import DatePicker, { DatePickerSkeleton } from "./DatePicker";
import { DashboardSearchParams } from "../../utils/types";
import { headers } from "next/headers";

async function getUserLocale(): Promise<string | undefined> {
  const h = await headers();
  const acceptLanguage = h.get("accept-language"); // e.g. "en-US,en;q=0.9,fr;q=0.8"
  if (!acceptLanguage) return undefined;

  // get the first language
  const primaryLocale = acceptLanguage.split(",")[0];
  return primaryLocale;
}

const Calendar = async ({ searchParams }: DashboardSearchParams) => {
  const params = await searchParams;
  const year = Number(params?.year);
  const month = Number(params?.month);

  const { data, error } = await getMoodsByMonth({ year, month });

  if (!data || error) {
    return <ErrorMessage error={error || "Could not fetch the calendar"} />;
  }

  const dataYear = data.year;
  const dataMonth = data.month;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize today to 00:00:00

  const lastDay = new Date(dataYear, dataMonth + 1, 0);

  // create full month array
  const calendarDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const day = new Date(dataYear, dataMonth, i + 1);
    day.setHours(0, 0, 0, 0); // normalize each day too

    // find matching entry
    const entry = data.entries.find((e) => {
      const entryDate = new Date(e.day);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === day.getTime();
    });

    return {
      day,
      entry,
      isFuture: day > today,
    };
  });

  const locale = await getUserLocale();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 flex flex-col">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <CardTitle>Mood Calendar</CardTitle>
        <DatePicker
          data={{
            availableTimes: data.availableTimes,
            month: data.month,
            year: data.year,
          }}
        />
      </CardHeader>
      <CardContent>
        {" "}
        <div className="grid grid-cols-7 gap-2">
          <TooltipProvider>
            {calendarDays.map((day) => (
              <Tooltip key={day.day.getTime()}>
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
                <TooltipContent className="text-wrap text-center max-w-[200px]">
                  <p className="text-sm font-medium">
                    {day.day.toLocaleDateString(locale)}
                  </p>
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
        </div>
      </CardContent>
    </Card>
  );
};

export const CalendarSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 flex flex-col">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <CardTitle>Mood Calendar</CardTitle>
        <DatePickerSkeleton />
      </CardHeader>
      <CardContent>
        {" "}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
