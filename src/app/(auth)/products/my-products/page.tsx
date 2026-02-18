import { getUserProducts } from "@/src/services/products";
import MyProducts from "./MyProducts";
import { redirect } from "next/navigation";
import { getRequiredSession } from "@/src/lib/get-session-user";

export default async function MyProductsPage() {

  const user = (await getRequiredSession()).user;
    
  if (user.role === 'ADMIN') {
    redirect('/products');
  }

  const myProducts = await getUserProducts(user.id);

  return (
    <MyProducts
      myProducts={myProducts}
    />
  )
}

