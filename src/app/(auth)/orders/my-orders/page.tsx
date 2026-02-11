import { getOrdersFromUser } from "@/src/services/orders";
import MyOrders from "./MyOrders";
import { getRequiredSession } from "@/src/lib/get-session-user";
import { redirect } from "next/navigation";

export default async function MyOrdersPage() {
  const user = (await getRequiredSession()).user;
  
  if (user.role === 'ADMIN') {
    redirect('/products');
  }

  const userOrders = await getOrdersFromUser();
  
  return (
    <MyOrders
      userOrders={userOrders}
    />
  )
}

 