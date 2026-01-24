import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP, CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { ProductDTO } from '@/src/types/form/product';

type Props = {
  product: ProductDTO;
  showOrderProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: React.Dispatch<React.SetStateAction<ProductDTO | null>>;
}

const Product = ({
  product,
  showOrderProductModal,
  selectedProduct
}:Props) => {

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  return (
    <div className={productCardSetup.mainContainer}>
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={productCardSetup.image}
        />
      </div>
      <div className={productCardSetup.infosContainer}>
        <h3 className={productCardSetup.name}>{product.name}</h3>
        <div className={productCardSetup.categoryDateRatingContainer}>
          <div className={productCardSetup.categoryDate}>
            <span>{category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{datePutToSale}</span>
          </div>
          <div className={productCardSetup.rating}>
            <IoStar/>
            {4}
          </div>
        </div>
        <div className={productCardSetup.priceStockContainer}>
          <span className={productCardSetup.price}>R$ {product.price.toFixed(2).replace('.',',')}</span>
          <span className={productCardSetup.stock}>Em estoque: {product.stock}</span>
        </div>
        <Button
          style='text-xl' 
          label={"Fazer pedido"}
          colorScheme={'primary'}
          onClick={() => {
            showOrderProductModal(true)
            selectedProduct(product)
          }}
          type='button'
        />
      </div>
    </div>
  )
}

export default Product

