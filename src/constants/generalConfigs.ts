export type InputTypes = 'text' | 'number' | 'email' | 'password';
export type ToastType = "success" | "error" | "alert" | "info";
export type ColorScheme = 'primary' | 'secondary' | 'red';
export type SystemRoles = "ADMIN" | "CUSTOMER" | "SELLER";
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

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
  { value: 'toys', label: 'Brinquedo' },
  { value: 'clothing', label: 'Vestuário' },
  { value: 'electronics', label: 'Eletrônico' },
  { value: 'hygiene', label: 'Higiene' },
  { value: 'cosmetics', label: 'Cosmético' },
  { value: 'appliances', label: 'Eletrodoméstico' },
  { value: 'sports', label: 'Esporte' },
  { value: 'decor', label: 'Decoração' },
  { value: 'cleaning', label: 'Limpeza' },
  { value: 'kitchen', label: 'Cozinha' },
  { value: 'handmade', label: 'Artesanal' },
] as const;

export type PaymentOptions = typeof PAYMENT_OPTIONS[number]['label']
export type CategoryValue = typeof CATEGORY_OPTIONS[number]['value'];
export type CategoryTranslatedValue = typeof CATEGORY_OPTIONS[number]['label'];
export type FilterValue = typeof FILTER_OPTIONS[number]['value'];

