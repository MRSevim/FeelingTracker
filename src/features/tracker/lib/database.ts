"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkAuth, returnErrorFromUnknown } from "@/utils/helpers";
import { AddMood } from "../utils/types";
import { getUTC } from "../utils/helpers";
import { routes } from "@/utils/config";

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
