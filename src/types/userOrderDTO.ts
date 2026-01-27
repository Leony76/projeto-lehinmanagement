import { Category } from "@prisma/client";
import { OrderStatus } from "../constants/generalConfigs";

export type UserOrderDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;

  orderTotalPrice: number;
  orderDate: string | null;
  orderAmount: number;
  orderPaymentStatus: OrderStatus;
};

