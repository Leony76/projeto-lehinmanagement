import Orders from './Orders'
import { getSellerOrders } from '@/src/services/orders'

export default async function OrdersPage() {
  const orders = await getSellerOrders();

  return (
    <Orders
      orders={orders}
    />
  )
}

