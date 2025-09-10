import { Suspense } from "react";
import TodaysEntry, {
  TodaysEntrySkeleton,
  TodaysEntryWrapper,
} from "./TodaysEntry";
import Calendar, { CalendarSkeleton, CalendarWrapper } from "./Calendar";

export default function Dashboard() {
  return (
    <div className="space-y-8 flex-1 mt-20">
      <CalendarWrapper>
        <Suspense fallback={<CalendarSkeleton />}>
          <Calendar />
        </Suspense>
      </CalendarWrapper>

      <TodaysEntryWrapper>
        <Suspense fallback={<TodaysEntrySkeleton />}>
          <TodaysEntry />
        </Suspense>
      </TodaysEntryWrapper>
    </div>
  );
}
