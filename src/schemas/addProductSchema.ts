import { z } from "zod";
import { Category } from "@prisma/client";

export const addProductSchema = z.object({
  id: z.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  name: z.string().min(1, "O nome é obrigatório").max(50, "O nome do produto não pode conter mais de 50 caractéres"),
  category: z.nativeEnum(Category, 'A categoria é obrigatória'),
  description: z.string().max(500, "A descrição não pode conter mais de 500 caractéres").optional(),
  price: z.coerce.number().positive("O preço deve ser um número superior a 0"),
  stock: z.coerce.number().positive("O estoque deve ser um número superior a 0"),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;