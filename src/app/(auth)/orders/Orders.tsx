import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Placeholder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg';
import OrderProduct from "@/src/components/products/OrderProduct";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import { userProductDTO } from "@/src/types/userProductDTO";

type Props = {
  orders: userProductDTO[];
}

const Orders = ({orders}:Props) => {
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
      <ProductCardsGrid>
      {orders.map((order) => (
        <OrderProduct 
          order={order}
        /> 
      ))}
      </ProductCardsGrid>
    </div>
  )
}

export default Orders