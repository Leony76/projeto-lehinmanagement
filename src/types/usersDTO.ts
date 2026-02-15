import { SupportMessageType } from "@prisma/client";

export type AdminHistoryTag = 
| 'Edição' 
| 'Remoção' 
| 'Desativação' 
| 'Ativação'
;

export type SellerHistoryTag = 
| 'Pedido' 
| 'Venda' 
| 'Pedido negado' 
| 'Pedido aceito' 
| 'Pedido cancelado'
;

export type CustomerHistoryTag = 
| 'Pedido' 
;

export type UserSupportMessage = {
  id: number;
  sentDate: string;
  type: SupportMessageType;
  subject: string | null;
  message: string;
}

export type CustomerActionHistory = {
  type: CustomerHistoryTag;
  date: string;
  value: number;
  productName: string;
  unitsOrdered: number;
  orderId: number;
};

export type SellerActionHistory = {
  type: SellerHistoryTag;
  date: string;
  value: number;
  productName: string | null;
  unitsOrdered: number;
  orderId: number;
}

export type AdminActionHistory = {
  target: 'USER';
  type: 'Desativação' | 'Ativação';
  date: string;
  username: string | null;
  justification: string;
} | {
  target: 'PRODUCT';
  type: 'Edição' | 'Remoção';
  date: string;
  productName: string | null;
  justification: string;
};

type BaseProps = {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export type UsersDTO = | (BaseProps & {
  role: 'SELLER';
  stats: {
    ordersDone: number;
    salesDone: number;
  };

  messages: UserSupportMessage[];
  history: SellerActionHistory[];
}) | (BaseProps & {
  role: 'CUSTOMER';
  ordersDone: number;

  messages: UserSupportMessage[];
  history: CustomerActionHistory[];
}) | (BaseProps & {
  role: 'ADMIN';
  
  history: AdminActionHistory[];
})

export type CustomerDTO = Extract<UsersDTO, { role: 'CUSTOMER' }>;
export type SellerDTO   = Extract<UsersDTO, { role: 'SELLER' }>;
export type AdminDTO    = Extract<UsersDTO, { role: 'ADMIN' }>;

export function isCustomerAction(
  item: SellerActionHistory | CustomerActionHistory | AdminActionHistory
): item is CustomerActionHistory {
  return 'orderId' in item;
}

export function isSellerAction(
  item: SellerActionHistory | CustomerActionHistory | AdminActionHistory
): item is SellerActionHistory {
  return 'unitsOrdered' in item && 'value' in item;
}

export function isAdminAction(
  item: SellerActionHistory | CustomerActionHistory | AdminActionHistory
): item is AdminActionHistory {
  return 'target' in item;
}
