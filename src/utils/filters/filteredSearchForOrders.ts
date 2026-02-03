import { Category } from "@prisma/client";
import { ProductWithOrdersDTO } from "@/src/types/ProductWithOrdersDTO";

export const filteredSearchForOrders = (
  items: ProductWithOrdersDTO[],
  search: string,
  categoryFilter: Category | null,
): ProductWithOrdersDTO[] => {
  return items.filter(item => {
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = categoryFilter
      ? item.category === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });
};
