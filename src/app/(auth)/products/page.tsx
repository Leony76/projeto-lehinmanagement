import { getProducts } from "@/src/services/products"; 
import Products from "./Products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Products 
      products={products} 
    />
  );
}
