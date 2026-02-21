import { Category, DeletedBy, Role } from "@prisma/client";
import { UserAndSupportConversationDTO } from "./UserAndSupportConversationDTO";

export type ProductDTO = {
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

  isActive: boolean;
  removeJustify: string | undefined;
  removedAt: string | undefined;
  removedBy: DeletedBy | null;
  supportMessages: UserAndSupportConversationDTO[];

  sellerId: string;
  sellerName: string | null;
  sellerRole: string | null;
  productAverageRating: string | null,
  productSalesCount: number | null,
};


