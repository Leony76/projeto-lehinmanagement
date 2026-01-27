import { Category } from "@prisma/client";
import { OrderStatus } from "../constants/generalConfigs";

export type OrderProductDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;

  orderId: number;
  orderCreatedAt: string;
  orderedAmount: number;
  orderComission: number;
  orderCustomerName: string | null;
  orderStatus: OrderStatus;
  orderPaymentStatus: OrderStatus;
};