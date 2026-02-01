import { Category, OrderStatus, PaymentStatus } from "@prisma/client";
import { UserOrderDTO } from "@/src/types/userOrderDTO";
import { UserOrderFilterValue } from "@/src/constants/generalConfigs";

export const filteredSearchForUserOrders = (
  items: UserOrderDTO[],
  search: string,
  advancedFilter: UserOrderFilterValue | null,
  categoryFilter: Category | null,
): UserOrderDTO[] => {

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
        case 'pending':
          return item.orderStatus === OrderStatus.PENDING;

        case 'canceled_by_customer':
          return item.orderStatus === OrderStatus.CANCELED;

        case 'pending_payment':
          return item.orderPaymentStatus !== PaymentStatus.APPROVED;

        case 'rejected':
          return item.orderStatus === OrderStatus.REJECTED;

        case 'approved':
          return item.orderStatus === OrderStatus.APPROVED;

        case 'paid':
          return item.orderPaymentStatus === PaymentStatus.APPROVED;

        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesAdvancedFilter;
  });

  return [...filteredItems].sort((a, b) => {
    if (!advancedFilter) return 0;

    switch (advancedFilter) {
      case 'value_asc':
        return a.orderTotalPrice - b.orderTotalPrice;

      case 'value_desc':
        return b.orderTotalPrice - a.orderTotalPrice;

      case 'most_sold':
        return b.orderAmount - a.orderAmount;

      case 'least_sold':
        return a.orderAmount - b.orderAmount;

      default:
        return 0;
    }
  });
};
