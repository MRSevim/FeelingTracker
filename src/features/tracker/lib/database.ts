"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkAuth, returnErrorFromUnknown } from "@/utils/helpers";
import { AddMood } from "../utils/types";
import { getToday } from "../utils/helpers";
import { routes } from "@/utils/config";

export const addMood = async (entry: AddMood) => {
  try {
    const user = await checkAuth();

    const today = getToday();
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
    const today = getToday();

    const entry = await prisma.moodEntry.findUnique({
      where: {
        userId_day: {
          userId: user.id,
          day: today,
        },
      },
    });

    return { entry, error: "" };
  } catch (error) {
    return { entry: null, ...returnErrorFromUnknown(error) };
  }
};

export const getMoodsByDate = async (param: {
  year?: number;
  month?: number;
}) => {
  try {
    const user = await checkAuth();
    const today = new Date(); // default to today

    const year = param?.year || today.getFullYear();
    const month =
      param?.month !== undefined && !isNaN(param?.month)
        ? param.month
        : today.getMonth(); // 0-indexed: Jan = 0

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // fetch entries for that month
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        day: {
          gte: startOfMonth,
          lte: endOfMonth,
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

    const availableTimes = Array.from(
      new Set(
        allEntries.map((e) => `${e.day.getFullYear()}-${e.day.getMonth()}`)
      )
    ).map((s) => {
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
