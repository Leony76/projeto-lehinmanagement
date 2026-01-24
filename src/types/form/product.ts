import { Category } from "@prisma/client";

export type ProductDTO = {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
};


