import { getDashboardStats } from "@/src/services/dashboard";
import Dashboard from "./Dashboard";
import { getRequiredSession } from "@/src/lib/get-session-user";
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Link from "next/link";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import Image from "next/image";
import { UserDeactivatedReason } from "@/src/types/UserDeactivatedReasonDTO";
import { getDeactivatedUserReason } from "@/src/services/users";
import { formattedDate } from "@/src/utils/formattedDate";
import { Logout } from "@/src/components/auth/Logout";
import UserDeactivedMenu from "@/src/components/ui/UserDeactivedMenu";

export default async function DashboardPage() {

  const user = (await getRequiredSession()).user;
  
  if (!user || !user.isActive) {

    const userDeactivated: UserDeactivatedReason = await getDeactivatedUserReason(user.id);
    const deactivation = {
      date: formattedDate(userDeactivated.deactivationDate),
      reason: userDeactivated.reason,
    };

    return (
      <UserDeactivedMenu
        deactivation={deactivation}
      />
    )
  }

  const dashboardStats = await getDashboardStats();

  return (
    <Dashboard 
      dashboardStats={dashboardStats} 
    />
  );
} 