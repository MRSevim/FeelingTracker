"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkAuth, returnErrorFromUnknown } from "@/utils/helpers";
import { AddMood } from "../utils/types";
import { getIsoDate, getStartAndEndOfToday } from "../utils/helpers";
import { routes } from "@/utils/config";
import { getMoodFromValenceArousal } from "../utils/MoodInsight-utils";

//adds mood with current date or update if already exists
export const addMood = async (entry: AddMood) => {
  try {
    const user = await checkAuth();

    const valence = entry.valence;
    const arousal = entry.arousal;
    const note = entry.note;

    if (
      !Number.isInteger(valence) ||
      !Number.isInteger(arousal) ||
      Math.abs(valence) > 5 ||
      Math.abs(arousal) > 5
    )
      throw Error("Valence and arousal must be whole numbers between -5 and 5");

    const { gte, lte } = getStartAndEndOfToday();

    const existing = await prisma.moodEntry.findFirst({
      where: {
        userId: user.id,
        day: {
          gte,
          lte,
        },
      },
    });

    if (existing) {
      // overwrite existing mood for today
      await prisma.moodEntry.update({
        where: { id: existing.id },
        data: {
          valence,
          arousal,
          note,
        },
      });
    } else {
      // create new mood entry
      await prisma.moodEntry.create({
        data: {
          userId: user.id,
          day: new Date(),
          valence,
          arousal,
          note,
        },
      });
    }
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
  redirect(routes.dashboard);
};

//gets the mood of today by scanning between starting and end of the today
export const getTodaysMood = async () => {
  try {
    const user = await checkAuth();

    const { gte, lte } = getStartAndEndOfToday();

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

    const gte = new Date(year, month, 1, 0, 0, 0, 0);
    const lte = new Date(year, month + 1, 0, 23, 59, 59, 999);

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
export const getMoodEntriesByDays = async (days: number = 90) => {
  try {
    const user = await checkAuth();
    const now = new Date();

    const gte = new Date();
    gte.setDate(now.getDate() - (days - 1)); // inclusive

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        day: {
          gte,
          lte: now,
        },
      },
      orderBy: { day: "asc" },
    });

    // map entries to a dictionary for quick lookup
    const entryMap = new Map(
      entries.map((e) => [
        getIsoDate(e.day), //
        { valence: e.valence, arousal: e.arousal },
      ])
    );

    // generate full days array
    const chartData = Array.from({ length: days }, (_, i) => {
      const d = new Date(gte);
      d.setDate(gte.getDate() + i);
      const day = getIsoDate(d);

      return {
        day: d,
        ...entryMap.get(day),
      };
    });

    return { data: chartData, error: "" };
  } catch (error) {
    return { data: [], ...returnErrorFromUnknown(error) };
  }
};

//Gets the insights between now and specified days ago
export const getInsightsByDays = async (days: number = 90) => {
  try {
    const user = await checkAuth();
    const now = new Date();

    const gte = new Date();
    gte.setDate(now.getDate() - (days - 1)); // inclusive

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        day: {
          gte,
          lte: now,
        },
      },
      orderBy: { day: "asc" },
    });

    const MIN_REQUIRED_ENTRIES = 2;

    if (entries.length < MIN_REQUIRED_ENTRIES) {
      return {
        insights: [
          `Not enough data, Please save at least ${MIN_REQUIRED_ENTRIES} mood entries...`,
        ],
        error: "",
        insufficientData: true,
      };
    }

    // Helper to get majority (returns null if tie)
    const getMajority = (arr: string[]) => {
      if (!arr.length) return null;

      const counts: Record<string, number> = {};
      arr.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

      let max = 0;
      let majority: string | null = null;
      let isTie = false;

      for (const key in counts) {
        if (counts[key] > max) {
          max = counts[key];
          majority = key;
          isTie = false; // reset tie flag since we found a new max
        } else if (counts[key] === max) {
          isTie = true;
        }
      }

      return isTie ? null : majority;
    };

    // Map moods for all entries
    const moods = entries.map((e) =>
      getMoodFromValenceArousal(e.valence, e.arousal)
    );

    // Separate weekdays and weekends
    const weekdays = entries
      .filter((e) => [1, 2, 3, 4, 5].includes(e.day.getDay()))
      .map((e) => getMoodFromValenceArousal(e.valence, e.arousal));

    const weekends = entries
      .filter((e) => [0, 6].includes(e.day.getDay()))
      .map((e) => getMoodFromValenceArousal(e.valence, e.arousal));

    // Most common moods
    const overallMood = getMajority(moods);
    const weekdayMood = getMajority(weekdays);
    const weekendMood = getMajority(weekends);

    const MIN_REQUIRED_VALUE_THRESHOLD = 0;

    // High/low valence majority
    const highValenceCount = entries.filter(
      (e) => e.valence > MIN_REQUIRED_VALUE_THRESHOLD
    ).length;
    const lowValenceCount = entries.filter(
      (e) => e.valence < -MIN_REQUIRED_VALUE_THRESHOLD
    ).length;
    const highArousalCount = entries.filter(
      (e) => e.arousal > MIN_REQUIRED_VALUE_THRESHOLD
    ).length;
    const lowArousalCount = entries.filter(
      (e) => e.arousal < -MIN_REQUIRED_VALUE_THRESHOLD
    ).length;

    const valenceInsight =
      highValenceCount > lowValenceCount
        ? "Your valence was mostly high."
        : lowValenceCount > highValenceCount
        ? "Your valence was mostly low."
        : null;

    const arousalInsight =
      highArousalCount > lowArousalCount
        ? "Your arousal was mostly high."
        : lowArousalCount > highArousalCount
        ? "Your arousal was mostly low."
        : null;

    // Build final insights array
    const insights: string[] = [];

    if (overallMood) insights.push(`Most of your moods were "${overallMood}".`);
    if (weekdayMood) insights.push(`Weekdays were mostly "${weekdayMood}".`);
    if (weekendMood) insights.push(`Weekends were mostly "${weekendMood}".`);
    if (valenceInsight) insights.push(valenceInsight);
    if (arousalInsight) insights.push(arousalInsight);

    return { insights, error: "" };
  } catch (error) {
    return { insights: [], ...returnErrorFromUnknown(error) };
  }
};
