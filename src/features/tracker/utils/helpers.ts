// helper to get color based on x,y
export const getColor = (x: number, y: number) => {
  const valence = (x + 5) / 10; // 0-1 (unpleasant → pleasant)
  const arousal = (y + 5) / 10; // 0-1 (low → high)

  // interpolate between red → green for valence
  const r = Math.round(255 * (1 - valence));
  const g = Math.round(200 * valence);
  const b = Math.round(100 * arousal); // more arousal = brighter

  return `rgb(${r}, ${g}, ${b})`;
};

//converts to iso date
export const getIsoDate = (date: Date) =>
  new Date(date).toISOString().slice(0, 10); //"YYYY-MM-DD";

//gets start and end of day respecting locality
export const getStartAndEndOfToday = () => {
  const now = new Date();

  const gte = new Date(now);
  gte.setHours(0, 0, 0, 0);

  const lte = new Date(now);
  lte.setHours(23, 59, 59, 999);

  return { gte, lte };
};
