import { Category } from "@prisma/client";
import { number } from "zod";

export type InputTypes = 'text' | 'number' | 'email' | 'password';
export type ToastType = "success" | "error" | "alert" | "info";
export type ColorScheme = 'primary' | 'secondary' | 'red';
export type SystemRoles = "ADMIN" | "CUSTOMER" | "SELLER";
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
export type Buttontype = 'submit' | 'button';
export type PaymentOptionsValue = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_SLIP';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'DENIED';
export type SelectFilterOptions =   
| "PRODUCT_FILTER" 
| "USER_PRODUCT_FILTER" 
| "USER_PRODUCT_ORDERS_FILTER"
| "ORDER_FILTER" 
| "USER_ORDER_FILTER" 
| "CATEGORY" 
| "PAYMENT"
| "USERS_ROLE"
| "USERS_FILTER"
;

export const ROLE_LABEL: Record<SystemRoles, string> = {
  CUSTOMER: 'Cliente',
  SELLER: 'Vendedor(a)',
  ADMIN: 'Administrador(a)',
}

export const USER_ROLE_FILTER_OPTIONS = [
  { value: 'CUSTOMER', label: 'Cliente' },
  { value: 'SELLER', label: 'Vendedor(a)' },
  { value: 'ADMIN', label: 'Administrador(a)' },
] as const;

export type UserRoleFilterValue = typeof USER_ROLE_FILTER_OPTIONS[number]['value'];

export const USERS_FILTER_OPTIONS = [
  { value: 'more_sold', label: 'Mais vendas' },
  { value: 'least_sold', label: 'Menos vendas' },
  { value: 'more_orders_done', label: 'Mais pedidos feitos' },
  { value: 'least_orders_done', label: 'Menos pedidos feitos' },
  { value: 'actived_account', label: 'Ativos' },
  { value: 'deactived_account', label: 'Desativos' },
] as const;

export type UsersFilterValue = typeof USERS_FILTER_OPTIONS[number]['value'];

export const MESSAGE_TYPE_LABELS: Record<string, string> = {
  SUPPORT_QUESTION: 'Pergunta do suporte',
  QUESTION: 'Pergunta do usuário',
  APPEAL: 'Apelação',
  SUGGESTION: 'Sugestão',
  SUPPORT_ANSWER: 'Resposta do suporte',
};

export const PRODUCT_FILTER_OPTIONS = [
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'best_sellers', label: 'Mais Vendidos' },
  { value: 'worst_sellers', label: 'Menos Vendidos' },
  { value: 'rating_desc', label: 'Mais bem avaliado' },
  { value: 'rating_asc', label: 'Menos bem avaliado' },
] as const;

export const USER_PRODUCT_FILTER_OPTIONS = [
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'most_owned', label: 'Mais possui' },
  { value: 'least_owned', label: 'Menos possui' },
  { value: 'favorite', label: 'Favoritos' },
  { value: 'least_favorite', label: 'Menos favoritos' },
  { value: 'rated', label: 'Avaliados' },
  { value: 'not_rated', label: 'Não avaliados' },
] as const;

export const ORDER_FILTER_OPTIONS = [
  { value: 'value_desc', label: 'Maior valor' },
  { value: 'value_asc', label: 'Menor valor' },
  { value: 'most_sold', label: 'Mais pedido' },
  { value: 'least_sold', label: 'Menos pedido' },
  { value: 'analyzed', label: 'Analisados' },
  { value: 'not_analyzed', label: 'Não analizados' },
  { value: 'canceled_by_customer', label: 'Cancelados pelo cliente' },
  { value: 'pending_payment', label: 'Pagamento pendente' },
  { value: 'rejected', label: 'Rejeitados' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'paid', label: 'Pagos' },
] as const;

export const USER_ORDER_FILTER_OPTIONS = [
  { value: 'value_desc', label: 'Maior valor' },
  { value: 'value_asc', label: 'Menor valor' },
  { value: 'most_sold', label: 'Mais pedido' },
  { value: 'least_sold', label: 'Menos pedido' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'canceled_by_customer', label: 'Cancelados por você' },
  { value: 'pending_payment', label: 'Pagamento pendente' },
  { value: 'rejected', label: 'Rejeitados' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'paid', label: 'Pagos' },
] as const;

export const USER_PRODUCT_ORDERS_FILTER_OPTIONS = [
  { value: 'most_recent', label: 'Mais recente'},
  { value: 'least_recent', label: 'Menos antigo'},
  { value: 'most_valuable', label: 'Maior valor'},
  { value: 'least_valuable', label: 'Menor valor'},
  { value: 'most_units_ordered', label: 'Mais unidades pedidas'},
  { value: 'least_units_ordered', label: 'Menos unidades pedidas'},
] as const;

export type UserProductOrdersFilterValue = typeof USER_PRODUCT_ORDERS_FILTER_OPTIONS[number]['value']

export const PAYMENT_OPTIONS = [
  { value: 'PIX' , label: 'Pix'},
  { value: 'CREDIT_CARD' , label: 'Cartão de crédito'},
  { value: 'DEBIT_CARD' , label: 'Cartão de débito'},
  { value: 'BANK_SLIP' , label: 'Boleto bancário'},
] as const;

export type PaymentOptions = typeof PAYMENT_OPTIONS[number]['label']

export const CATEGORY_OPTIONS = [
  { value: 'TOY', label: 'Brinquedo' },
  { value: 'CLOTHING', label: 'Vestuário' },
  { value: 'ELECTRONIC', label: 'Eletrônico' },
  { value: 'HYGIENE', label: 'Higiene' },
  { value: 'COSMETIC', label: 'Cosmético' },
  { value: 'APPLIANCE', label: 'Eletrodoméstico' },
  { value: 'SPORT', label: 'Esporte' },
  { value: 'DECORATION', label: 'Decoração' },
  { value: 'CLEANING', label: 'Limpeza' },
  { value: 'KITCHEN', label: 'Cozinha' },
  { value: 'HANDMADE', label: 'Artesanal' },
] as const;

export const USER_PRODUCT_FILTER_LABEL_MAP: Record<
  UserProductFilterValue,
  string
> = {
  price_desc: 'Maior preço',
  price_asc: 'Menor preço',
  most_owned: 'Mais possui',
  least_owned: 'Menos possui',
  favorite: 'Favoritos',
  least_favorite: 'Menos favoritos',
  rated: 'Avaliados',
  not_rated: 'Não avaliados',
};

export type UserProductFilterValue = typeof USER_PRODUCT_FILTER_OPTIONS[number]['value'];

export const ORDER_FILTER_LABEL_MAP: Record<
  OrderFilterValue,
  string
> = {
  value_desc: 'Maior valor',
  value_asc: 'Menor valor',
  most_sold: 'Mais pedido',
  least_sold: 'Menos pedido',
  analyzed: 'Analisados',
  not_analyzed: 'Não analisados',
  canceled_by_customer: 'Cancelados pelo cliente',
  pending_payment: 'Pagamento pendente',
  rejected: 'Rejeitados',
  approved: 'Aprovados',
  paid: 'Pagos',
};

export type OrderFilterValue = typeof ORDER_FILTER_OPTIONS[number]['value'];

export const USER_ORDER_FILTER_LABEL_MAP: Record<
  UserOrderFilterValue,
  string
> = {
  value_desc: 'Maior valor',
  value_asc: 'Menor valor',
  most_sold: 'Mais pedido',
  least_sold: 'Menos pedido',
  pending: 'Pendentes',
  canceled_by_customer: 'Cancelados por você',
  pending_payment: 'Pagamento pendente',
  rejected: 'Rejeitados',
  approved: 'Aprovados',
  paid: 'Pagos',
};

export type UserOrderFilterValue = typeof USER_ORDER_FILTER_OPTIONS[number]['value'];

export const PRODUCT_FILTER_LABEL_MAP: Record<
  ProductFilterValue,
  | "Maior Preço"
  | "Menor Preço"
  | "Mais Vendidos"
  | "Menos Vendidos"
  | "Mais bem avaliado"
  | "Menos bem avaliado"
> = {
  price_desc: "Maior Preço",
  price_asc: "Menor Preço",
  best_sellers: "Mais Vendidos",
  worst_sellers: "Menos Vendidos",
  rating_desc: "Mais bem avaliado",
  rating_asc: "Menos bem avaliado",
};

export type ProductFilterValue = typeof PRODUCT_FILTER_OPTIONS[number]['value'];

export const CATEGORY_LABEL_MAP: Record<
  Category,
  | "Brinquedo"
  | "Vestuário"
  | "Eletrônico"
  | "Higiene"
  | "Cosmético"
  | "Eletrodoméstico"
  | "Esporte"
  | "Decoração"
  | "Limpeza"
  | "Cozinha"
  | "Artesanal"
> = {
  TOY: "Brinquedo",
  CLOTHING: "Vestuário",
  ELECTRONIC: "Eletrônico",
  HYGIENE: "Higiene",
  COSMETIC: "Cosmético",
  APPLIANCE: "Eletrodoméstico",
  SPORT: "Esporte",
  DECORATION: "Decoração",
  CLEANING: "Limpeza",
  KITCHEN: "Cozinha",
  HANDMADE: "Artesanal",
};

export type CategoryValue = typeof CATEGORY_OPTIONS[number]['value'];
export type CategoryTranslatedValue = typeof CATEGORY_OPTIONS[number]['label'];

