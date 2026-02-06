import { Category, OrderStatus, PaymentStatus } from "@prisma/client";
import { UserProductsWithOrdersDTO } from "@/src/types/UserProductsWithOrdersDTO";

export const filteredSearchForUserOrders = (
  items: UserProductsWithOrdersDTO[],
  search: string,
  categoryFilter: Category | null,
): UserProductsWithOrdersDTO[] => {
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

