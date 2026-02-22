'use server'

import prisma from "../lib/prisma"
import { BoughtProduct } from "../types/userProductDTO";
import { Prisma } from "@prisma/client";
import { getRequiredSession } from "../lib/get-session-user";
import { ProductDTO } from "../types/productDTO";

export const getProducts = async(): Promise<ProductDTO[]> => {

  const user = (await getRequiredSession()).user;

  const productsToBringByRole: Prisma.ProductFindManyArgs = 
  user.role === 'CUSTOMER' 
  ? { where: { 
      NOT: [
        { status: 'DELETED' },
        { status: 'REMOVED' },
      ],
    }}
  : user.role === 'SELLER' ? {
    where: {
      NOT: { status: 'DELETED' },  
    }
  } : {
    where: {
      NOT: { status: 'DELETED' },
      OR: [
        { status: 'ACTIVE' },
        { removedBy: 'ADMIN' },
      ],  
    }
  };
  
  const [
    products,
    avgRatings,
    productSales, 
  ] = await Promise.all([
    prisma.product.findMany({
      ...productsToBringByRole,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            role: true,
            senderSupportMessage: {
              select: {
                message: true,
                createdAt: true,

                reply: true,
                repliedAt: true,
                replier: {
                  select: {
                    name: true,
                  },
                },
              },
              orderBy: { repliedAt: 'desc'},
              take: 1,
            },
          },  
        },
        adminActions: {
          where: {
            action: 'PRODUCT_REMOVED',
          },
          select: {
            justification: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        supportMessages: {
          where: {
            type: 'APPEAL',
          },
          orderBy: { createdAt: 'asc' },
          include: {
            replier: { select: { 
              name: true,
              role: true, 
            }},
            sender:  { select: { 
              name: true,
              role: true, 
            }},
          }
        }  
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
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toNumber(),
      stock: product.stock,
      reservedStock: product.reservedStock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt?.toISOString() ?? null,
      updatedAt: product.updatedAt?.toISOString() ?? null,

      averageRating: avgRatingMap.get(product.id) ?? null,
      salesCount: salesMap.get(product.id) ?? null,

      status: product.status,
      
      removed: {
        by: product.removedBy,
        justify: product.adminActions[0]?.justification,
        at: product.removedAt?.toISOString(),
    
        supportMessages: product.supportMessages.map(msg => ({
          id: msg.id,
          sentAt: msg.createdAt.toISOString(),
          type: msg.type,
          subject: msg.subject,
          message: msg.message,
          sender: {
            name: msg.sender.name ?? 'Desconhecido',
            role: msg.sender.role ?? 'CUSTOMER',
          },
        
          sentBy: msg.sentBy,
          
          repliedAt: msg.repliedAt?.toISOString() ?? '??/??/??',
          replyMessage: msg.reply ?? null,
          replier: {
            name: msg.replier?.name ?? 'Desconhecido',
            role: msg.replier?.role ?? 'ADMIN',
          },
        })),
      },
    },


    seller: {
      id: product.seller.id,
      name: product.seller.name,
      role: product.seller.role,
    },
  }));
}

export const getUserProducts = async (
  userId: string
): Promise<BoughtProduct[]> => {
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



export const getUserProductsPutForSale = async (
  userId: string
): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: { 
      sellerId: userId,
      NOT: { status: 'DELETED' }
    },
    include: {
      seller: { select: { 
        id: true,
        name: true,
        role: true,
      }},
      reviews: { select: { rating: true } }, 
      adminActions: {
        where: { action: 'PRODUCT_REMOVED' },
        select: { justification: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      supportMessages: {
        where: { type: 'APPEAL' },
        include: {
          replier: { select: { 
            name: true, 
            role: true 
          }},
          sender: { select: { 
            name: true, 
            role: true 
          }}, 
        }
      },
      _count: {
        select: {
          orderItems: {
            where: { order: { status: 'APPROVED' } },
          },
        },
      },
    },
  });

  return products.map((product) => {

    const totalRatings = product.reviews.length;
    const sumRatings = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const average = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.toNumber(),
        stock: product.stock,
        reservedStock: product.reservedStock,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt?.toISOString() ?? null,
        updatedAt: product.updatedAt?.toISOString() ?? null,

        averageRating: average.toString(),
        salesCount: product._count.orderItems,

        status: product.status,
        
        removed: {
          by: product.removedBy,
          justify: product.adminActions[0]?.justification,
          at: product.removedAt?.toISOString(),
      
          supportMessages: product.supportMessages.map(msg => ({
            id: msg.id,
            sentAt: msg.createdAt.toISOString(),
            type: msg.type,
            subject: msg.subject,
            message: msg.message,
            sender: {
              name: msg.sender.name ?? 'Desconhecido',
              role: msg.sender.role ?? 'CUSTOMER',
            },
          
            sentBy: msg.sentBy,
            
            repliedAt: msg.repliedAt?.toISOString() ?? '??/??/??',
            replyMessage: msg.reply ?? null,
            replier: {
              name: msg.replier?.name ?? 'Desconhecido',
              role: msg.replier?.role ?? 'ADMIN',
            },
          })),
        },
      },


      seller: {
        id: product.seller.id,
        name: product.seller.name,
        role: product.seller.role,
      },
    };
  });
};