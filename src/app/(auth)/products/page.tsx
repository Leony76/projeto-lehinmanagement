import { getProducts } from "@/src/services/products"; 
import Products from "./Products";
import { ProductDTO } from "@/src/types/form/product";

export default async function ProductsPage() {
  const products = await getProducts();

  const serializedProducts: ProductDTO[] = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    stock: p.stock,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
  }));

  return <Products products={serializedProducts} />;
}
