import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { IoIosStarOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { productCardSetup } from '@/src/constants/cardConfigs';

type Props = {
  image: string | StaticImageData;
  name: string;
  category: CategoryTranslatedValue;
  datePutToSale: string;
  rating: number;
  price: number;
  stock: number;
}

const MyProduct = ({
  image,
  name,
  category,
  datePutToSale,
  rating,
  price,
  stock,
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
        <div className='flex justify-between'>
          <div className='flex text-4xl gap-1 text-yellow'>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
          </div>
          <Button icon={AiOutlineMessage} style='text-yellow border-yellow bg-yellow-light/16 px-5 text-2xl' label={''}/>
        </div>
        <Button style='mt-2 text-xl' label={"Mais Informações"} colorScheme={'primary'}/>
      </div>
    </div>
  )
}

export default MyProduct