"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import MyOrderProduct from "@/src/components/products/MyOrderProduct";
import { UserProductsWithOrdersDTO } from "@/src/types/UserProductsWithOrdersDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useState } from "react";
import { CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import { filteredSearchForUserOrders } from "@/src/utils/filters/filteredSearchForUserOrders";
import { userProductOrdersGeneralStats } from "@/src/utils/filters/userProductOrdersGeneralStats";
import ProductOrdersGeneralStats from "@/src/components/ui/ProductOrdersGeneralStats";

type Props = {
  userOrders: UserProductsWithOrdersDTO[];
}

const MyOrders = ({userOrders}:Props) => {

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const ordersStats = userProductOrdersGeneralStats(userOrders);

  const filteredOrders = filteredSearchForUserOrders(
    userOrders,
    search,
    categoryFilter,
  );

  const hasUserOrders = filteredOrders.length > 0;

  return (
    <div>
      <PageTitle style="my-2" title="Meus Pedidos"/>
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
    {(hasUserOrders) ? (
      <ProductCardsGrid>
      {filteredOrders.map((product) => (
        <MyOrderProduct
          key={product.id}
          product={product}
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
          : `Nenhum produto no estoque no momento`
        }
      />
    )}
    </div>
  )
}

export default MyOrders