'use server'

import prisma from "../lib/prisma"

export const getProducts = async() => {

  const [
    products,
    avgRatings,
    productSales, 
  ] = await Promise.all([
    prisma.product.findMany({
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
    }),
  
  
    prisma.productReview.groupBy({
      by: ['productId'],
      _avg: {
        rating: true,
      },
    }),
  
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: 'APPROVED',
          deletedAt: null,
        },
      },
      _sum: {
        quantity: true,
      },
    }),
  ]);
  
  const avgRatingMap = new Map(
    avgRatings.map(r => [
      r.productId,
      r._avg.rating !== null
        ? r._avg.rating.toFixed(1).replace('.', ',')
        : null,
    ]),
  );

  const salesMap = new Map(
    productSales.map(sale => [
      sale.productId,
      sale._sum.quantity ?? 0,
    ])
  );

  return products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    stock: product.stock,
    reservedStock: product.reservedStock,
    createdAt: product.createdAt?.toISOString() ?? null,
    updatedAt: product.updatedAt?.toISOString() ?? null,
    price: product.price.toNumber(),

    sellerId: product.seller.id,
    sellerName: product.seller.name,
    sellerRole: product.seller.role,
    productSalesCount: salesMap.get(product.id) ?? null,
    productAverageRating: avgRatingMap.get(product.id) ?? null,
  }));
}

export const getUserProducts = async (userId: string) => {
  const items = await prisma.costumerProduct.findMany({
    where: {
      costumerId: userId,
      deletedAt: null,
    },
    include: {
      costumerProduct: true,
      order: {
        select: {
          id: true,
          total: true,
          orderItems: true,
          orderHistory: {
            select: {
              createdAt: true,
            },
          },
        },
      },
    },
  });

  const reviews = await prisma.productReview.findMany({
    where: {
      userId,
    },
  });

  const reviewMap = new Map(
    reviews.map(r => [
      r.productId,
      {
        rating: r.rating,
        comment: r.comment,
      },
    ]),
  );

  const avgRatings = await prisma.productReview.groupBy({
    by: ['productId'],
    _avg: {
      rating: true,
    },
  });

  const avgRatingMap = new Map(
    avgRatings.map(r => [
      r.productId,
      r._avg.rating !== null
        ? r._avg.rating.toFixed(1).replace('.', ',')
        : null,
    ]),
  );


  const productMap = new Map<number, any>();

  for (const item of items) {
    const product = item.costumerProduct;
    const order = item.order;

    if (!productMap.has(product.id)) {
      const review = reviewMap.get(product.id);

      productMap.set(product.id, {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock,
        createdAt: product.createdAt?.toISOString() ?? null,
        price: product.price.toNumber(),
        orders: [],

        productRating: review?.rating ?? 0,
        hasReview: Boolean(review?.comment?.trim()),
        productAverageRating: avgRatingMap.get(product.id),
      });
    }

    productMap.get(product.id).orders.push({
      id: order.id,
      total: order.total.toNumber(),
      acceptedAt: order.orderHistory.at(-1)?.createdAt ?? null,
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toNumber(),       
        createdAt: item.createdAt.toISOString(),
      })),
    });
  }

  return Array.from(productMap.values());
}
