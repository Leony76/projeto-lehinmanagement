"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Product from "@/src/components/products/Product";
import { ProductDTO } from "@/src/types/productDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";
import { useState } from "react";
import { CATEGORY_LABEL_MAP, PRODUCT_FILTER_LABEL_MAP, ProductFilterValue } from "@/src/constants/generalConfigs";
import { Category } from "@prisma/client";
import { filteredSearchForProducts } from "@/src/utils/filters/filteredSearchForProducts";

type Props = {
  products: ProductDTO[];
};

const Products = ({ 
  products,
}: Props) => {

  const [search, setSearch] = useState<string>('');
  const [advancedFilter, setAdvancedFilter] = useState<ProductFilterValue | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  const translatedAdvandedFilter = advancedFilter ? PRODUCT_FILTER_LABEL_MAP[advancedFilter] : '';
  const translatedCategoryFilter = categoryFilter ? CATEGORY_LABEL_MAP[categoryFilter] : '';

  const filteredProducts = filteredSearchForProducts(
    products,
    search,
    advancedFilter,
    categoryFilter,
  );

  const hasProducts = filteredProducts.length > 0;
    
  return (
    <div>
      <PageTitle 
        style="my-2" 
        title="Produtos"
      />
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
            style={{input: `flex-1 w-full`}} 
            selectSetup={"PRODUCT_FILTER"} 
            colorScheme={"primary"} 
            label={"Filtro"}
            onChange={(e) => setAdvancedFilter(e.target.value as ProductFilterValue)}
          />
          <Select 
            style={{input: `flex-1 w-full`}} 
            selectSetup={"CATEGORY"} 
            colorScheme={"primary"} 
            label={"Categoria"}
            onChange={(e) => setCategoryFilter(e.target.value as Category)}
          />
        </div>
      </div>
    {(hasProducts) ? (
      <ProductCardsGrid>
      {filteredProducts.map((product) => (
        <Product
          key={product.id}
          product={product}
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
          : `Nenhum produto disponível no momento`
        }
      />
    )}
    </div>
  )
}

export default Products