import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { addProductSchema } from "@/src/schemas/addProductSchema";
import { Category } from "@prisma/client";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request:Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  try {
    const body = await request.json();

    const data = addProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        imageUrl: data.imageUrl,
        name: data.name,
        category: data.category as Category,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        isActive: true,
        sellerId: user.id
      }
    });

    return NextResponse.json(product, { status: 201 })
  } catch (err:unknown) {
    return NextResponse.json(
      { message: "Erro ao criar produto: " + err },
      { status: 400 }
    )
  }
} 