import { Category, DeletedBy, ProductStatus, Role } from "@prisma/client";
import { UserAndSupportConversationDTO } from "./UserAndSupportConversationDTO";

export type ProductDTO = {
  product: {
    id: number;
    name: string;
    category: Category;
    description: string | null;
    price: number;
    stock: number;
    reservedStock: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string | null;
    
    averageRating: string | null,
    salesCount: number | null,

    status: ProductStatus;
    
    removed: {
      at: string | undefined;
      justify: string | undefined;
      by: DeletedBy | null;
  
      supportMessages: UserAndSupportConversationDTO[];
    };
  };


  seller: {
    id: string;
    name: string | null;
    role: string | null;
  };
};


