"use server";

import { Category } from "@prisma/client";
import { getRequiredSession } from "../lib/get-session-user";
import prisma from "../lib/prisma";

export const getDashboardStats = async() => {
  const user = (await getRequiredSession()).user;
  const userId = user.id;

  switch (user.role) {
    case 'CUSTOMER': {
      const [
        ordersDone,
        pendingOrders,
        accecptedOrders,
        rejectedOrders,
        mostRecentOrder,
        mostOrderedCategory,
        total_average_highestAndLowestSpend,
      ] = await Promise.all([
        prisma.order.count({ where: { userId } }),

        prisma.order.count({
          where: { userId, status: 'PENDING' },
        }),

        prisma.order.count({
          where: { userId, status: 'APPROVED' },
        }),

        prisma.order.count({
          where: { userId, status: 'REJECTED' },
        }),

        prisma.order.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),

        prisma.orderItem.groupBy({
          by: ['productId'],
          where: { order: { userId } },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 1,
        }),

        prisma.order.aggregate({
          where: {
            userId,
            status: 'APPROVED',
            deletedAt: null,
          },
          _sum: { total: true },
          _avg: { total: true },
          _max: { total: true },
          _min: { total: true },
        }),
      ]);

      let mostOrderedCategoryName: Category | null = null;

      if (mostOrderedCategory.length > 0) {
        const product = await prisma.product.findUnique({
          where: { id: mostOrderedCategory[0].productId },
          select: { category: true },
        });

        mostOrderedCategoryName = product?.category ?? null;
      }

      return {
        orders: {
          done: ordersDone,
          pending: pendingOrders,
          approved: accecptedOrders,
          rejected: rejectedOrders,
          mostRecent: mostRecentOrder,
          mostOrderedCategory: mostOrderedCategoryName,
        },
        spend: {
          total: total_average_highestAndLowestSpend._sum.total,
          average: total_average_highestAndLowestSpend._avg.total,
          lowest: total_average_highestAndLowestSpend._min.total,
          highest: total_average_highestAndLowestSpend._max.total,
        },
      };
    } 
     
    case 'SELLER': {
      const [
        salesDone,
        pendingSales,
        totalProductsSold,
        unsuccessfulSales,
        total_average_highestAndLowestEarn,

        mostRecentSale,
        salesByCategory,

        ordersDone,
        pendingOrders,
        accecptedOrders,
        rejectedOrders,
        mostRecentOrder,
        mostOrderedCategory,
        total_average_highestAndLowestSpend,
      ] = await Promise.all([
        prisma.orderItem.count({
          where: {
            order: { status: 'APPROVED' },
            product: { sellerId: userId },
          },
        }),

        prisma.orderItem.count({
          where: {
            order: { status: 'PENDING' },
            product: { sellerId: userId },
          },
        }),

        prisma.orderItem.aggregate({
          where: {
            product: { sellerId: userId },
            order: { status: 'APPROVED' },
          },
          _sum: { quantity: true },
        }),

        prisma.orderItem.count({
          where: {
            product: { sellerId: userId },
            OR: [
              { order: { status: 'CANCELED' } },
              { order: { status: 'REJECTED' } },
            ],
          },
        }),

        prisma.orderItem.aggregate({
          where: {
            product: { sellerId: userId },
            order: { status: 'APPROVED' },
          },
          _sum: { price: true },
          _avg: { price: true },
          _max: { price: true },
          _min: { price: true },
        }),

        prisma.orderItem.findFirst({
          where: {
            product: { sellerId: userId },
            order: { status: 'APPROVED' },
          },
          orderBy: { createdAt: 'desc' },
        }),

        prisma.orderItem.findMany({
          where: {
            product: { sellerId: userId },
            order: { status: 'APPROVED' },
          },
          select: {
            quantity: true,
            product: { select: { category: true } },
          },
        }),

         prisma.order.count({ where: { userId } }),

        prisma.order.count({
          where: { userId, status: 'PENDING' },
        }),

        prisma.order.count({
          where: { userId, status: 'APPROVED' },
        }),

        prisma.order.count({
          where: { userId, status: 'REJECTED' },
        }),

        prisma.order.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),

        prisma.orderItem.groupBy({
          by: ['productId'],
          where: { order: { userId } },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 1,
        }),

        prisma.order.aggregate({
          where: {
            userId,
            status: 'APPROVED',
            deletedAt: null,
          },
          _sum: { total: true },
          _avg: { total: true },
          _max: { total: true },
          _min: { total: true },
        }),
      ]);

      let mostOrderedCategoryName: Category | null = null;

      if (mostOrderedCategory.length > 0) {
        const product = await prisma.product.findUnique({
          where: { id: mostOrderedCategory[0].productId },
          select: { category: true },
        });

        mostOrderedCategoryName = product?.category ?? null;
      }

      const categoryMap = salesByCategory.reduce((acc, item) => {
        acc[item.product.category] =
          (acc[item.product.category] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

      const mostSoldCategory =
        Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] ?? null;

      return {
        orders: {
          done: ordersDone,
          pending: pendingOrders,
          approved: accecptedOrders,
          rejected: rejectedOrders,
          mostRecent: mostRecentOrder,
          mostOrderedCategory: mostOrderedCategoryName,
        },

        spend: {
          total: total_average_highestAndLowestSpend._sum.total,
          average: total_average_highestAndLowestSpend._avg.total,
          lowest: total_average_highestAndLowestSpend._min.total,
          highest: total_average_highestAndLowestSpend._max.total,
        },
        
        sales: {
          done: salesDone,
          pending: pendingSales,
          total: totalProductsSold,
          unsuccessful: unsuccessfulSales,
          earn: {
            total: total_average_highestAndLowestEarn._sum.price,
            average: total_average_highestAndLowestEarn._avg.price,
            highest: total_average_highestAndLowestEarn._max.price,
            lowest: total_average_highestAndLowestEarn._min.price,
          },
          mostSoldCategory,
          mostRecentSale,
        },
      };
    }

    default:

      const [
        customersCount,
        sellersCount,
        adminsCount,

        sellersRevenueBySeller,
        dailyEarnFromSellers,
        salesWithProduct,

        ordersDoneByCustomers,
        customersPendingOrders,
        approvedOrdersFromCustomers,
        rejectedOrdersFromCustomers,
        avarageSpendFromCustomers,
        customerOrdersWithProduct,

        ordersDoneBySellers,
        sellersPendingOrders,
        approvedOrdersFromSellers,
        rejectedOrdersFromSellers,
        avarageSpendFromSellers,
        sellerOrdersWithProduct,
      ] = await Promise.all([

        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'SELLER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),

        // 🔹 Receita total por seller (só número)
        prisma.orderItem.aggregate({
          where: { order: { status: 'APPROVED' } },
          _sum: { price: true },
        }),

        // 🔹 Receita diária
        prisma.orderItem.aggregate({
          where: {
            order: {
              status: 'APPROVED',
              createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
          },
          _sum: { price: true },
        }),

        // 🔹 Produtos vendidos (nome + categoria)
        prisma.orderItem.findMany({
          where: { order: { status: 'APPROVED' } },
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        }),

        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'APPROVED' } }),
        prisma.order.count({ where: { status: 'REJECTED' } }),

        prisma.order.aggregate({
          where: { status: 'APPROVED' },
          _avg: { total: true },
        }),

        // 🔹 Produtos pedidos por clientes
        prisma.orderItem.findMany({
          where: {
            order: { status: 'APPROVED', user: { role: 'CUSTOMER' } },
          },
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        prisma.orderItem.count({ where: { order: { status: 'APPROVED' } } }),
        prisma.orderItem.count({ where: { order: { status: 'PENDING' } } }),
        prisma.orderItem.count({ where: { order: { status: 'APPROVED' } } }),
        prisma.orderItem.count({
          where: {
            OR: [
              { order: { status: 'REJECTED' } },
              { order: { status: 'CANCELED' } },
            ],
          },
        }),

        prisma.orderItem.aggregate({
          where: { order: { status: 'APPROVED' } },
          _avg: { price: true },
        }),

        // 🔹 Produtos vendidos por sellers
        prisma.orderItem.findMany({
          where: {
            order: { status: 'APPROVED' },
          },
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);


      const sellersAverageEarning =
      (sellersRevenueBySeller._sum.price?.toNumber() ?? 0) /
      (sellersCount || 1);


      const categoryMap = salesWithProduct.reduce((acc, item) => {
        acc[item.product.category] =
          (acc[item.product.category] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

      const mostSoldCategory =
        Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] ?? null;

      const productMap = salesWithProduct.reduce((acc, item) => {
        const id = item.product.id;
        acc[id] ??= { name: item.product.name, quantity: 0 };
        acc[id].quantity += item.quantity;
        return acc;
      }, {} as Record<number, { name: string; quantity: number }>);

      const mostSoldProduct =
        Object.values(productMap).sort((a, b) => b.quantity - a.quantity)[0] ?? null;

      const mostOrderedProductByCustomers =
        Object.values(
          customerOrdersWithProduct.reduce((acc, item) => {
            const id = item.product.id;
            acc[id] ??= { name: item.product.name, quantity: 0 };
            acc[id].quantity += item.quantity;
            return acc;
          }, {} as Record<number, { name: string; quantity: number }>)
        ).sort((a, b) => b.quantity - a.quantity)[0] ?? null;

      const salesByCategory = Object.entries(
        salesWithProduct.reduce((acc, item) => {
          const category = item.product.category;
          acc[category] = (acc[category] || 0) + item.quantity;
          return acc;
        }, {} as Record<string, number>)
      ).map(([category, total]) => ({
        category,
        total,
      }));

      const mostOrderedProductBySellers =
        Object.values(
          sellerOrdersWithProduct.reduce((acc, item) => {
            const productId = item.product.id;

            acc[productId] ??= {
              id: productId,
              name: item.product.name,
              quantity: 0,
            };

            acc[productId].quantity += item.quantity;
            return acc;
          }, {} as Record<number, { id: number; name: string; quantity: number }>)
        ).sort((a, b) => b.quantity - a.quantity)[0] ?? null;


      return {
        customersCount,
        sellersCount,
        adminsCount,

        sellersAverageEarning,
        dailyEarnFromSellers,
        mostSoldProduct,
        salesByCategory,

        ordersDoneByCustomers,
        customersPendingOrders,
        approvedOrdersFromCustomers,
        rejectedOrdersFromCustomers,
        avarageSpendFromCustomers,
        mostOrderedProductByCustomers,

        ordersDoneBySellers,
        sellersPendingOrders,
        approvedOrdersFromSellers,
        rejectedOrdersFromSellers,
        avarageSpendFromSellers,
        mostOrderedProductBySellers,
        mostSoldCategory,
      }
  }
};


