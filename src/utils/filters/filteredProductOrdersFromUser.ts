import { UserProductOrdersFilterValue } from "@/src/constants/generalConfigs";

export const filteredProductOrders = (
  search: {
    order: string;
    filter: UserProductOrdersFilterValue;
    onSearch: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onFilter: (e:React.ChangeEvent<HTMLSelectElement>) => void;
    onClearSearch: () => void;
  },
  orders: {
    id: number;
    orderedAmount: number;
    orderDate: string;
    orderTotalPrice: number;
  }[],
) => {

  const filteredOrders = [...orders]
  .filter(order => {
    if (!search.order) return true;

    return (
      String(order.id).includes(search.order) ||
      String(order.orderDate).includes(search.order)
    );

  }).sort((a, b) => {
    switch (search.filter) {
      case 'most_recent':
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();

      case 'least_recent':
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();

      case 'most_valuable':
        return b.orderTotalPrice - a.orderTotalPrice;

      case 'least_valuable':
        return a.orderTotalPrice - b.orderTotalPrice;

      case 'most_units_ordered':
        return b.orderedAmount - a.orderedAmount;

      case 'least_units_ordered':
        return a.orderedAmount - b.orderedAmount;

      default:
        return 0;
    }
  });

  return filteredOrders;
}

