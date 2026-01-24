import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").max(50, "O nome do produto não pode conter mais de 50 caractéres"),
  category: z.string().min(1, "O categoria é obrigatória").max(50, "A categoria não pode conter mais de 50 caractéres"),
  description: z.string().max(500, "A descrição não pode conter mais de 500 caractéres"),
  price: z.string().min(1, "O preço é obrigatório"),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;