"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkAuth, returnErrorFromUnknown } from "@/utils/helpers";
import { AddMood } from "../utils/types";
import { getUTC } from "../utils/helpers";
import { routes } from "@/utils/config";

//adds mood with current date converted to utc
export const addMood = async (entry: AddMood) => {
  try {
    const user = await checkAuth();

    const today = getUTC();
    const valence = entry.valence;
    const arousal = entry.arousal;
    const note = entry.note;

    await prisma.moodEntry.upsert({
      where: {
        userId_day: {
          userId: user.id,
          day: today,
        },
      },
      update: {
        valence,
        arousal,
        note,
      },
      create: {
        userId: user.id,
        day: today,
        valence,
        arousal,
        note,
      },
    });
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
  redirect(routes.dashboard);
};

//gets the mood of today by scanning between starting and end of the today
export const getTodaysMood = async () => {
  try {
    const user = await checkAuth();

    const gte = getUTC();
    const lte = getUTC();
    lte.setUTCHours(23, 59, 59, 999);
    gte.setUTCHours(0, 0, 0, 0);

    const entry = await prisma.moodEntry.findFirst({
      where: {
        userId: user.id,
        day: {
          gte,
          lte,
        },
      },
      orderBy: {
        day: "asc",
      },
    });

    return { entry, error: "" };
  } catch (error) {
    return { entry: null, ...returnErrorFromUnknown(error) };
  }
};

//gets the mood entries of certain month+year or this month if param is not there
export const getMoodsByMonth = async (param: {
  year?: number;
  month?: number;
}) => {
  try {
    const user = await checkAuth();
    const now = new Date();

    const year = param?.year || now.getFullYear();
    const month =
      param?.month !== undefined && !isNaN(param?.month)
        ? param.month
        : now.getMonth(); // 0-indexed: Jan = 0

    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const gte = getUTC(startOfMonth);
    const lte = getUTC(endOfMonth);

    // fetch entries for that month
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        day: {
          gte,
          lte,
        },
      },
      orderBy: {
        day: "asc",
      },
    });

    // scan all recorded months/years for frontend selection
    const allEntries = await prisma.moodEntry.findMany({
      where: { userId: user.id },
      select: { day: true },
    });

    // create a Set of unique "year-month" strings
    const availableTimesSet = new Set(
      allEntries.map((e) => {
        const date = new Date(e.day.getTime());
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    );

    // add current month/year to the Set
    availableTimesSet.add(`${now.getFullYear()}-${now.getMonth()}`);

    const availableTimes = Array.from(availableTimesSet).map((s) => {
      const [y, m] = s.split("-").map(Number);
      return { year: y, month: m };
    });

    return {
      data: {
        entries,
        availableTimes,
        month,
        year,
      },
      error: "",
    };
  } catch (error) {
    return { data: null, ...returnErrorFromUnknown(error) };
  }
};

//Gets the mood entries between now and specified days ago
export const getMoodEntriesByDaysAgo = async (daysAgo: number = 7) => {
  try {
    const user = await checkAuth();
    const now = new Date();

    const startDate = new Date();
    startDate.setDate(now.getDate() - (daysAgo - 1)); // inclusive

    const gte = getUTC(startDate);
    const lte = getUTC(now);

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        day: {
          gte,
          lte,
        },
      },
      orderBy: { day: "asc" },
    });

    // map entries to a dictionary for quick lookup
    const entryMap = new Map(
      entries.map((e) => [
        new Date(e.day).toISOString().slice(0, 10), // 'YYYY-MM-DD'
        { valence: e.valence, arousal: e.arousal, note: e.note } as AddMood,
      ])
    );

    // generate full day array
    const chartData = Array.from({ length: daysAgo }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dayKey = new Date(d).toISOString().slice(0, 10);

      return {
        name: dayKey, // can format differently if you want
        value: entryMap.get(dayKey) ?? undefined,
      };
    });
    return { data: chartData, error: "" };
  } catch (error) {
    return { data: [], ...returnErrorFromUnknown(error) };
  }
};
