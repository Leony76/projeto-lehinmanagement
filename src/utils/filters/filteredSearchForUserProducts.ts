import { UserProductFilterValue } from "@/src/constants/generalConfigs";
import { BoughtProduct, FiltrableUserProduct } from "@/src/types/userProductDTO";
import { Category } from "@prisma/client";
import { ProductDTO } from "@/src/types/productDTO";

const isBoughtProduct = (
  item: BoughtProduct | ProductDTO
): item is BoughtProduct => {
  return 'hasReview' in item;
};

export const filteredSearchForUserProducts = (
  items: FiltrableUserProduct[],
  search: string,
  advancedFilter: UserProductFilterValue | null,
  categoryFilter: Category | null,
): FiltrableUserProduct[] => {

  if (!items?.length) return [];

  const filteredItems = items.filter(item => {

    const productData = isBoughtProduct(item)
      ? item
      : item.product;

    const matchesSearch =
      !search ||
      productData.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !categoryFilter || productData.category === categoryFilter;

    const matchesAdvancedFilter = (() => {
      if (!advancedFilter) return true;

      switch (advancedFilter) {
        case 'rated':
          if (isBoughtProduct(item)) {
            return item.hasReview;
          }
          return Number(item.product.averageRating ?? 0) > 0;

        case 'not_rated':
          if (isBoughtProduct(item)) {
            return !item.hasReview;
          }
          return Number(item.product.averageRating ?? 0) === 0;

        case 'price_asc':
        case 'price_desc':
        case 'favorite':
        case 'least_favorite':
          return true;

        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesAdvancedFilter;
  });

  return [...filteredItems].sort((a, b) => {
    if (!advancedFilter) return 0;

    const aProduct = isBoughtProduct(a) ? a : a.product;
    const bProduct = isBoughtProduct(b) ? b : b.product;

    const aRating = Number(
      isBoughtProduct(a)
        ? a.productAverageRating ?? 0
        : a.product.averageRating ?? 0
    );

    const bRating = Number(
      isBoughtProduct(b)
        ? b.productAverageRating ?? 0
        : b.product.averageRating ?? 0
    );

    switch (advancedFilter) {
      case 'price_asc':
        return aProduct.price - bProduct.price;

      case 'price_desc':
        return bProduct.price - aProduct.price;

      case 'favorite':
        return bRating - aRating;

      case 'least_favorite':
        return aRating - bRating;

      default:
        return 0;
    }
  });
};
