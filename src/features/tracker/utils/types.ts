export type AddMood = {
  valence: number;
  arousal: number;
  note?: string;
};

export type DashboardSearchParams = {
  searchParams: Promise<{ year?: string; month?: string }>;
};
