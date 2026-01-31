import { Category, DeletedBy, OrderStatus } from "@prisma/client";

export type OrderProductDTO = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  productAverageRating: string | null;

  orderId: number;
  orderCreatedAt: string;
  orderedAmount: number;
  orderComission: number;
  orderCustomerName: string | null;
  orderPaymentStatus: OrderStatus;
  orderStatus: OrderStatus;
  orderDeletedByCustomer: DeletedBy;
  orderRejectionJustify: string | null;
};