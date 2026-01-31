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
    productAverageRating: avgRatingMap.get(product.id) ?? null,
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
          },
        },
      },
    },
    orderBy: { product: { id: 'desc' } },
  });

  const reviews = await prisma.productReview.findMany({
    where: {
      userId, 
    }
  });

  const reviewMap = new Map(
    reviews.map(r => [
      r.productId,
      {
        rating: r.rating,
        comment: r.comment,
      }
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

  return items.map(item => {
    const review = reviewMap.get(item.product.id);

    return {
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
      orderAcceptedAt: item.order.orderHistory.at(-1)?.createdAt.toISOString() ?? null,

      productRating: review?.rating ?? 0,
      hasReview: Boolean(review?.comment?.trim()),

      productAverageRating: avgRatingMap.get(item.product.id) ?? null,
    };
  });
}

