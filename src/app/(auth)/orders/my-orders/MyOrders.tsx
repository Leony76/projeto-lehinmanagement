"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import MyOrderProduct from "@/src/components/products/MyOrderProduct";
import { UserOrderDTO } from "@/src/types/userOrderDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useState } from "react";
import { CATEGORY_LABEL_MAP, USER_ORDER_FILTER_LABEL_MAP, UserOrderFilterValue } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import { filteredSearchForUserOrders } from "@/src/utils/filters/filteredSearchForUserOrders";

type Props = {
  userOrders: UserOrderDTO[];
}

const MyOrders = ({userOrders}:Props) => {

  const [search, setSearch] = useState('');
  const [advancedFilter, setAdvancedFilter] = useState<UserOrderFilterValue | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  
  const translatedAdvandedFilter = advancedFilter ? USER_ORDER_FILTER_LABEL_MAP[advancedFilter] : '';
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const filteredOrders = filteredSearchForUserOrders(
    userOrders,
    search,
    advancedFilter,
    categoryFilter,
  );

  const hasUserOrders = filteredOrders.length > 0;

  return (
    <div>
      <PageTitle style="my-2" title="Meus Pedidos"/>
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
            selectSetup={"USER_ORDER_FILTER"} 
            colorScheme={"primary"} 
            label={"Filtro"}
            onChange={(e) => setAdvancedFilter(e.target.value as UserOrderFilterValue)}
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
    {(hasUserOrders) ? (
      <ProductCardsGrid>
      {filteredOrders.map((userOrder) => (
        <MyOrderProduct
          key={userOrder.orderId}
          userOrder={userOrder}
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

export default MyOrders