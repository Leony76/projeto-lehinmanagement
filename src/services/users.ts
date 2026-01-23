"use server"

import prisma from "../lib/prisma";

export const getUsersRoleCount = async () => {
  const stats = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      id: true
    }
  });

  const counts = stats.reduce((acc, curr) => {
    acc[curr.role] = curr._count.id;
    return acc;
  }, { ADMIN: 0, CUSTOMER: 0, SELLER: 0 } as Record<string, number>);

  return {
    admins: counts.ADMIN,
    customers: counts.CUSTOMER,
    sellers: counts.SELLER,
    total: counts.ADMIN + counts.CUSTOMER + counts.SELLER
  };
};