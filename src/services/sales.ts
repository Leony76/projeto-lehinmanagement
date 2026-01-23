"use server"

import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { saleStats } from "../utils/saleStats";
import { timeAgo } from "../utils/timeAgo";

export const getOverallSaleStatus = async() => {
  const items = await prisma.orderItem.findMany({
    select: {
      quantity: true,
      price: true,
      order: {
        select: {
          status: true,
        }
      }
    }
  })

  return saleStats(items);
};



export const getSellerSaleStatus = async (userId: string) => {
  const [
    
    items,
    mostRecentSaleQuery,
    mostSoldProduct,

  ] = await Promise.all([

    prisma.orderItem.findMany({
      where: {
        product: { sellerId: userId }
      },
      select: {
        quantity: true,
        price: true,
        order: { select: { status: true } }
      }
    }),
  
    prisma.order.findFirst({
      where: {
        status: 'APPROVED',
        orderItems: {
          some: {
            product: { sellerId: userId }
          }
        }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    }),
  
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { status: 'APPROVED' },
        product: { sellerId: userId }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1
    }),
  ])

  const productName =
    mostSoldProduct.length > 0
      ? (
          await prisma.product.findUnique({
            where: { id: mostSoldProduct[0].productId },
            select: { name: true }
          })
        )?.name
      : null

  return {
    saleStats: saleStats(items),
    mostRecentSale: mostRecentSaleQuery
      ? timeAgo(mostRecentSaleQuery.createdAt)
      : 'Nenhuma venda aprovada',
    mostSoldCategory: productName
  }
}





export const getOverallSaleStatsFromSellers = async () => {
  const [
    
    averageSaleRevenueQuery,
    dailyRevenueQuery,
    mostSoldProductNameQuery,
    mostRequestedCategoryQuery,

  ] = await Promise.all([

    prisma.order.aggregate({
      where: {
        user: { role: "SELLER" },
        status: "APPROVED",
      },
      _avg: { total: true },
    }),

    prisma.$queryRaw<
    { total: Prisma.Decimal }[]
    >`
      SELECT
        SUM(o.total) as total
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE
        o.status = 'APPROVED'
        AND u.role = 'SELLER'
        AND DATE(o.created_at) = CURRENT_DATE
    `,

    prisma.$queryRaw<
    { name: string }[]
    >`
      SELECT
        p.name
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE
        o.status = 'APPROVED'
      GROUP BY p.id
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 1
    `,

    prisma.$queryRaw<
    { category: string }[]
    >`
      SELECT
        p.category
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE
        o.status = 'APPROVED'
      GROUP BY p.category
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 1
    `,
  ]);


  const averageSaleRevenue = averageSaleRevenueQuery._avg.total
    ? Number(averageSaleRevenueQuery._avg.total)
    : 0
  const dailyRevenue = Number(dailyRevenueQuery[0]?.total ?? 0);
  const mostSoldProductName = mostSoldProductNameQuery[0]?.name ?? null;
  const mostRequestedCategory = mostRequestedCategoryQuery[0]?.category ?? null;
  
  return {
    averageSaleRevenue,
    dailyRevenue,
    mostSoldProductName,
    mostRequestedCategory
  };
};
