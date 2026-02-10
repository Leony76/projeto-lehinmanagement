import { getUserProducts } from "@/src/services/products";
import MyProducts from "./MyProducts";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyProductsPage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const myProducts = await getUserProducts(session.user.id);

  return (
    <MyProducts
      myProducts={myProducts}
    />
  )
}

