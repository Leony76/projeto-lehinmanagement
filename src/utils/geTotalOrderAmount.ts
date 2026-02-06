import { UserProductDTO } from "../types/userProductDTO";

export const getTotalOrderedAmount = (product: UserProductDTO): number =>
product.orders.reduce(
  (total, order) =>
    total +
    order.items.reduce((sum, item) => sum + item.quantity, 0),
  0,
);