"use client";

import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MoreActions from '../modal/MoreActions';
import { useState } from 'react';

type Props = {
  image: string | StaticImageData;
  name: string;
  category: CategoryTranslatedValue;
  datePutToSale: string;
  rating: number;
  price: number;
  stock: number;
}

const OrderProduct = ({
  image,
  name,
  category,
  datePutToSale,
  rating,
}:Props) => {

  const [moreActions, showMoreActions] = useState(false);  
  
  return (
    <>
    <div className={`relative ${productCardSetup.mainContainer}`}>
      <Image 
        src={image} 
        alt={name}
        className={productCardSetup.image}
        onClick={() => showMoreActions(false)}
      />
      <div className='absolute top-3 left-3 text-yellow-dark bg-yellow-100 w-fit py-1 px-3 rounded-2xl border border-yellow'>Não analisado</div>
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => showMoreActions(false)}>
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
            <h4 className='text-yellow-dark'>Nome do Cliente: <span className='text-cyan'>Clara Vidal</span></h4>
          </div>
          <div>
            <h4 className='text-gray'>Quantidade pedida: <span className='text-ui-stock'>123</span></h4>
            <h4 className='text-gray'>Estoque se aceito: <span className='text-ui-stock'>12</span></h4>
          </div>
          <h3 className='text-gray text-[23px]'>Comissão: <span className='text-ui-money'>R$ 456,90</span></h3>
        </div>
        <div className='flex gap-2 mt-1'>
          <Button
            onClick={() => showMoreActions(!moreActions)}
            style={`px-5 flex items-center justify-center ${
              moreActions
                ? '!bg-gray border-gray! text-white hover:bg-gray/15! hover:text-gray!'
                : buttonColorsScheme.gray
            }`}
            icon={FaChevronDown}
            iconStyle={`transition-transform duration-300 ${
              moreActions ? 'rotate-180' : 'rotate-0'
            }`}
          />
          <Button style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} label='Aprovado'/>
        </div>
      </div>
    </div>
    <MoreActions direction='left' style={{container: '-mt-3'}} moreActions={moreActions} close={() => showMoreActions(false)}>
      <Button label="Cancelar pedido" style={`px-5 ${buttonColorsScheme.red}`}/>
      <Button label="Cancelar pedido" style={`px-5 ${buttonColorsScheme.red}`}/>
    </MoreActions>
    </>
  )
  {/* <Button style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} label='Cancelado pelo cliente'/> */}
}

export default OrderProduct;