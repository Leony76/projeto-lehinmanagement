"use server"

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { getRequiredSession } from "../lib/get-session-user";
import prisma from "../lib/prisma";

export async function getUsersRoleCount() {
  const stats = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      id: true
    }
  });

  const counts = stats.reduce((acc, curr) => {
    acc[curr.role ?? 'CUSTOMER'] = curr._count.id;
    return acc;
  }, { ADMIN: 0, CUSTOMER: 0, SELLER: 0 } as Record<string, number>);

  return {
    admins: counts.ADMIN,
    customers: counts.CUSTOMER,
    sellers: counts.SELLER,
    total: counts.ADMIN + counts.CUSTOMER + counts.SELLER
  };
};

export async function getUserSystemTheme() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  
  if (!session) {
    return false;
  } 

  const userTheme = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      darkTheme: true,
    },
  });

  return userTheme 
    ? userTheme.darkTheme 
    : false;
}