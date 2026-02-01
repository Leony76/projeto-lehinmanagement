"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import OrderProduct from "@/src/components/products/OrderProduct";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import { OrderProductDTO } from "@/src/types/orderProductDTO";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useState } from "react";
import { CATEGORY_LABEL_MAP, ORDER_FILTER_LABEL_MAP, OrderFilterValue } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import { filteredSearchForOrders } from "@/src/utils/filters/filteredSearchForOrders";

type Props = {
  orders: OrderProductDTO[];
}

const Orders = ({orders}:Props) => {

  const [search, setSearch] = useState<string>('');
  const [advancedFilter, setAdvancedFilter] = useState<OrderFilterValue | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  
  const translatedAdvandedFilter = advancedFilter ? ORDER_FILTER_LABEL_MAP[advancedFilter] : '';
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const filteredOrders = filteredSearchForOrders(
    orders,
    search,
    advancedFilter,
    categoryFilter,
  );

  const hasOrders = filteredOrders.length > 0;
  
  return (
    <div>
      <PageTitle style="my-2" title="Pedidos"/>
      <div>
        <Search 
          style={{input: 'mt-5'}} 
          colorScheme="primary"
          value={search}
          onClearSearch={() => setSearch('')}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-3 mt-3">
          <Select 
            style={{input: 'flex-1 w-full'}} 
            selectSetup={"ORDER_FILTER"} 
            colorScheme={"primary"} 
            label={"Filtro"}
            onChange={(e) => setAdvancedFilter(e.target.value as OrderFilterValue)}
          />
          <Select 
            style={{input: 'flex-1 w-full'}} 
            selectSetup={"CATEGORY"} 
            colorScheme={"primary"} 
            label={"Categoria"}
            onChange={(e) => setCategoryFilter(e.target.value as Category)}
          />
        </div>
      </div>
    {(hasOrders) ? (
      <ProductCardsGrid>
      {filteredOrders.map((order) => (
        <OrderProduct 
          key={order.orderId}
          order={order}
        /> 
      ))}
      </ProductCardsGrid>
    ) : (
      <NoContentFoundMessage 
        text={
          search && categoryFilter && advancedFilter
            ? `Nenhum resultado para "${search}", categoria "${translatedCategoryFilter}" e filtro avançado "${translatedAdvandedFilter}"`
          : search && categoryFilter
            ? `Nenhum resultado para "${search}" e para a categoria "${translatedCategoryFilter}"`
          : search && advancedFilter
            ? `Nenhum resultado para "${search}" e para o filtro avançado "${translatedAdvandedFilter}"`
          : categoryFilter && advancedFilter
            ? `Nenhum resultado para a categoria "${translatedCategoryFilter}" e para o filtro avançado "${translatedAdvandedFilter}"`
          : search
            ? `Nenhum resultado para "${search}"`
          : categoryFilter
            ? `Nenhum resultado para a categoria "${translatedCategoryFilter}"`
          : advancedFilter
            ? `Nenhum resultado para o filtro avançado "${translatedAdvandedFilter}"`
          : `Nenhum produto no estoque no momento`
        }
      />
    )}
    </div>
  )
}

export default Orders