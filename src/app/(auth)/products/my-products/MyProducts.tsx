"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Placeholder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg';
import MyProduct from "@/src/components/products/MyProduct";
import { useToast } from "@/src/contexts/ToastContext";
import { userProductDTO } from "@/src/types/userProductDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";

type Props = {
  myProducts: userProductDTO[];
}

const MyProducts = ({myProducts}:Props) => {

  const hasUserProducts = myProducts.length > 0; 

  return (
    <div>
      <PageTitle style="my-2" title="Meus Produtos"/>
      <div>
        <Search style={{input: 'mt-5'}} colorScheme="primary"/>
        <div className="flex gap-3 mt-3">
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"FILTER"} colorScheme={"primary"} label={"Filtro"}/>
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"CATEGORY"} colorScheme={"primary"} label={"Categoria"}/>
        </div>
      </div>
    {(hasUserProducts) ? (
      <ProductCardsGrid>
      {myProducts.map((userProduct) => (
        <MyProduct 
          key={userProduct.id}
          userProduct={userProduct}
        />
      ))}
      </ProductCardsGrid>
    ) : ( 
      <NoContentFoundMessage
        text="Nenhum produto adiquirido!"
      />
    )}
    </div>
  )
}

export default MyProducts