"use client";

import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Placeholder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg';
import Product from "@/src/components/products/Product";
import { useState } from "react";
import OrderProduct from "@/src/components/modal/OrderProduct";
import { lockScrollY } from "@/src/utils/lockScrollY";

const Products = () => {

  const [orderProductMenu, showOrderProductMenu] = useState(false);

  lockScrollY(orderProductMenu);

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
      <div className="grid grid-cols-1 gap-5 my-4 mt-6">
        <Product 
          image={Placeholder} 
          name={`Produto #1`} 
          category={"Brinquedo"} 
          datePutToSale={"14/01/26"} 
          rating={3.5} 
          price={99.97} 
          stock={123}

          showOrderProductModal={showOrderProductMenu}
        />
      </div>

      {/* ⇊ MODALS ⇊ */}

      <OrderProduct
        isOpen={orderProductMenu}
        showOrderProductMenu={showOrderProductMenu}
      />
    </div>
  )
}

export default Products