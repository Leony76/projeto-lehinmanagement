export const saleStats = (items: any[]) => {
  const stats = items.reduce((acc, item) => {
    const status = item.order.status;
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<string, number>);

  return {
    total: items.length,
    status: stats
  };
};