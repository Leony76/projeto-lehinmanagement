import { getDashboardStats } from "@/src/services/dashboard";
import Dashboard from "./Dashboard";
import { getRequiredSession } from "@/src/lib/get-session-user";
import { UserDeactivatedDTO } from "@/src/types/UserDeactivatedReasonDTO";
import { getDeactivatedUserReason, getUserAndSupportConversation } from "@/src/services/users";
import UserDeactivedMenu from "@/src/components/ui/UserDeactivedMenu";
import { UserAndSupportConversationDTO } from "@/src/types/UserAndSupportConversationDTO";

export default async function DashboardPage() {

  const user = (await getRequiredSession()).user;
  
  if (!user || !user.isActive) {

    const userDeactivated: UserDeactivatedDTO = await getDeactivatedUserReason(user.id);
    const userAndSupportConversation: UserAndSupportConversationDTO[] = await getUserAndSupportConversation(user.id);

    return (
      <UserDeactivedMenu
        deactivation={userDeactivated}
        conversations={userAndSupportConversation}
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