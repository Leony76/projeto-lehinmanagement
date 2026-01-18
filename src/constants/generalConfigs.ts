export type InputTypes = 'text' | 'number' | 'email' | 'password';

export type ColorScheme = 'primary' | 'secondary';

export const FILTER_OPTIONS = [
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'best_sellers', label: 'Mais Vendidos' },
  { value: 'worst_sellers', label: 'Menos Vendidos' },
  { value: 'rating_desc', label: 'Mais bem avaliado' },
  { value: 'rating_asc', label: 'Menos bem avaliado' },
] as const;

export type FilterValue = typeof FILTER_OPTIONS[number]['value'];

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

export type CategoryValue = typeof CATEGORY_OPTIONS[number]['value'];
export type CategoryTranslatedValue = typeof CATEGORY_OPTIONS[number]['label'];

