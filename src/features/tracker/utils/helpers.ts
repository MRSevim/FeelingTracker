//helper to get  utc, prisma needs utc dates
export function getUTC(date?: Date): Date {
  const now = date || new Date();
  // Construct a new Date using UTC components
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  );
}

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
