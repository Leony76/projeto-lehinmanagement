"use server"

import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { addProductSchema } from "@/src/schemas/addProductSchema";
import { Category, OrderStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { PaymentOptionsValue } from "../constants/generalConfigs";
import { getRequiredSession } from "../lib/get-session-user";

export async function createProduct(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const data = addProductSchema.parse(input)

  if (!session) {
    throw new Error("Não autenticado");
  } if (!data.imageUrl) {
    throw new Error("Imagem do produto é requirível");
  }

  await prisma.product.create({
    data: {
      imageUrl: data.imageUrl,
      name: data.name,
      category: data.category as Category,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      isActive: true,
      sellerId: session.user.id,
    },
  })

  revalidatePath("/products")
};


export async function removeProduct(
  id: number, 
  removeJustify?: string
) {
  if (removeJustify?.trim() !== '') {
    await prisma.product.update({
      where: { id },
      data: { 
        isActive: false,
        removeJustify
      },
    });

    revalidatePath('/products');
  } else {
    const session = await getRequiredSession();

    await prisma.costumerProduct.updateMany({
      where: {
        costumerProductId: id,
        costumerId: session.user.id,
      },
      data: {
        deletedAt: new Date(),
      }
    });

    revalidatePath('/products/my-products');
  }
}

export async function updateProduct(input: unknown) {
  const data = addProductSchema.parse(input)

  await prisma.product.update({
    where: { id: data.id! },
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
    }
  });

  revalidatePath("/products");
}

export async function orderProduct(
  productId: number, 
  totalOrderPrice: number,
  amountTobeOrdered: number,
  paymentMethod: PaymentOptionsValue | null,
) {
  const session = await getRequiredSession();

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: session.user.id,
        total: totalOrderPrice,
        status: 'PENDING',
        orderItems: {
          create: {
            price: totalOrderPrice,
            quantity: amountTobeOrdered,
            productId
          }
        },
        orderHistory: {
          create: {
            status: 'PENDING',
            changedById: session.user.id
          }
        }
      }
    });

    if (paymentMethod) {
      await tx.payment.create({
        data: {
          amount: totalOrderPrice,
          method: paymentMethod,
          orderId: order.id,
          status: 'APPROVED'
        },
      });
    }
  });
  
  revalidatePath("/products");
}

export async function acceptRejectProductOrder(
  decision: 'APPROVED' | 'REJECTED',
  orderId: number,
  productId: number,
  orderedAmount: number,
  rejectionJustify?: string,
) { 
  const session = await getRequiredSession();

  const cleanJustify = rejectionJustify?.trim() || null;

  if (decision === 'APPROVED') {
    await prisma.$transaction(async(tx) => {
      const order = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'APPROVED',
          orderHistory: {
            create: {
              status: 'APPROVED',
              changedById: session.user.id,
            }
          },
        }
      });
  
      await tx.costumerProduct.create({
        data: {
          costumerId: order.userId,
          costumerProductId: productId,  
          orderId   
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: orderedAmount
          },
        },
      });
    })
  } else {  
    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: 'REJECTED',
        orderHistory: {
          create: {
            status: 'REJECTED',
            changedById: session.user.id,
            rejectionJustify: cleanJustify
          }
        }
      }
    })
  }
  
  revalidatePath("/orders");
}

export async function payForPeddingOrderPayment(
  paymentMethod: PaymentOptionsValue,
  amountPaid: number,
  orderId: number,
) {
  await prisma.payment.create({
    data: {
      amount: amountPaid,
      method: paymentMethod,
      orderId: orderId,
      status: 'APPROVED',
    }
  });

  revalidatePath("/orders/my-orders");
}

export async function removeOrderFromUserOrders(
  orderId: number,
  orderStats: OrderStatus,
  userRole: Role,
  canceled?: boolean,
) {
  const session = await getRequiredSession();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order) throw new Error("Pedido não encontrado");

    if (canceled) {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELED',
          orderHistory: {
            create: {
              status: 'CANCELED',
              changedById: session.user.id,
            }
          }
        }
      });
      return;
    }

    const deleteData =
      userRole === 'CUSTOMER'
        ? { deletedByCustomerAt: now }
        : { deletedBySellerAt: now };

    await tx.order.update({
      where: { id: orderId },
      data: {
        ...deleteData,
        orderHistory: {
          create: {
            status: orderStats,
            changedById: session.user.id,
            deletedById: session.user.id,
          }
        }
      }
    });
  });

  revalidatePath("/orders/my-orders");
}


export async function editOrderRejectionJustify(
  newRejection: string,
  orderId: number,
) {
  const session = await getRequiredSession();

  await prisma.orderHistory.create({
    data: {
      status: 'REJECTED',
      changedById: session.user.id,
      rejectionJustify: newRejection,
      orderId
    },
  });

  revalidatePath("/orders");  
}

export async function rateCommentProduct(
  productId: number,
  rate: number,
  comment?: string,
): Promise<void> {
  const session = await getRequiredSession();
  
  const commentSent = comment !== undefined && comment?.trim() !== '';

  await prisma.productReview.upsert({
    where: {
      productId_userId: {
        productId,
        userId: session.user.id,
      },
    },
    update: {
      rating: rate,
      ...(commentSent && { comment })
    },
    create: {
      productId,
      ...(commentSent && { comment }),
      userId: session.user.id,
      rating: rate,
    },
  });

  revalidatePath("/products/my-products");
}

export async function sendMessageAboutCustomerOrderSituation(
  orderId: number,
  orderStatus: OrderStatus,
  message: string,
): Promise<void> {
  const session = await getRequiredSession();

  await prisma.orderHistory.create({
    data: {
      orderId,
      changedById: session.user.id,
      status: orderStatus,
      message,
    }
  });

  revalidatePath("/orders");
}

export async function updatedProductStock(
  productId: number,
  newStock: number,
) {
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      stock: {
        increment: newStock,
      },
    },
  });

  revalidatePath('/orders');
}
