import { Category } from "@prisma/client";

export interface DashboardOrdersStatsDTO {
  done: number;
  pending: number;
  approved: number;
  rejected: number;
  mostRecent: { createdAt: string | null } | null;
  mostOrderedCategory: Category | null;
}

export interface DashboardSpendDTO {
  total: number | null;
  average: number | null;
  lowest: number | null;
  highest: number | null;
}

export interface DashboardEarnDTO {
  total: number | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}



export interface CustomerDashboardStatsDTO {
  role: "CUSTOMER";

  orders: DashboardOrdersStatsDTO;
  spend: DashboardSpendDTO;
}

export interface SellerDashboardStatsDTO {
  role: "SELLER";

  orders: DashboardOrdersStatsDTO;
  spend: DashboardSpendDTO;

  sales: {
    done: number;
    pending: number;
    total: number;
    unsuccessful: number;

    earn: DashboardEarnDTO;

    mostSoldCategory: [Category, number] | null;
    mostRecentSale: {
      createdAt: string;
    } | null;
  };
}

export interface AdminDashboardStatsDTO {
  role: "ADMIN";

  usersCount: {
    customers: number;
    sellers: number;
    admins: number;
  };

  sellers: {
    averageEarn: number;
    dailyEarn: number;
    mostSoldCategory: [Category, number];
    mostSoldProduct: {
      id: number;
      name: string;
      quantity: number;
    };
    salesByCategory: {
      category: Category;
      total: number;
    }[];

    orders: {
      done: number;
      pending: number;
      approved: number;
      rejected: number;
      averageExpenditure: number;
      mostOrderedProduct: {
        id: number;
        name: string;
        quantity: number;
      };
    }
  }

  customers: {
    orders: {
      done: number;
      pending: number;
      approved: number;
      rejected: number;
      averageExpediture: number;
      mostOrderedProduct: {
        id: number;
        name: string;
        quantity: number;
      };
    };
  }
}



export type DashboardDTO =
  | CustomerDashboardStatsDTO
  | SellerDashboardStatsDTO
  | AdminDashboardStatsDTO;
