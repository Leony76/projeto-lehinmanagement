import { getProducts } from "@/src/services/products"; 
import Products from "./Products";
import { ProductDTO } from "@/src/types/productDTO";

export default async function ProductsPage() {
  const items: ProductDTO[] = await getProducts();

  return (
    <Products 
      items={items} 
    />
  );
}
