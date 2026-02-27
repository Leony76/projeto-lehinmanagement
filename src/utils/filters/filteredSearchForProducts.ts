import { Category } from "@prisma/client";
import { ProductFilterValue } from "../../constants/generalConfigs";
import { ProductDTO } from "@/src/types/productDTO";

export const filteredSearchForProducts = (
  items: ProductDTO[],
  search: string,
  advancedFilter: ProductFilterValue | null,
  categoryFilter: Category | null,
  showRemoved: boolean = false, 
) => {
  const searchLower = search.toLowerCase();

  const filteredProducts = items.filter((item) => {
    const isRemoved = !!item.product.removed.at;
    if (!showRemoved && isRemoved) return false;

    const matchesSearch = search 
      ? item.product.name.toLowerCase().includes(searchLower) 
      : true;

    const matchesCategory = categoryFilter 
      ? item.product.category === categoryFilter 
      : true;

    return matchesSearch && matchesCategory;
  });

  return [...filteredProducts].sort((a, b) => {
    if (!advancedFilter) return 0;

    const pA = a.product;
    const pB = b.product;

    switch (advancedFilter) {
      case "price_asc":
        return pA.price - pB.price;
      case "price_desc":
        return pB.price - pA.price;
      case "rating_asc":
        return Number(pA.averageRating ?? 0) - Number(pB.averageRating ?? 0);
      case "rating_desc":
        return Number(pB.averageRating ?? 0) - Number(pA.averageRating ?? 0);
      case "best_sellers":
        return (pB.salesCount ?? 0) - (pA.salesCount ?? 0);
      case "worst_sellers":
        return (pA.salesCount ?? 0) - (pB.salesCount ?? 0);
      default:
        return 0;
    }
  });
};