import Orders from './Orders'
import { getSellerOrders } from '@/src/services/orders'

export default async function OrdersPage() {
  const productsWithOrders = await getSellerOrders();

  return (
    <Orders
      productsWithOrders={productsWithOrders}
    />
  )
}

