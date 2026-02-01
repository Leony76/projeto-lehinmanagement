import { Category, OrderStatus, PaymentStatus } from "@prisma/client";

export type UserOrderDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  sellerName: string;
  messageSentAt: string | null;
  productAverageRating: string | null;

  orderId: number;
  orderTotalPrice: number;
  orderDate: string | null;
  orderAmount: number;
  orderPaymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderRejectionJustify: string | null;
  orderRejectedBy: string | null;
  orderSituationMessage: string | null;
};

