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
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: 'APPROVED',
        userId
      }
    },
    include: {
      product: true
    },
    orderBy: { product: { id: 'desc' } },
  });

  return orderItems.map((orderItem) => ({
    id: orderItem.product.id,
    name: orderItem.product.name,
    category: orderItem.product.category,
    description: orderItem.product.description,
    imageUrl: orderItem.product.imageUrl,
    stock: orderItem.product.stock,
    createdAt: orderItem.product.createdAt?.toISOString() ?? null,
    price: orderItem.product.price.toNumber(),
  }))
}

