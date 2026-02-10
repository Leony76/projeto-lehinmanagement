import { getOrdersFromUser } from "@/src/services/orders";
import MyOrders from "./MyOrders";

export default async function MyOrdersPage() {
  const userOrders = await getOrdersFromUser();
  
  return (
    <MyOrders
      userOrders={userOrders}
    />
  )
}

 