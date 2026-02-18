import { Category, OrderStatus } from "@prisma/client";
import { PaymentStatus } from "../constants/generalConfigs";

export type ProductWithOrdersDTO = {
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
    orderCreatedAt: string;
    orderedAmount: number;
    orderComission: number;
    orderCustomerName: string | null;
    orderStatus: OrderStatus;
    orderPaymentStatus: PaymentStatus | 'PENDING';
    orderDeletedByCustomer: boolean;
    orderRejectionJustify: string | null;
  }[];
};
