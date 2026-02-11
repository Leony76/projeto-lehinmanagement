import { Category, OrderStatus } from "@prisma/client";
import { PaymentStatus } from "../constants/generalConfigs";

export type UserProductsWithOrdersDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  imageUrl: string;
  stock: number;
  price: number;
  createdAt: string;
  productAverageRating: string | null;

  orders: {
    orderId: number;
    orderDate: string;
    orderedAmount: number;
    orderTotalPrice: number;
    orderStatus: OrderStatus;
    orderPaymentStatus: PaymentStatus;
    sellerName: string;
    messageSentAt: string | null;
    orderRejectionJustify: string | null;
    orderSituationMessage: string | null;
    orderRejectedBy: string | null | undefined;
  }[];
};

