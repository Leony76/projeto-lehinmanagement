import { getDashboardStats } from "@/src/services/dashboard";
import Dashboard from "./Dashboard";


export default async function DashboardPage() {

  const dashboardStats = await getDashboardStats();

  return (
    <Dashboard 
      dashboardStats={dashboardStats} 
    />
  );
}