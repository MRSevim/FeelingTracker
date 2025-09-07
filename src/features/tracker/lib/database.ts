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

    return { entry, error: "" }; // null if not found
  } catch (error) {
    return { entry: null, error: returnErrorFromUnknown(error) };
  }
};
