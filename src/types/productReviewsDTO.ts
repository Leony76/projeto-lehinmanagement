import { Role } from "@prisma/client";

export type ProductReviewsDTO = {
  productId: number;

  comment: {
    id: number;
    text: string | null;
    at: string;
  };

  rating: {
    rate: number;
  };

  reviewer: {
    id: string;
    name: string;
    profileImage: string | null;
    role: Role;
  };
}