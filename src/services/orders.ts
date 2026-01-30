"use server"

import { headers } from "next/headers";
import { OrderStatus, SystemRoles } from "../constants/generalConfigs";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { orderStats } from "../utils/orderStats";
import { timeAgo } from "../utils/timeAgo";
import { getRequiredSession } from "../lib/get-session-user";

export const getCustomerAndSellersOrdersStats = async (userId: string) => {
  const [

    statusStats,
    spentStats,
    order,
    result,

  ] = await Promise.all([
    prisma.order.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true }
    }),

    prisma.order.aggregate({
      where: {
        userId,
        status: 'APPROVED'
      },
      _sum: { total: true },
      _avg: { total: true },
      _max: { total: true },
      _min: { total: true }
    }),

    prisma.order.findFirst({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          userId,
          status: 'APPROVED', 
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 1,
    }),
  ]);

  let mostOrderedCategory = 'Nenhum produto pedido';

  if (result.length > 0) {
    const product = await prisma.product.findUnique({
      where: { id: result[0].productId },
      select: {
        category: true    
      },
    })

    mostOrderedCategory = product?.category ?? mostOrderedCategory
  }
  
  const stats = orderStats(statusStats);

  return {
    totalOrders: stats.total,
    ordersByStatus: {
      pending: stats.status.PENDING,
      approved: stats.status.APPROVED,
      rejected: stats.status.REJECTED,
    },
    spent: {
      total: Number(spentStats._sum.total ?? 0),
      average: Number(spentStats._avg.total ?? 0),
      max: Number(spentStats._max.total ?? 0),
      min: Number(spentStats._min.total ?? 0)
    },
    mostRecentOrder: order 
      ? timeAgo(order.createdAt)
      : 'Nenhum pedido feito',
    mostOrderedCategory,
  }
}



export const getSellerOrdersRevenue = async (userId: string) => {
  const sellerItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: userId 
      },
      order: {
        status: 'APPROVED' 
      }
    },
    select: {
      price: true,
      quantity: true
    }
  });

  const revenues = sellerItems.map(item => Number(item.price) * item.quantity);
  
  const totalSum = revenues.reduce((a, b) => a + b, 0);
  const avg = revenues.length > 0 ? totalSum / revenues.length : 0;
  const max = revenues.length > 0 ? Math.max(...revenues) : 0;
  const min = revenues.length > 0 ? Math.min(...revenues) : 0;

  return {
    _sum: { total: totalSum },
    _avg: { total: avg },
    _max: { total: max },
    _min: { total: min },
    count: sellerItems.length
  };
}




type BuyerRole = Extract<SystemRoles, 'CUSTOMER' | 'SELLER'>

export const getOverallCustomersAndSellersOrderStats = async (role: BuyerRole) => {
  const [orders, averageOrder, mostOrderedItem] = await Promise.all([
    prisma.order.groupBy({
      by: ['status'],
      where: { user: { role } },
      _count: { id: true }
    }),

    prisma.order.aggregate({
      where: {
        user: { role },
        status: 'APPROVED'
      },
      _avg: { total: true }
    }),

    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          user: { role },
          status: 'APPROVED'
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1
    })
  ])

  const ordersStatus = orders.reduce(
    (acc, curr) => {
      acc[curr.status as OrderStatus] = curr._count.id
      return acc
    },
    {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELED: 0
    } satisfies Record<OrderStatus, number>
  )

  const totalOrders = Object.values(ordersStatus).reduce((a, b) => a + b, 0)

  const mostOrderedProduct =
    mostOrderedItem.length > 0
      ? await prisma.product.findUnique({
          where: { id: mostOrderedItem[0].productId },
          select: { name: true }
        })
      : null

  return {
    role,
    totalOrders,
    ordersStatus,
    averageOrderValue: Number(averageOrder._avg.total ?? 0),
    mostOrderedProduct
  }
}

export const getSellerOrders = async() => {
  const session = await getRequiredSession();

  const items = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: session.user.id
      },
      order: {
        deletedBySellerAt: null
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      product: true,
      order: {
        include: {
          user: {
            select: {
              name: true,
            }
          },
          payments: {
            select: {
              status: true,
            },
          },
          orderHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { rejectionJustify: true }
          }
        },
      },
    },
  });

  return items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    category: item.product.category,
    description: item.product.description,
    imageUrl: item.product.imageUrl,
    stock: item.product.stock,
    createdAt: item.product.createdAt?.toISOString() ?? null,
    price: item.product.price.toNumber(),

    orderId: item.order.id,
    orderCreatedAt: item.createdAt.toISOString() ?? null,
    orderedAmount: item.quantity,
    orderComission: item.order.total.toNumber(),
    orderCustomerName: item.order.user.name,
    orderStatus: item.order.status,
    orderPaymentStatus: item.order.payments.at(-1)?.status ?? 'PENDING',
    orderRejectionJustify: item.order.orderHistory.at(-1)?.rejectionJustify ?? null,
    orderDeletedByCustomer: item.order.deletedByCustomerAt !== null
  }));
}

export const getOrdersFromUser = async() => {
  const session = await getRequiredSession();

  const ordersFromUser = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: session.user.id,
        deletedByCustomerAt: null
      }
    },
    include: {
      product: true,
      order: {
        select: {
          total: true,
          createdAt: true,
          status: true,
          orderItems: {
            select: {
              quantity: true,
            }
          },
          payments: {
            select: {
              status: true,
            },
          },
          orderHistory: {           
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              rejectionJustify: true,
              changedBy: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return ordersFromUser.map((item) => ({
    

    id: item.product.id,
    name: item.product.name,
    category: item.product.category,
    description: item.product.description,
    imageUrl: item.product.imageUrl,
    stock: item.product.stock,
    createdAt: item.product.createdAt?.toISOString() ?? null,
    price: item.product.price.toNumber(),

    orderId: item.orderId,
    orderTotalPrice: item.order.total.toNumber(),
    orderDate: item.order.createdAt?.toISOString() ?? null,
    orderAmount: item.quantity,
    orderPaymentStatus: item.order.payments.at(-1)?.status ?? 'PENDING',
    orderStatus: item.order.status,
    orderRejectionJustify: item.order.orderHistory.at(-1)?.rejectionJustify ?? null,
    orderRejectedBy: item.order.orderHistory.at(-1)?.rejectionJustify 
      ? item.order.orderHistory.at(-1)?.changedBy.name 
      : null
  }));
}


