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

  orderedAmount: number | null;
  orderTotalPrice: number;
  orderAcceptedAt: string | null;
  productRating: number;
  hasReview: boolean;
  productAverageRating: number | null;
};

