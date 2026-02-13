"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { getRequiredSession } from "../lib/get-session-user";

export async function toggleDarkTheme(darkTheme: boolean) {
  const session = await getRequiredSession();

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      darkTheme,
    },
  });
  
  revalidatePath('/settings');
};


