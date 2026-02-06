"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import OrderProduct from "@/src/components/products/OrderProduct";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import { ProductWithOrdersDTO } from "@/src/types/ProductWithOrdersDTO";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useState } from "react";
import { CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import { filteredSearchForOrders } from "@/src/utils/filters/filteredSearchForOrders";
import { productOrdersGeneralStats } from "@/src/utils/filters/productOrdersGeneralStats";
import ProductOrdersGeneralStats from "@/src/components/ui/ProductOrdersGeneralStats";

type Props = {
  productsWithOrders: ProductWithOrdersDTO[];
}

const Orders = ({productsWithOrders}:Props) => {

  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const ordersStats = productOrdersGeneralStats(productsWithOrders);

  const filteredOrders = filteredSearchForOrders(
    productsWithOrders,
    search,
    categoryFilter,
  );

  const hasOrders = filteredOrders.length > 0;
  
  return (
    <div>
      <PageTitle style="my-2 mb-4" title="Pedidos"/>
      <ProductOrdersGeneralStats 
        approved={ordersStats.approved} 
        pending={ordersStats.pending} 
        canceled={ordersStats.canceled} 
        rejected={ordersStats.rejected} 
        notPaid={ordersStats.notPaid} 
        total={ordersStats.total}
      />
      <div className="flex flex-col gap-3">
        <Search 
          style={{input: 'mt-5 py-1'}} 
          colorScheme="primary"
          value={search}
          onClearSearch={() => setSearch('')}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select 
          style={{input: 'flex-1 w-full'}} 
          selectSetup={"CATEGORY"} 
          colorScheme={"primary"} 
          label={"Categoria"}
          onChange={(e) => setCategoryFilter(e.target.value as Category)}
        />     
      </div>
    {(hasOrders) ? (
      <ProductCardsGrid>
      {filteredOrders.map((productWithOrder) => (
        <OrderProduct 
          key={productWithOrder.id}
          product={productWithOrder}
        /> 
      ))}
      </ProductCardsGrid>
    ) : (
      <NoContentFoundMessage 
        text={
          search && categoryFilter
            ? `Nenhum resultado para "${search}" e para a categoria "${translatedCategoryFilter}"`
          : search
            ? `Nenhum resultado para "${search}"`
          : categoryFilter
            ? `Nenhum resultado para a categoria "${translatedCategoryFilter}"`
          : `Nenhum pedido no momento`
        }
      />
    )}
    </div>
  )
}

export default Orders

