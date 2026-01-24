'use server'

import prisma from "../lib/prisma"

export const getProducts = async() => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {id: 'desc' }
  })

  return products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    imageUrl: product.imageUrl,
    stock: product.stock,
    createdAt: product.createdAt?.toISOString() ?? null,
    price: product.price.toNumber(),
  }));
}