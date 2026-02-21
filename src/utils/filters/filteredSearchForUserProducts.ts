import { UserProductFilterValue } from "@/src/constants/generalConfigs";
import { BoughtProduct, FiltrableUserProduct, UserProductsPutToSaleDTO } from "@/src/types/userProductDTO";
import { Category } from "@prisma/client";


export const filteredSearchForUserProducts = (
  items: FiltrableUserProduct[],
  search: string,
  advancedFilter: UserProductFilterValue | null,
  categoryFilter: Category | null,
): FiltrableUserProduct[] => {

  if (!items) return [];

  const filteredItems = items.filter(item => {

    const isPublished = 'product' in item;
    const productData = isPublished ? item.product : item;

    const matchesSearch = !search || 
      productData.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryFilter || 
      productData.category === categoryFilter;

    const matchesAdvancedFilter = (() => {
      if (!advancedFilter) return true;

      switch (advancedFilter) {
        case 'rated':
          if (!isPublished) return (item as BoughtProduct).hasReview;
          return (item as UserProductsPutToSaleDTO).product.AverageRating! > 0;

        case 'not_rated':
          if (!isPublished) return !(item as BoughtProduct).hasReview;
          return (item as UserProductsPutToSaleDTO).product.AverageRating === 0;
        
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
