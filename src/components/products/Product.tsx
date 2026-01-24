import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';

type Props = {
  image: string | StaticImageData;
  name: string;
  category: CategoryTranslatedValue;
  datePutToSale: string;
  rating: number;
  price: number;
  stock: number;

  showOrderProductModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Product = ({
  image,
  name,
  category,
  datePutToSale,
  rating,
  price,
  stock,

  showOrderProductModal
}:Props) => {

  

  return (
    <div className={productCardSetup.mainContainer}>
      <Image 
        src={image} 
        alt={name}
        className={productCardSetup.image}
      />
      <div className={productCardSetup.infosContainer}>
        <h3 className={productCardSetup.name}>{name}</h3>
        <div className={productCardSetup.categoryDateRatingContainer}>
          <div className={productCardSetup.categoryDate}>
            <span>{category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{datePutToSale}</span>
          </div>
          <div className={productCardSetup.rating}>
            <IoStar/>
            {rating}
          </div>
        </div>
        <div className={productCardSetup.priceStockContainer}>
          <span className={productCardSetup.price}>R$ {price.toFixed(2).replace('.',',')}</span>
          <span className={productCardSetup.stock}>Em estoque: {stock}</span>
        </div>
        <Button
          style='text-xl' 
          label={"Fazer pedido"}
          colorScheme={'primary'}
          onClick={() => showOrderProductModal(true)}
        />
      </div>
    </div>
  )
}

export default Product