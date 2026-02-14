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

export async function deactivateUserAccount(
  userId: string,
  justification: string,
) {
  const actor = (await getRequiredSession()).user;

  if (actor.role !== 'ADMIN') throw new Error('Acesso negado');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true }
  });

  if (!user) throw new Error('Usuário não encontrado');
  if (!user?.isActive) throw new Error('Usuário já está desativado');

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });

    await tx.adminActionHistory.create({
      data: {
        action: 'USER_DEACTIVATED',
        justification,
        actorId: actor.id,
        targetUserId: userId,
      },
    });
  });

  revalidatePath('/users');
}

export async function activateUserAccount(
  userId: string,
  justification: string,
) {
  const actor = (await getRequiredSession()).user;

  if (actor.role !== 'ADMIN') throw new Error('Acesso negado');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true }
  });

  if (!user) throw new Error('Usuário não encontrado');
  if (user?.isActive) throw new Error('Usuário já está ativado');

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });

    await tx.adminActionHistory.create({
      data: {
        action: 'USER_ACTIVATED',
        justification,
        actorId: actor.id,
        targetUserId: userId,
      },
    });
  });

  revalidatePath('/users');
}

