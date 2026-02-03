import { ProductWithOrdersDTO } from "@/src/types/ProductWithOrdersDTO";

export const getProductOrdersStats = (product: ProductWithOrdersDTO) => {
  return product.orders.reduce(
    (acc, order) => {
      acc.total++;

      if (order.orderPaymentStatus !== 'APPROVED') {
        acc.notPaid++;
      }

      switch (order.orderStatus) {
        case 'APPROVED':
          acc.approved++;
          break;
        case 'PENDING':
          acc.pending++;
          break;
        case 'REJECTED':
          acc.rejected++;
          break;
        case 'CANCELED':
          acc.canceled++;
          break;
      }

      return acc;
    },
    {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      canceled: 0,
      notPaid: 0,
    }
  );
};
