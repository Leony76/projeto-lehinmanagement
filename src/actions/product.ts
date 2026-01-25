"use server"

import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { addProductSchema } from "@/src/schemas/addProductSchema";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

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


export async function removeProduct(id: number) {
  await prisma.product.update({
    where: { id },
    data: { isActive: false },
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
