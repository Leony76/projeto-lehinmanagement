"use client";

import { DashboardDTO } from "@/src/types/dashboardDTO";
import AdminDashboard from "@/src/components/ui/AdminDashboard";
import CustomerDashboard from "@/src/components/ui/CustomerDashboard";
import SellerDashboard from "@/src/components/ui/SellerDashboard";
import { useThemeApplier } from "@/src/utils/useThemeApplier";

type Props = {
  dashboardStats: DashboardDTO;
}

const Dashboard = ({
  dashboardStats,
}:Props) => {
  switch (dashboardStats.role) {
    case "SELLER":
      return <SellerDashboard data={dashboardStats} />;

    case "ADMIN":
      return <AdminDashboard data={dashboardStats} />;

    case "CUSTOMER":
    default:
      return <CustomerDashboard data={dashboardStats} />;
  }

}

export default Dashboard