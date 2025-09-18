export type AvailableTimes = YearAndMonth[];

export type DatePickerProps = {
  data: {
    availableTimes: AvailableTimes;
    month: number;
    year: number;
  };
};

export type YearAndMonth = { year: number; month: number };

export const getAvailableYears = (availableTimes: AvailableTimes) => {
  return Array.from(new Set(availableTimes.map((t) => t.year))).sort(
    (a, b) => b - a // newest first
  );
};

export const getAvailableMonthsByYear = (
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
      string: new Date(year, m).toLocaleString("en-US", { month: "long" }),
      monthNumber: m,
    };
  });

  return convertedMonths;
};

export const callReplace = (
  replace: (href: string) => void,
  pathname: string,
  data: YearAndMonth
) => {
  return replace(
    `${pathname}?month=${data.month.toString()}&year=${data.year.toString()}`
  );
};

export const sortAndGetCurrentIndex = (
  availableTimes: AvailableTimes,
  data: YearAndMonth
) => {
  const allTimes = availableTimes
    .map((t) => ({ ...t }))
    .sort((a, b) => a.year - b.year || a.month - b.month);
  const currentIndex = allTimes.findIndex(
    (t) => t.year === data.year && t.month === data.month
  );
  return { allTimes, currentIndex };
};
