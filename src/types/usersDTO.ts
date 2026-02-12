import { OrderStatus, Role } from "@prisma/client";

export type UsersDTO = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
  isActive: boolean;
  
  stats: {
    ordersDone: number;
    salesDone: number;
  };

  history: {
    type: OrderStatus;
    date: string;
    value: number;
    productName: string;
    unitsOrdered: number;
    orderId: number;
  }[];
}