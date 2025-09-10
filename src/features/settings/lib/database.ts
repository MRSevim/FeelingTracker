"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth, returnErrorFromUnknown } from "@/utils/helpers";
import { signOut } from "@/features/auth/lib/auth";
import { routes } from "@/utils/config";

export const deleteAccount = async () => {
  try {
    const user = await checkAuth();

    // Delete the user (cascades to accounts, sessions, moods)
    await prisma.user.delete({
      where: { id: user.id },
    });
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
  return await signOut({ redirectTo: routes.homepage });
};
