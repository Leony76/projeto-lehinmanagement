import { Category } from "@prisma/client";
import { UserProductDTO } from "@/src/types/userProductDTO"; 
import { UserProductFilterValue } from "@/src/constants/generalConfigs";

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

    switch (advancedFilter) {
      case 'price_asc':
        return a.price - b.price;

      case 'price_desc':
        return b.price - a.price;

      case 'most_owned':
        return (b.orderedAmount ?? 0) - (a.orderedAmount ?? 0);

      case 'least_owned':
        return (a.orderedAmount ?? 0) - (b.orderedAmount ?? 0);

      case 'favorite':
        return (b.productAverageRating ?? 0) - (a.productAverageRating ?? 0);

      case 'least_favorite':
        return (a.productAverageRating ?? 0) - (b.productAverageRating ?? 0);

      default:
        return 0;
    }
  });
};
