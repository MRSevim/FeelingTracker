"use client";

import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/shadcn/select";
import { Skeleton } from "@/components/shadcn/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  callReplace,
  DatePickerProps,
  getAvailableMonthsByYear,
  getAvailableYears,
  sortAndGetCurrentIndex,
} from "../../utils/DatePicker-utils";

function DatePicker({ data }: DatePickerProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [month, setMonth] = useState(data.month);
  const [year, setYear] = useState(data.year);
  const [years, setYears] = useState(getAvailableYears(data.availableTimes));
  const [months, setMonths] = useState(
    getAvailableMonthsByYear(data.availableTimes, year)
  );

  useEffect(() => {
    //to sync the local state with incoming data
    setMonth(data.month);
    setYear(data.year);
    setYears(getAvailableYears(data.availableTimes));
  }, [data]);

  useEffect(() => {
    /* Sets the available months when year changes, logic is in useEffect because year can change from
    both back and forward buttons and year selection*/
    setMonths(getAvailableMonthsByYear(data.availableTimes, year));
  }, [data, year]);

  const handlePrevMonth = () => {
    const { allTimes, currentIndex } = sortAndGetCurrentIndex(
      data.availableTimes,
      { year, month }
    );

    if (currentIndex > 0) {
      const prev = allTimes[currentIndex - 1];
      setYear(prev.year);
      setMonth(prev.month);
      callReplace(replace, pathname, { year: prev.year, month: prev.month });
    }
  };

  const handleNextMonth = () => {
    const { allTimes, currentIndex } = sortAndGetCurrentIndex(
      data.availableTimes,
      { year, month }
    );

    if (currentIndex < allTimes.length - 1) {
      const next = allTimes[currentIndex + 1];
      setYear(next.year);
      setMonth(next.month);
      callReplace(replace, pathname, { year: next.year, month: next.month });
    }
  };

  const { allTimes: allTimesSorted, currentIndex } = useMemo(
    () => sortAndGetCurrentIndex(data.availableTimes, { year, month }),
    [data.availableTimes, year, month]
  );

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2 items-center justify-center">
        {/* Prev Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          disabled={currentIndex <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Go back a month</span>
        </Button>
        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          disabled={currentIndex >= allTimesSorted.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Go forward a month</span>
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-center">
        {/* Month Picker */}
        <Select
          value={month.toString()}
          onValueChange={(month) => {
            const monthNumber = Number(month);
            setMonth(monthNumber);
            callReplace(replace, pathname, { year, month: monthNumber });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.monthNumber} value={String(m.monthNumber)}>
                {m.string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Picker */}
        <Select
          value={year.toString()}
          onValueChange={(year) => {
            const yearNumber = Number(year);
            setYear(yearNumber);

            /* Selects the first available month when year changes */
            const newMonths = getAvailableMonthsByYear(
              data.availableTimes,
              yearNumber
            );

            setMonth(newMonths[0].monthNumber);
            return callReplace(replace, pathname, {
              year: yearNumber,
              month: newMonths[0].monthNumber,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function DatePickerSkeleton() {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2 items-center justify-center">
        <Skeleton className="h-8 w-10 rounded-md" /> {/* Prev */}
        <Skeleton className="h-8 w-10 rounded-md" /> {/* Next */}
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Skeleton className="h-8 w-[85px] rounded-md" /> {/* Month */}
        <Skeleton className="h-8 w-[85px] rounded-md" /> {/* Year */}
      </div>
    </div>
  );
}

export default DatePicker;
