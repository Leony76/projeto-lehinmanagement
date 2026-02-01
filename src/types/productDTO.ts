import { Category } from "@prisma/client";

export type ProductDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  sellerId: string;
  sellerName: string | null;
  sellerRole: string | null;
  productAverageRating: string | null,
  productSalesCount: number | null,
};


