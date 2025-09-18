export type AddMood = {
  valence: number;
  arousal: number;
  note?: string;
};

export type TimezoneInfo = {
  timestamp: number;
  timezoneOffset: number;
};

export type DashboardSearchParams = {
  searchParams: Promise<{ year?: string; month?: string }>;
};
