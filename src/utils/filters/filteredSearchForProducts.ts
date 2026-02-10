import { Category } from "@prisma/client";
import { ProductFilterValue } from "../../constants/generalConfigs";
import { ProductDTO } from "@/src/types/productDTO";

export const filteredSearchForProducts = (
  items: ProductDTO[],
  search: string,
  advancedFilter: ProductFilterValue | null,
  categoryFilter: Category | null,
) => {
  const filteredProducts = items
    .filter(item =>
      search
        ? item.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter(item =>
      categoryFilter
        ? item.category === categoryFilter
        : true
    );

  const sortedItems = [...filteredProducts].sort((a, b) => {
    if (!advancedFilter) return 0;

    switch (advancedFilter) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating_asc":
        return (Number(a.productAverageRating) ?? 0) - (Number(b.productAverageRating) ?? 0);
      case "rating_desc":
        return (Number(b.productAverageRating) ?? 0) - (Number(a.productAverageRating) ?? 0);
      case "best_sellers":
        return (b.productSalesCount ?? 0) - (a.productSalesCount ?? 0);
      case "worst_sellers":
        return (a.productSalesCount ?? 0) - (b.productSalesCount ?? 0);
      default:
        return 0;
    }
  });

  return sortedItems ;
}