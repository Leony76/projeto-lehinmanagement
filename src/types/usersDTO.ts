import { Role } from "@prisma/client";
import { HistoryItem } from "./historyItem";
import { UserActionsHistory } from "./userActionsHistory";

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

  history: UserActionsHistory[];
}