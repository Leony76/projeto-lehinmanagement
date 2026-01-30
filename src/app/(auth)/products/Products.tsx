"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Product from "@/src/components/products/Product";
import { useState } from "react";
import OrderProduct from "@/src/components/modal/OrderProduct";
import { lockScrollY } from "@/src/utils/lockScrollY";
import { ProductDTO } from "@/src/types/productDTO";
import ProductCardsGrid from "@/src/components/ui/ProductCardsGrid";
import NoContentFoundMessage from "@/src/components/ui/NoContentFoundMessage";

type Props = {
  products: ProductDTO[];
};

const Products = ({ 
  products
}: Props) => {

  const [productsState, setProductsState] = useState<ProductDTO[]>(products);
  const [orderProductMenu, showOrderProductMenu] = useState(false);
  const [SelectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);

  lockScrollY(orderProductMenu);

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
      {productsState.map((product) => (
        <Product
          key={product.id}
          product={product}
          setProducts={setProductsState}
          showOrderProductModal={showOrderProductMenu}
          selectedProduct={setSelectedProduct}
        />
      ))}
      </ProductCardsGrid>
    ) : (
      <NoContentFoundMessage 
        text="Nenhum produto no estoque no momento!"
      />
    )}

      {/* ⇊ MODALS ⇊ */}

      <OrderProduct
        isOpen={orderProductMenu}
        selectedProduct={SelectedProduct}
        showOrderProductMenu={showOrderProductMenu}
      />
    </div>
  )
}

export default Products