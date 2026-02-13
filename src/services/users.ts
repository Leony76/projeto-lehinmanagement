"use server"

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";
import { UserActionsHistory } from "../types/userActionsHistory";

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
              changedById: true,
            },
          },
        },
      },

      sellerProducts: {
        select: {
          orderItems: {
            select: {
              quantity: true,
              price: true, 
              product: {   
                select: {
                  name: true,
                },
              },
              order: {
                select: {
                  id: true,
                  status: true,
                  orderHistory: {
                    select: {
                      status: true,
                      createdAt: true,
                      changedById: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return users.map((user) => {
    const customerHistory: UserActionsHistory[] = user.orders.flatMap(order =>
      order.orderHistory.map(h => ({
        type:
          h.status === 'APPROVED'
            ? 'Pedido aceito'
          : h.status === 'REJECTED'
            ? 'Pedido negado'
          : h.status === 'CANCELED'
            ? 'Pedido cancelado'
            : 'Pedido',

        date: h.createdAt.toISOString(),
        value: Number(order.total),
        productName: order.orderItems[0].product.name,
        unitsOrdered: order.orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        orderId: order.id,
      }))
    );

  const sellerHistory: UserActionsHistory[] = Object.values(
    user.sellerProducts
      .flatMap(p => p.orderItems)
      .reduce<Record<string, UserActionsHistory>>((acc, item) => {
        const order = item.order;

        order.orderHistory.forEach(h => {
          const key = `${order.id}-${h.status}`;

          acc[key] ??= {
            type:
              h.status === 'APPROVED'
                ? 'Venda'
                : h.status === 'REJECTED'
                ? 'Pedido negado'
                : h.status === 'CANCELED'
                ? 'Pedido cancelado'
                : 'Pedido',

            date: h.createdAt.toISOString(),
            value: Number(item.price) * item.quantity,
            productName: item.product.name,
            unitsOrdered: item.quantity,
            orderId: order.id,
          };
        });

        return acc;
      }, {})
  );


  const history: UserActionsHistory[] = [...customerHistory, ...sellerHistory]
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));


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

