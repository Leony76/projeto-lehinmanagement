import { OrderFilterValue } from "@/src/constants/generalConfigs";
import { UserProductsWithOrdersDTO } from "@/src/types/UserProductsWithOrdersDTO";

export const filterOrders = (
  orders: UserProductsWithOrdersDTO['orders'],
  search: string,
  filter: OrderFilterValue | null
) => {
  let filtered = [...orders];

  if (search.trim()) {
    filtered = filtered.filter(order =>
      String(order.orderId).includes(search.trim())
    );
  }

  if (!filter) return filtered;

  switch (filter) {
    case 'value_asc':
      filtered.sort((a, b)  => a.orderTotalPrice - b.orderTotalPrice);
      break;

    case 'value_desc':
      filtered.sort((a, b) => b.orderTotalPrice - a.orderTotalPrice);
      break;

    case 'most_sold':
      filtered.sort((a, b) => b.orderedAmount - a.orderedAmount);
      break;

    case 'least_sold':
      filtered.sort((a, b) => a.orderedAmount - b.orderedAmount);
      break;

    case 'approved':
      filtered = filtered.filter(o => o.orderStatus === 'APPROVED');
      break;

    case 'rejected':
      filtered = filtered.filter(o => o.orderStatus === 'REJECTED');
      break;

    case 'canceled_by_customer':
      filtered = filtered.filter(o => o.orderStatus === 'CANCELED');
      break;

    case 'analyzed':
      filtered = filtered.filter(o => o.orderStatus !== 'PENDING');
      break;

    case 'not_analyzed':
      filtered = filtered.filter(o => o.orderStatus === 'PENDING');
      break;

    case 'paid':
      filtered = filtered.filter(
        o => o.orderPaymentStatus === 'APPROVED'
      );
      break;

    case 'pending_payment':
      filtered = filtered.filter(
        o => o.orderPaymentStatus !== 'APPROVED'
      );
      break;
  }

  return filtered;
};
