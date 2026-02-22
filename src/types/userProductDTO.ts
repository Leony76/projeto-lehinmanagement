import { Category, DeletedBy, ProductStatus } from "@prisma/client";
import { ProductDTO } from "./productDTO";

// export type UserProductsPutToSaleDTO = {
//   product: ProductDTO;
// };

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
  publishedProducts: ProductDTO[];
};

export type FiltrableUserProduct = BoughtProduct | ProductDTO;
