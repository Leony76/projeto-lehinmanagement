'use server'

import prisma from "../lib/prisma"

export const getProducts = async() => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    stock: product.stock,
    createdAt: product.createdAt?.toISOString() ?? null,
    price: product.price.toNumber(),
    sellerId: product.seller.id,
    sellerName: product.seller.name,
    sellerRole: product.seller.role,
  }));
}

export const getUserProducts = async(userId: string) => {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: 'APPROVED',
        userId
      }
    },
    select: {
      product: true,
      order: {
        include: {
          orderItems: true,
          orderHistory: {
            select: {
              createdAt: true,
            }
          }
        },
      },
    },
    orderBy: { product: { id: 'desc' } },
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

    orderedAmount: item.order.orderItems.at(-1)?.quantity,
    orderTotalPrice: item.order.total.toNumber(),
    orderAcceptedAt: item.order.orderHistory.at(-1)?.createdAt.toISOString() ?? null
  }))
}

