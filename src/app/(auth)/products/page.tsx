import { getProductReviews, getProducts } from "@/src/services/products"; 
import Products from "./Products";
import { ProductDTO } from "@/src/types/productDTO";
import { ProductReviewsDTO } from "@/src/types/productReviewsDTO";


export default async function ProductsPage() {
  const productInfos: ProductDTO[] = await getProducts();
  const productReviews: ProductReviewsDTO[] = await getProductReviews();

  const items = productInfos.map<ProductDTO>((item) => ({
    ...item,
    product: {
      ...item.product,
      reviews: productReviews.filter((review) => review.productId === item.product.id),
    },
  }));

  return (
    <Products 
      items={items}
    />
  );
}
