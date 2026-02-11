import { getRequiredSession } from '@/src/lib/get-session-user';
import Orders from './Orders'
import { getSellerOrders } from '@/src/services/orders'
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const user = (await getRequiredSession()).user;

  if (user.role !== 'SELLER') {
    redirect('/products');
  }

  const productsWithOrders = await getSellerOrders();

  return (
    <Orders
      productsWithOrders={productsWithOrders}
    />
  )
}

