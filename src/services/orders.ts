"use server"

import prisma from "../lib/prisma";

export const getCustomerOrSellerOrdersStatus = async (userId: string) => {
  const stats = await prisma.order.groupBy({
    by: ['status'],
    where: { userId },
    _count: {
      id: true
    }
  });

  const counts = stats.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<string, number>);

  const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    totalOrders,
    totalPendingOrders: counts.PENDING,
    totalApprovedOrders: counts.APPROVED,
    totalDeniedOrders: counts.REJECTED,
  };
};

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

export const getCustomerOrSellerSpent = async (userId: string) => {
  const spent = await prisma.order.aggregate({
    where: {
      userId,
      status: 'APPROVED'
    },
    _sum: { total: true },
    _avg: { total: true },
    _max: { total: true },
    _min: { total: true }
  });

  return {
    total: Number(spent._sum.total || 0),
    average: Number(spent._avg.total || 0),
    max: Number(spent._max.total || 0),
    min: Number(spent._min.total || 0),
  };
}

