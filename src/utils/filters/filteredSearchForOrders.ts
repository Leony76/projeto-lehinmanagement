import { Category, DeletedBy, OrderStatus } from "@prisma/client";
import { OrderProductDTO } from "@/src/types/orderProductDTO";
import { OrderFilterValue } from "@/src/constants/generalConfigs";

export const filteredSearchForOrders = (
  items: OrderProductDTO[],
  search: string,
  advancedFilter: OrderFilterValue | null,
  categoryFilter: Category | null,
): OrderProductDTO[] => {

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
        case 'analyzed':
          return item.orderStatus !== OrderStatus.PENDING;

        case 'not_analyzed':
          return item.orderStatus === OrderStatus.PENDING;

        case 'canceled_by_customer':
          return (
            item.orderStatus === OrderStatus.CANCELED &&
            item.orderDeletedByCustomer === DeletedBy.CUSTOMER
          );

        case 'pending_payment':
          return item.orderPaymentStatus === OrderStatus.PENDING;

        case 'rejected':
          return item.orderStatus === OrderStatus.REJECTED;

        case 'approved':
          return item.orderStatus === OrderStatus.APPROVED;

        case 'paid':
          return item.orderPaymentStatus === OrderStatus.APPROVED;

        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesAdvancedFilter;
  });

  return [...filteredItems].sort((a, b) => {
    if (!advancedFilter) return 0;

    const totalA = a.price * a.orderedAmount;
    const totalB = b.price * b.orderedAmount;

    switch (advancedFilter) {
      case 'value_asc':
        return totalA - totalB;

      case 'value_desc':
        return totalB - totalA;

      case 'most_sold':
        return b.orderedAmount - a.orderedAmount;

      case 'least_sold':
        return a.orderedAmount - b.orderedAmount;

      default:
        return 0;
    }
  });
};
