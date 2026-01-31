"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Product from "@/src/components/products/Product";
import { ProductDTO } from "@/src/types/productDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";

type Props = {
  products: ProductDTO[];
};

const Products = ({ 
  products
}: Props) => {

  const hasProducts = products.length > 0;

  return (
    <div>
      <PageTitle style="my-2" title="Produtos"/>
      <div>
        <Search style={{input: 'mt-5'}} colorScheme="primary"/>
        <div className="flex gap-3 mt-3">
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"FILTER"} colorScheme={"primary"} label={"Filtro"}/>
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"CATEGORY"} colorScheme={"primary"} label={"Categoria"}/>
        </div>
      </div>
    {(hasProducts) ? (
      <ProductCardsGrid>
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
        />
      ))}
      </ProductCardsGrid>
    ) : (
      <NoContentFoundMessage 
        text="Nenhum produto no estoque no momento!"
      />
    )}
    </div>
  )
}

export default Products