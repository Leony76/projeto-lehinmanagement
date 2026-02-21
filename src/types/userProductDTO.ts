import { Category, DeletedBy } from "@prisma/client";
import { UserAndSupportConversationDTO } from "./UserAndSupportConversationDTO";

export type UserProductsPutToSaleDTO = {
  product: {
    id: number;
  
    name: string;
    category: Category;
    description: string | null;
    publishedAt: string;
    updatedAt: string | null;
    AverageRating: number | null;

    isActive: boolean;
    removeJustify: string | undefined;
    removedAt: string | undefined;
    removedBy: DeletedBy | null;
    supportMessages: UserAndSupportConversationDTO[];

    stock: number;
    price: number;

    imageUrl: string;

    soldUnits: number;

  };
  seller: {
    name: string;
  };
};

export type BoughtProduct = {
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
}

export type UserProductDTO = {
  role: 'CUSTOMER',

  boughtProduct: BoughtProduct;
} | {
  role: 'SELLER',

  boughtProducts: BoughtProduct[];
  publishedProducts: UserProductsPutToSaleDTO[];
};

export type FiltrableUserProduct = BoughtProduct | UserProductsPutToSaleDTO;
