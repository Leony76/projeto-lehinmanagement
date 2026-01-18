import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, staticButtonColorScheme } from '@/src/constants/systemColorsPallet';
import StaticButton from '../ui/StaticButton';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  image: string | StaticImageData;
  name: string;
  category: CategoryTranslatedValue;
  datePutToSale: string;
  rating: number;
  price: number;
  stock: number;
}

const MyOrderProduct = ({
  image,
  name,
  category,
  datePutToSale,
  rating,
  price,
  stock,
}:Props) => {
  return (
    <div className={`relative ${productCardSetup.mainContainer}`}>
      <Image 
        src={image} 
        alt={name}
        className={productCardSetup.image}
      />
      <StaticButton value={'Em análise'} style={`absolute top-3 left-3 ${staticButtonColorScheme.yellow}`}/>
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
            {rating.toFixed(1).replace('.',',')}
          </div>
        </div>
        <div>
          <h4 className='text-yellow-dark'>Data do pedido: <span className='text-gray'>15/01/26 - 10:36</span></h4>
          <h4 className={productCardSetup.stock}>Em estoque: {stock}</h4>
        </div>
        <h3 className='text-ui-money text-2xl'>R$ 456,90</h3>
        <div className='flex gap-2 mt-1'>
          <Button style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} label='Pagar'/>
          <Button style={`px-5 ${buttonColorsScheme.gray}`} icon={FaChevronDown}/>
        </div>
        {/* <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.green}`} value={'Aprovado'}/> */}
        {/* <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.yellow}`} value={'Pendente'}/>
        <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.red}`} value={'Cancelado'}/>
        <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.red}`} value={'Rejeitado'}/> */}
      </div>
    </div>
  )
}

export default MyOrderProduct