"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { getRequiredSession } from "../lib/get-session-user";
import { SupportMessageType, UserSituation } from "@prisma/client";

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

export async function sendMessageToSupport(
  userData: {
    id: string;
    situation: UserSituation;
  },
  data: {
    subject?: string;
    message: string;
    type: SupportMessageType;
  },
) {
  await prisma.supportMessage.create({
    data: {
      subject: data.subject ?? null,
      message: data.message,
      type: data.type,
      
      userId: userData.id,
      situation: 'UNRESOLVED',
      userSituation: userData.situation,
    },
  });

  revalidatePath('/dashboard');
}

