import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import OrderProduct from "@/src/components/products/OrderProduct";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import { OrderProductDTO } from "@/src/types/orderProductDTO";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";

type Props = {
  orders: OrderProductDTO[];
}

const Orders = ({orders}:Props) => {

  const hasOrders = orders.length > 0;
  
  return (
    <div>
      <PageTitle style="my-2" title="Pedidos"/>
      <div>
        <Search style={{input: 'mt-5'}} colorScheme="primary"/>
        <div className="flex gap-3 mt-3">
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"FILTER"} colorScheme={"primary"} label={"Filtro"}/>
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"CATEGORY"} colorScheme={"primary"} label={"Categoria"}/>
        </div>
      </div>
    {(hasOrders) ? (
      <ProductCardsGrid>
      {orders.map((order) => (
        <OrderProduct 
          key={order.orderId}
          order={order}
        /> 
      ))}
      </ProductCardsGrid>
    ) : (
      <NoContentFoundMessage
        text="Nenhum pedido no momento!"
      />
    )}
    </div>
  )
}

export default Orders