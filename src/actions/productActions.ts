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
  const user = (await getRequiredSession()).user;

  if (user.role === 'ADMIN') {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: { 
          isActive: false,
        },
      });

      await tx.productChangeHistory.create({
        data: {
          action: 'DELETED',
          justification: removeJustify ?? '',
          adminId: user.id,
          productId: id, 
        }
      });

      await tx.adminActionHistory.create({
        data: {
          action: 'PRODUCT_REMOVED',
          actorId: user.id,
          targetProductId: id,
        }
      });
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

export async function updateProduct(input: unknown, justify?: string) {
  const session = await getRequiredSession();
  const user = session.user;
  const validatedData = addProductSchema.parse(input);

  const existingProduct = await prisma.product.findUnique({
    where: { id: validatedData.id }
  });

  if (!existingProduct) throw new Error("Produto não encontrado");
  
  if (user.role !== 'ADMIN' && existingProduct.sellerId !== user.id) {
    throw new Error("Acesso negado");
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        imageUrl: validatedData.imageUrl,
      }
    });

    if (user.role === 'ADMIN') {
      if (!justify?.trim()) throw new Error("Justificativa obrigatória para admins");

      await tx.productChangeHistory.create({
        data: {
          action: 'EDITED',
          justification: justify,
          adminId: user.id,
          productId: validatedData.id!,
        }
      });

      await tx.adminActionHistory.create({
        data: {
          action: 'PRODUCT_EDITED',
          actorId: user.id,
          targetProductId: validatedData.id!,
        }
      });
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
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    const available = product.stock - product.reservedStock;

    if (available < amountTobeOrdered) {
      throw new Error("Estoque indisponível");
    }

    const updated = await tx.product.updateMany({
      where: {
        id: productId,
        reservedStock: product.reservedStock,
      },
      data: {
        reservedStock: {
          increment: amountTobeOrdered,
        },
      },
    });

    if (updated.count === 0) {
      throw new Error("Estoque acabou, tente novamente");
    }

    const order = await tx.order.create({
      data: {
        userId: session.user.id,
        total: totalOrderPrice,
        status: "PENDING",
        reservedUntil: new Date(Date.now() + 30 * 60 * 1000), // opcional
        orderItems: {
          create: {
            price: totalOrderPrice,
            quantity: amountTobeOrdered,
            productId,
          },
        },
        orderHistory: {
          create: {
            status: "PENDING",
            changedById: session.user.id,
          },
        },
      },
    });

    if (paymentMethod) {
      await tx.payment.create({
        data: {
          amount: totalOrderPrice,
          method: paymentMethod,
          orderId: order.id,
          status: "APPROVED",
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

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Pedido já processado');
    }

    if (decision === 'APPROVED') {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'APPROVED',
          reservedUntil: null,
          orderHistory: {
            create: {
              status: 'APPROVED',
              changedById: session.user.id,
            },
          },
        },
      });

      await tx.costumerProduct.create({
        data: {
          costumerId: order.userId,
          costumerProductId: productId,  
          orderId,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: orderedAmount,
          },
          reservedStock: {
            decrement: orderedAmount,
          },
        },
      });
    } else {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'REJECTED',
          reservedUntil: null,
          orderHistory: {
            create: {
              status: 'REJECTED',
              changedById: session.user.id,
              rejectionJustify: cleanJustify,
            },
          },
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          reservedStock: {
            decrement: orderedAmount,
          },
        },
      });
    }
  });

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
