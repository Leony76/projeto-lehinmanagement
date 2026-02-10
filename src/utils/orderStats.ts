import { Status } from "@prisma/client";

type OrderStatusGroup = {
  status: Status;
  _count: {
    id: number;
  };
};

const initialStatus: Record<Status, number> = {
  PENDING: 0,
  APPROVED: 0,
  REJECTED: 0,
  CANCELED: 0,
};

export const orderStats = (items: OrderStatusGroup[]) => {
  const status = items.reduce(
    (acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    },
    { ...initialStatus }
  );

  const total = Object.values(status).reduce((a, b) => a + b, 0);

  return {
    total,
    status,
  };
};
