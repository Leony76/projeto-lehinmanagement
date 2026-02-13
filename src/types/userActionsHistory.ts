import { AdminActionsHistory } from "./adminActionsHistory";
import { HistoryItem } from "./historyItem";

export type UserActionsHistory = {
  type: HistoryItem;
  date: string;
  value: number;
  productName: string;
  unitsOrdered: number;
  orderId: number;
};

export type AdminActionHistory = {
  type: AdminActionsHistory;
  date: string;
  username?: string | null;
  productName?: string | null;
  justification: string;
};