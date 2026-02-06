import { Category } from "@prisma/client";

export type UserProductDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;

  orders: {
    id: number;
    total: number;
    acceptedAt: string | null;
    items: {
      productId: number;
      quantity: number;
      price: number;
    }[];
  }[];

  productRating: number;
  hasReview: boolean;
  productAverageRating: string | null;
};
