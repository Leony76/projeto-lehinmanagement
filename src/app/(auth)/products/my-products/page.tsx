import { getUserProducts, getUserProductsPutForSale } from "@/src/services/products";
import MyProducts from "./MyProducts";
import { redirect } from "next/navigation";
import { getRequiredSession } from "@/src/lib/get-session-user";
import { UserProductDTO } from "@/src/types/userProductDTO";

export default async function MyProductsPage() {

  const user = (await getRequiredSession()).user;
    
  if (user.role === 'ADMIN') {
    redirect('/products');
  }

  const boughtProducts = await getUserProducts(user.id);
  const productPutForSale = await getUserProductsPutForSale(user.id);

  const myProductsData: UserProductDTO = user.role === 'SELLER' 
    ? {
        role: 'SELLER',
        boughtProducts: boughtProducts,
        publishedProducts: productPutForSale,
      }
    : {
        role: 'CUSTOMER',
        boughtProduct: boughtProducts[0], 
      };

  return (
    <MyProducts
      userData={myProductsData}
    />
  )
}

