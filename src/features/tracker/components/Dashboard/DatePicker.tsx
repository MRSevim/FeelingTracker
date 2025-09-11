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
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type AvailableTimes = {
  year: number;
  month: number;
}[];

type DatePickerProps = {
  data: {
    availableTimes: AvailableTimes;
    month: number;
    year: number;
  };
};

const getAvailableYears = (availableTimes: AvailableTimes) => {
  return Array.from(new Set(availableTimes.map((t) => t.year))).sort(
    (a, b) => b - a // newest first
  );
};

const getAvailableMonthsByYear = (
  availableTimes: AvailableTimes,
  year: number
) => {
  const months = availableTimes
    .filter((t) => t.year === year) // only entries for the selected year
    .map((t) => t.month);
  const uniqueMonths = Array.from(new Set(months)); // remove duplicates
  const sortedMonths = uniqueMonths.sort((a, b) => a - b); // Jan..Dec order

  // convert to nice month names using the actual year
  const convertedMonths = sortedMonths.map((m) => {
    return {
      string: new Date(year, m).toLocaleString("default", { month: "long" }),
      monthNumber: m,
    };
  });

  return convertedMonths;
};

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
    setMonth(data.month);
    setYear(data.year);
    setYears(getAvailableYears(data.availableTimes));
  }, [data]);

  useEffect(() => {
    //Sets the available months
    setMonths(getAvailableMonthsByYear(data.availableTimes, year));
  }, [data, year]);

  useEffect(() => {
    //Selects the first available month when year changes if current selected month is not available
    const newMonths = getAvailableMonthsByYear(data.availableTimes, year);

    if (!newMonths.find((m) => m.monthNumber === month)) {
      setMonth(newMonths[0].monthNumber);
    }
  }, [data, year, month]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    replace(`${pathname}?month=${month.toString()}&year=${year.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Month Picker */}
      <Select
        value={month.toString()}
        onValueChange={(month) => setMonth(Number(month))}
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
        onValueChange={(year) => setYear(Number(year))}
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

      {/* Submit button with search icon */}
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search icon</span>
      </Button>
    </form>
  );
}

export function DatePickerSkeleton() {
  return (
    <div className="flex gap-2">
      {/* Month Picker Skeleton */}
      <Skeleton className="h-8 w-[85px] rounded-md" />

      {/* Year Picker Skeleton */}
      <Skeleton className="h-8 w-[85px] rounded-md" />

      {/* Search Button Skeleton */}
      <Skeleton className="h-8 w-10 rounded-md" />
    </div>
  );
}

export default DatePicker;
