"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { getRequiredSession } from "../lib/get-session-user";
import { Role } from "@prisma/client";

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

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
      isActive: true,

      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true,
          status: true,

          orderItems: {
            select: {
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                  sellerId: true,
                },
              },
            },
          },

          orderHistory: {
            select: {
              status: true,
              createdAt: true,
            },
          },
        },
      },

      sellerProducts: {
        select: {
          orderItems: {
            select: {
              quantity: true,
              order: {
                select: {
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return users.map((user) => {
  const history = user.orders.flatMap(order =>
    order.orderHistory.flatMap(historyItem =>
      order.orderItems.map(item => ({
        type: historyItem.status,
        date: historyItem.createdAt.toISOString(),
        value: Number(order.total),
        productName: item.product.name,
        unitsOrdered: item.quantity,
        orderId: order.id,
      }))
    )
  );

  const salesDone = user.sellerProducts.reduce((total, product) => {
    const approvedSales = product.orderItems.filter(
      item => item.order.status === 'APPROVED'
    );

    return total + approvedSales.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, 0);

  return {
    id: user.id,
    name: user.name ?? '[desconhecido]',
    role: user.role ?? 'CUSTOMER' as Role,
    createdAt: user.createdAt?.toISOString() ?? '??/??/??',
    isActive: user.isActive,

    stats: {
      ordersDone: user.orders.length,
      salesDone, 
    },

    history,
  };
})}
