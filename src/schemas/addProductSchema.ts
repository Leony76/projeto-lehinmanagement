import { z } from "zod";
import { Category } from "@prisma/client";

export const addProductSchema = z.object({
  imageUrl: z.string().url().optional(),
  name: z.string().min(1, "O nome é obrigatório").max(50, "O nome do produto não pode conter mais de 50 caractéres"),
  category: z.nativeEnum(Category, 'A categoria é obrigatória'),
  description: z.string().max(500, "A descrição não pode conter mais de 500 caractéres").optional(),
  price: z.string().min(1, "O preço é obrigatório"),
  stock: z.string().min(1, "O estoque é obrigatório"),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;