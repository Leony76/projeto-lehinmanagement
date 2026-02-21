"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import MyProduct from "@/src/components/products/MyProduct";
import { UserProductDTO } from "@/src/types/userProductDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useMemo, useState } from "react";
import { filteredSearchForUserProducts } from "@/src/utils/filters/filteredSearchForUserProducts";
import { CATEGORY_LABEL_MAP, USER_PRODUCT_FILTER_LABEL_MAP, UserProductFilterValue } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import SwitchRenderViewButtons from "@/src/components/ui/SwitchRenderViewButtons";

type Props = {
  userData: UserProductDTO;
}

const MyProducts = ({ userData }:Props) => {

  const [search, setSearch] = useState<string>('');
  const [advancedFilter, setAdvancedFilter] = useState<UserProductFilterValue | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
    
  const translatedAdvandedFilter = advancedFilter ? USER_PRODUCT_FILTER_LABEL_MAP[advancedFilter] : '';
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const [view, setView] = useState<'BOUGHT' | 'PUBLISHED'>('BOUGHT');

  const currentList = useMemo(() => {
    if (userData.role === 'CUSTOMER') {
      return userData.boughtProduct 
        ? [userData.boughtProduct] 
        : []
      ;
    } 
    
    if (userData.role === 'SELLER') {
      return view === 'BOUGHT' 
        ? (userData.boughtProducts || []) 
        : (userData.publishedProducts || [])
      ;
    }
    
    return [];
  }, [userData, view]);

  const filteredUserProducts = filteredSearchForUserProducts(
    currentList,
    search,
    advancedFilter,
    categoryFilter,
  );
    
  const hasUserProducts = filteredUserProducts.length > 0; 

  return (
    <div>
      <PageTitle style="my-2" title="Meus Produtos"/>
      <div className="space-y-3">
        <Search 
          style={{input: 'mt-5'}} 
          colorScheme="primary"
          value={search}
          onClearSearch={() => setSearch('')}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <Select 
            style={{input: 'flex-1 w-full'}} 
            selectSetup={"USER_PRODUCT_FILTER"} 
            colorScheme={"primary"} 
            label={"Filtro"}
            onChange={(e) => setAdvancedFilter(e.target.value as UserProductFilterValue)}
          />
          <Select 
            style={{input: 'flex-1 w-full'}} 
            selectSetup={"CATEGORY"} 
            colorScheme={"primary"} 
            label={"Categoria"}
            onChange={(e) => setCategoryFilter(e.target.value as Category)}
          />
        </div>

        {userData.role === 'SELLER' &&
          <SwitchRenderViewButtons 
            onClick={{
              setFirstView: () => setView('BOUGHT'),
              setSecondView: () => setView('PUBLISHED'),
            }} view={{
              first: view === 'BOUGHT',
              second: view === 'PUBLISHED',
            }} label={{
              first: "Comprados",
              second: "Colocados à venda"
            }}
          />
        }
      </div>
    {(hasUserProducts) ? (
      <ProductCardsGrid>
      {filteredUserProducts.map((item) => (
        <MyProduct 
          key={'id' in item ? item.id : item.product.id}
          userProduct={item}
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
          : view === 'PUBLISHED' 
            ? `Nenhum produto publicado por você`
          : `Nenhum produto adiquirido por você no momento`
        }
      />
    )}
    </div>
  )
}

export default MyProducts