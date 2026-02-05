import { Category, OrderStatus, PaymentStatus } from "@prisma/client";
import { UserProductsWithOrdersDTO } from "@/src/types/UserProductsWithOrdersDTO";
import { UserOrderFilterValue } from "@/src/constants/generalConfigs";

export const filteredSearchForUserOrders = (
  items: UserProductsWithOrdersDTO[],
  search: string,
  advancedFilter: UserOrderFilterValue | null,
  categoryFilter: Category | null,
): UserProductsWithOrdersDTO[] => {

  const filteredItems = items.map(product => {
    const filteredOrders = product.orders.filter(order => {
      if (!advancedFilter) return true;

      switch (advancedFilter) {
        case 'pending':
          return order.orderStatus === OrderStatus.PENDING;

        case 'canceled_by_customer':
          return order.orderStatus === OrderStatus.CANCELED;

        case 'pending_payment':
          return order.orderPaymentStatus !== PaymentStatus.APPROVED;

        case 'rejected':
          return order.orderStatus === OrderStatus.REJECTED;

        case 'approved':
          return order.orderStatus === OrderStatus.APPROVED;

        case 'paid':
          return order.orderPaymentStatus === PaymentStatus.APPROVED;

        default:
          return true;
      }
    });

    return {
      ...product,
      orders: filteredOrders,
    };
  })
  
  .filter(product => product.orders.length > 0)

  .filter(product => {
    const matchesSearch = search
      ? product.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });

  return filteredItems.sort((a, b) => {
    if (!advancedFilter) return 0;

    const sum = (orders: typeof a.orders) =>
      orders.reduce((acc, o) => acc + o.orderTotalPrice, 0);

    const qty = (orders: typeof a.orders) =>
      orders.reduce((acc, o) => acc + o.orderedAmount, 0);

    switch (advancedFilter) {
      case 'value_asc':
        return sum(a.orders) - sum(b.orders);

      case 'value_desc':
        return sum(b.orders) - sum(a.orders);

      case 'most_sold':
        return qty(b.orders) - qty(a.orders);

      case 'least_sold':
        return qty(a.orders) - qty(b.orders);

      default:
        return 0;
    }
  });
};

