import { Suspense } from "react";
import TodaysEntry, {
  TodaysEntrySkeleton,
  TodaysEntryWrapper,
} from "./TodaysEntry";
import Calendar, { CalendarSkeleton } from "./Calendar";
import { DashboardSearchParams } from "../../utils/types";
import ChartWrapper from "./Charts/ChartWrapper";
import { ChartSkeleton } from "./Charts/Chart";

export default function Dashboard({ searchParams }: DashboardSearchParams) {
  return (
    <div className="flex-1 w-full my-10 flex flex-col justify-center items-center md:flex-row gap-8 md:items-start">
      {" "}
      <div className="flex flex-col gap-8 justify-center items-center flex-1 w-full">
        <Suspense fallback={<CalendarSkeleton />}>
          <Calendar searchParams={searchParams} />
        </Suspense>

        <TodaysEntryWrapper>
          <Suspense fallback={<TodaysEntrySkeleton />}>
            <TodaysEntry />
          </Suspense>
        </TodaysEntryWrapper>
      </div>
      <Suspense fallback={<ChartSkeleton />}>
        <ChartWrapper />
      </Suspense>
    </div>
  );
}
