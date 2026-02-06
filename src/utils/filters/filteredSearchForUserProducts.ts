import { UserProductFilterValue } from "@/src/constants/generalConfigs";
import { UserProductDTO } from "@/src/types/userProductDTO";
import { Category } from "@prisma/client";
import { getTotalOrderedAmount } from "../geTotalOrderAmount";

export const filteredSearchForUserProducts = (
  items: UserProductDTO[],
  search: string,
  advancedFilter: UserProductFilterValue | null,
  categoryFilter: Category | null,
): UserProductDTO[] => {

  const filteredItems = items.filter(item => {
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = categoryFilter
      ? item.category === categoryFilter
      : true;

    const matchesAdvancedFilter = (() => {
      if (!advancedFilter) return true;

      switch (advancedFilter) {
        case 'rated':
          return item.hasReview;

        case 'not_rated':
          return !item.hasReview;

        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesAdvancedFilter;
  });

  return [...filteredItems].sort((a, b) => {
    if (!advancedFilter) return 0;

    const aTotalOrdered = getTotalOrderedAmount(a);
    const bTotalOrdered = getTotalOrderedAmount(b);

    switch (advancedFilter) {
      case 'price_asc':
        return a.price - b.price;

      case 'price_desc':
        return b.price - a.price;

      case 'most_owned':
        return bTotalOrdered - aTotalOrdered;

      case 'least_owned':
        return aTotalOrdered - bTotalOrdered;

      case 'favorite':
        return Number(b.productAverageRating ?? 0) - Number(a.productAverageRating ?? 0);

      case 'least_favorite':
        return Number(a.productAverageRating ?? 0) - Number(b.productAverageRating ?? 0);

      default:
        return 0;
    }
  });
};
