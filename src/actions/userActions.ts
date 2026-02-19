"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { getRequiredSession } from "../lib/get-session-user";
import { SupportMessageSentBy, SupportMessageType, UserSituation } from "@prisma/client";

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
        messageAfterReactivated: true,
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
    sentBy: SupportMessageSentBy;
    receiverId?: string;
  },
) {
  await prisma.supportMessage.create({
    data: {
      subject: data.subject ?? null,
      message: data.message,
      type: data.type,
      sentBy: data.sentBy,
      receiverId: data.receiverId,
      
      senderId: userData.id,
      situation: 'UNRESOLVED',
      userSituation: userData.situation,
    },
  });

  revalidatePath('/dashboard');
}

export async function sendReplyMessage(
  messageId: number,
  userId: string,
  replyMessage: string,
) {
  const replier = (await getRequiredSession()).user;
  
  await prisma.$transaction(async (tx) => {
    await tx.supportMessage.update({
      where: { id: messageId },
      data: {
        repliedAt: new Date(),
        reply: replyMessage,
        replierId: replier.id,
      },
    }),

    await tx.adminActionHistory.create({
      data: {
        action: 'MESSAGE_REPLY',
        actorId: replier.id,
        justification: '[Respondida ao apelo de um usuário do sistema]',
        targetUserId: userId,
      }
    });
  });

  revalidatePath('/users');
}

export async function toggleMessageAfteruserActivated(
  userId: string,
) {
  await prisma.user.update({
    where: { id: userId },
    data: { messageAfterReactivated: false },
  });

  revalidatePath('/dashboard');
}

