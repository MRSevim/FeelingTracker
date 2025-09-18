import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { TimezoneInfo } from "./types";

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

//helper to get use locale from headers if present
export async function getUserLocale(
  headers: () => Promise<ReadonlyHeaders>
): Promise<string | undefined> {
  const h = await headers();
  const acceptLanguage = h.get("accept-language"); // e.g. "en-US,en;q=0.9,fr;q=0.8"
  if (!acceptLanguage) return undefined;

  // get the first language
  const primaryLocale = acceptLanguage.split(",")[0];
  return primaryLocale;
}

//converts to iso date
export const getIsoDate = (date: Date) =>
  new Date(date).toISOString().slice(0, 10); //"YYYY-MM-DD";

//gets start and end of day respecting locality
export const getStartAndEndOfDay = (timezoneInfo: TimezoneInfo) => {
  const { timestamp, timezoneOffset } = timezoneInfo;

  const now = new Date(timestamp);
  const gte = new Date(now);
  gte.setMinutes(gte.getMinutes() - timezoneOffset);
  gte.setHours(0, 0, 0, 0);

  const lte = new Date(now);
  lte.setMinutes(lte.getMinutes() - timezoneOffset);
  lte.setHours(23, 59, 59, 999);
  return { gte, lte };
};
