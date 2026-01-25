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
  }));
}

