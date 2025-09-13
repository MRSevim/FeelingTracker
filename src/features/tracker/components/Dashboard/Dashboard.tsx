import { Suspense } from "react";
import TodaysEntry, {
  TodaysEntrySkeleton,
  TodaysEntryWrapper,
} from "./TodaysEntry";
import Calendar, { CalendarSkeleton } from "./Calendar";
import { DashboardSearchParams } from "../../utils/types";
import LineChartsWrapper from "./Charts/LineChartsWrapper";

export default function Dashboard({ searchParams }: DashboardSearchParams) {
  return (
    <div className="space-y-8 flex-1 mt-20">
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar searchParams={searchParams} />
      </Suspense>

      <TodaysEntryWrapper>
        <Suspense fallback={<TodaysEntrySkeleton />}>
          <TodaysEntry />
        </Suspense>
      </TodaysEntryWrapper>

      <Suspense fallback={"Loading..."}>
        <LineChartsWrapper />
      </Suspense>
    </div>
  );
}
