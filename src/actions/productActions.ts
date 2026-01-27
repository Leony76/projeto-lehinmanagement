"use server"

import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { addProductSchema } from "@/src/schemas/addProductSchema";
import { Category, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { OrderStatus, PaymentOptionsValue, PaymentStatus } from "../constants/generalConfigs";
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


export async function removeProduct(id: number, removeJustify: string) {
  await prisma.product.update({
    where: { id },
    data: { 
      isActive: false,
      removeJustify
    },
  });

  revalidatePath('/products');
}

export async function updateProduct(input: unknown) {
  const data = addProductSchema.parse(input)

  const updatedProduct = await prisma.product.update({
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

  return updatedProduct;
}

export async function orderProduct(
  productId: number, 
  totalOrderPrice: number,
  amountTobeOrdered: number,
  paymentStatus?: Status,
  paymentMethod?: PaymentOptionsValue,
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

    if (paymentStatus && paymentMethod) {
      await tx.payment.create({
        data: {
          amount: totalOrderPrice,
          method: paymentMethod,
          orderId: order.id,
          status: paymentStatus
        }
      });
    }
  });
  
  revalidatePath("/products");
}

export async function acceptRejectProductOrder(
  decision: 'APPROVED' | 'REJECTED',
  orderId: number,
) { 
  const session = await getRequiredSession();

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: decision,
      orderHistory: {
        create: {
          status: decision,
          changedById: session.user.id,
        }
      }
    }
  });

  revalidatePath("/orders");
}

