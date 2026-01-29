import { Category, OrderStatus, PaymentStatus } from "@prisma/client";
// import { OrderStatus } from "../constants/generalConfigs";

export type UserOrderDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;

  orderId: number;
  orderTotalPrice: number;
  orderDate: string | null;
  orderAmount: number;
  orderPaymentStatus: OrderStatus;
  orderStatus: PaymentStatus;
  orderRejectionJustify: string | null;
  orderRejectedBy: string | null;
};

