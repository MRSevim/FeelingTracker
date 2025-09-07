import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { CalendarDays, Edit3 } from "lucide-react";
import { getColor } from "../../utils/helpers";
import Link from "next/link";
import { routes } from "@/utils/config";

// mock data
const mockCalendar = Array.from({ length: 30 }, (_, i) => ({
  date: `2025-09-${String(i + 1).padStart(2, "0")}`,
  valence: Math.floor(Math.random() * 11) - 5,
  arousal: Math.floor(Math.random() * 11) - 5,
  note: Math.random() > 0.7 ? "Had a busy day at work" : null,
}));

const todayEntry = {
  valence: 1,
  arousal: -2,
  note: "Felt calm, had a walk outside",
};

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 flex-1 mt-20">
      {/* Calendar */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Mood Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-2">
              {mockCalendar.map((entry) => (
                <Tooltip key={entry.date}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-md cursor-pointer border"
                      style={{
                        backgroundColor: getColor(entry.valence, entry.arousal),
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{entry.date}</p>
                    {entry.note ? (
                      <p className="text-xs text-muted mt-1">{entry.note}</p>
                    ) : (
                      <p className="text-xs text-muted mt-1 italic">No note</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Today's Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Today’s Mood</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border"
              style={{
                backgroundColor: getColor(
                  todayEntry.valence,
                  todayEntry.arousal
                ),
              }}
            />
            <div>
              <p className="font-medium">You were calm today.</p>
              <p className="text-sm text-muted-foreground">{todayEntry.note}</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href={routes.homepage + "?edit=true"}>
              <Edit3 className="h-4 w-4" />
              Wanna change it?
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
