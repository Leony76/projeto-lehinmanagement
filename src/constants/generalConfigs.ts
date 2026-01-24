import { Category } from "@prisma/client";

export type InputTypes = 'text' | 'number' | 'email' | 'password';
export type ToastType = "success" | "error" | "alert" | "info";
export type ColorScheme = 'primary' | 'secondary' | 'red';
export type SystemRoles = "ADMIN" | "CUSTOMER" | "SELLER";
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
export type Buttontype = 'submit' | 'button';

export const ROLE_LABEL: Record<SystemRoles, string> = {
  CUSTOMER: 'Cliente',
  SELLER: 'Vendedor(a)',
  ADMIN: 'Administrador(a)',
}

export const FILTER_OPTIONS = [
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'best_sellers', label: 'Mais Vendidos' },
  { value: 'worst_sellers', label: 'Menos Vendidos' },
  { value: 'rating_desc', label: 'Mais bem avaliado' },
  { value: 'rating_asc', label: 'Menos bem avaliado' },
] as const;

export const PAYMENT_OPTIONS = [
  { value: 'pix' , label: 'Pix'},
  { value: 'credit_card' , label: 'Cartão de crédito'},
  { value: 'debit_card' , label: 'Cartão de débito'},
  { value: 'bank_slip' , label: 'Boleto bancário'},
] as const;

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

export type PaymentOptions = typeof PAYMENT_OPTIONS[number]['label']
export type CategoryValue = typeof CATEGORY_OPTIONS[number]['value'];
export type CategoryTranslatedValue = typeof CATEGORY_OPTIONS[number]['label'];
export type FilterValue = typeof FILTER_OPTIONS[number]['value'];

