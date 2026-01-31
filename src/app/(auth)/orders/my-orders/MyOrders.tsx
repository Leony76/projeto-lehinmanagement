import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import MyOrderProduct from "@/src/components/products/MyOrderProduct";
import { UserOrderDTO } from "@/src/types/userOrderDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";

type Props = {
  userOrders: UserOrderDTO[];
}

const MyOrders = ({userOrders}:Props) => {

  const hasUserOrders = userOrders.length > 0;

  return (
    <div>
      <PageTitle style="my-2" title="Meus Pedidos"/>
      <div>
        <Search style={{input: 'mt-5'}} colorScheme="primary"/>
        <div className="flex gap-3 mt-3">
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"FILTER"} colorScheme={"primary"} label={"Filtro"}/>
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"CATEGORY"} colorScheme={"primary"} label={"Categoria"}/>
        </div>
      </div>
    {(hasUserOrders) ? (
      <ProductCardsGrid>
      {userOrders.map((userOrder) => (
        <MyOrderProduct
          key={userOrder.orderId}
          userOrder={userOrder}
        />
      ))}
      </ProductCardsGrid>
    ) : ( 
      <NoContentFoundMessage
        text="Nenhum pedido realizado!"
      />
    )}
    </div>
  )
}

export default MyOrders