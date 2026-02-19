import { UserProductFilterValue } from "@/src/constants/generalConfigs";
import { FiltrableUserProduct } from "@/src/types/userProductDTO";
import { Category } from "@prisma/client";


export const filteredSearchForUserProducts = (
  items: FiltrableUserProduct[],
  search: string,
  advancedFilter: UserProductFilterValue | null,
  categoryFilter: Category | null,
): FiltrableUserProduct[] => {

  const filteredItems = items.filter(item => {

    const productData = 'product' in item 
      ? item.product 
      : item
    ;

    const matchesSearch = search
      ? productData.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = categoryFilter
      ? productData.category === categoryFilter
      : true;

    const matchesAdvancedFilter = (() => {
      if (!advancedFilter) return true;

      switch (advancedFilter) {
        case 'rated':
          return 'hasReview' in item ? item.hasReview : false;

        case 'not_rated':
          return 'hasReview' in item ? !item.hasReview : false;

        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesAdvancedFilter;
  });

  return [...filteredItems].sort((a, b) => {
    if (!advancedFilter) return 0;

    const aData = 'product' in a 
      ? a.product 
      : a
    ;
    const bData = 'product' in b 
      ? b.product 
      : b
    ;

    const aRating = Number('product' in a 
      ? a.product.AverageRating 
      : a.productAverageRating ?? 0
    );
    const bRating = Number('product' in b 
      ? b.product.AverageRating 
      : b.productAverageRating ?? 0
    );

    switch (advancedFilter) {
      case 'price_asc':
        return aData.price - bData.price;

      case 'price_desc':
        return bData.price - aData.price;

      case 'favorite':
        return bRating - aRating;

      case 'least_favorite':
        return aRating - bRating;

      default:
        return 0;
    }
  });
};
