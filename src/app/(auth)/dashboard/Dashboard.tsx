import { titleColors } from "@/src/constants/systemColorsPallet"
import InfoCard from "@/src/components/ui/InfoCard"
import PageTitle from "@/src/components/ui/PageTitle";
import SectionTitle from "@/src/components/ui/SectionTitle";
import { ToastHandler } from "@/src/utils/showToastOnce";
import { Suspense } from "react";
import { getOverallSaleStatus, getSellerSaleStatus, getOverallSaleStatsFromSellers } from "@/src/services/sales";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAndSellersOrdersStats, getOverallCustomersAndSellersOrderStats, getSellerOrdersRevenue } from "@/src/services/orders";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { getUsersRoleCount } from "@/src/services/users";
import { DashboardDTO } from "@/src/types/dashboardDTO";
import AdminDashboard from "@/src/components/ui/AdminDashboard";
import CustomerDashboard from "@/src/components/ui/CustomerDashboard";
import SellerDashboard from "@/src/components/ui/SellerDashboard";

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