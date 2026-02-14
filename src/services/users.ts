"use server"

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { AdminDTO, CustomerDTO, SellerDTO } from "../types/usersDTO";

type UsersGroupedDTO = {
  customers: CustomerDTO[];
  sellers: SellerDTO[];
  admins: AdminDTO[];
};

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

export async function getCustomers(): Promise<CustomerDTO[]> {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { 
      orders: {
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      },
    },
  });

  return users.map<CustomerDTO>((user) => ({
    id: user.id,
    name: user.name ?? '',
    role: 'CUSTOMER',
    createdAt: user.createdAt?.toISOString() ?? '',
    isActive: user.isActive,
    ordersDone: user.orders.length,

    history: user.orders.map((order) => ({
      type: 'Pedido',
      date: order.createdAt?.toISOString() ?? '',
      value: Number(order.total),
      productName: order.orderItems[0]?.product.name ?? '',
      unitsOrdered: order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      orderId: order.id,
    })),
  }));
}

export async function getSellers(): Promise<SellerDTO[]> {
  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    include: {
      sellerProducts: {
        include: {
          orderItems: {
            include: {
              order: {
                include: {
                  orderItems: true, 
                },
              },
            },
          },
        },
      },
    },
  });

  return sellers.map<SellerDTO>((seller) => {
    const orders = seller.sellerProducts.flatMap(
      (p) => p.orderItems.map((i) => i.order)
    );

    return {
      id: seller.id,
      name: seller.name ?? '',
      role: 'SELLER',
      createdAt: seller.createdAt?.toISOString() ?? '',
      isActive: seller.isActive,

      stats: {
        ordersDone: orders.length,
        salesDone: orders.filter(o => o.status === 'APPROVED').length,
      },

      history: orders.map((order) => ({
        type:
          order.status === 'APPROVED'
            ? 'Pedido aceito'
            : order.status === 'REJECTED'
            ? 'Pedido negado'
            : order.status === 'CANCELED'
            ? 'Pedido cancelado'
            : 'Pedido',
        date: order.createdAt?.toISOString() ?? '',
        value: Number(order.total),
        productName: order.orderItems[0]?.productId
          ? 'Produto vendido'
          : null,
        unitsOrdered: order.orderItems.reduce(
          (sum, i) => sum + i.quantity,
          0
        ),
        orderId: order.id,
      })),
    };
  });
}

export async function getAdmins(): Promise<AdminDTO[]> {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    include: {
      actor: {
        include: {
          targetUser: true,
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return admins.map<AdminDTO>((admin) => ({
    id: admin.id,
    name: admin.name ?? '',
    role: 'ADMIN',
    createdAt: admin.createdAt?.toISOString() ?? '',
    isActive: admin.isActive,

    history: admin.actor.map((action) => {
      if (action.targetUserId && action.targetUser) {
        return {
          target: 'USER',
          type: action.action === 'USER_ACTIVATED' ? 'Ativação' : 'Desativação',
          date: action.createdAt.toISOString(),
          username: action.targetUser.name ?? 'Usuário sem nome',
          justification: action.justification,
        };
      }

      return {
        target: 'PRODUCT',
        type: action.action === 'PRODUCT_EDITED' ? 'Edição' : 'Remoção',
        date: action.createdAt.toISOString(),
        productName: action.product?.name ?? 'Produto não encontrado',
        justification: action.justification, 
      };
    }),
  }));
}

export async function getUsers(): Promise<UsersGroupedDTO> {
  const customers = await getCustomers();
  const sellers = await getSellers();
  const admins = await getAdmins();

  return {
    customers,
    sellers,
    admins,
  };
}
