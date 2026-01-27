"use client";

import Image, { StaticImageData } from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP, CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, staticButtonColorScheme } from '@/src/constants/systemColorsPallet';
import StaticButton from '../ui/StaticButton';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import React, { useState } from "react";
import MoreActions from '../modal/MoreActions';
import { UserOrderDTO } from '@/src/types/userOrderDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import Modal from '../modal/Modal';

type Props = {
  userOrder: UserOrderDTO;
}

const MyOrderProduct = ({
  userOrder,
}:Props) => {

  const [moreActions, showMoreActions] = useState(false);
  const datePutToSale = new Date(userOrder.createdAt).toLocaleDateString("pt-BR");
  const orderDate = new Date(userOrder.orderDate ?? 1).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[userOrder.category];

  const [payOrder, showPayOrder] = useState<boolean>(false);
  
  return (
    <div className={`relative ${productCardSetup.mainContainer}`}>
      <div className="relative aspect-square w-full">
        <Image 
          src={userOrder.imageUrl} 
          alt={userOrder.name}
          fill
          className={productCardSetup.image}
          onClick={() => showMoreActions(false)}
        />
      </div>
    {userOrder.orderPaymentStatus === 'PENDING' ? (
      <StaticButton 
        value={'Pagamento pendente'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.red}`}
      />
    ) : (
      <StaticButton 
        value={'Em análise'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.yellow}`}
      />
    )}
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => showMoreActions(false)}>

          <h3 className={productCardSetup.name}>{userOrder.name}</h3>
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
          <div>
            <h4 className='text-yellow-dark flex gap-1'>
              Data do pedido: 
              <span className='text-gray'>
                {orderDate}
              </span>
            </h4>
            <h4 className={`${productCardSetup.stock} flex gap-1`}>
              <span className='text-gray'>
                Quantidade pedida:
              </span> 
              {userOrder.orderAmount}
            </h4>
          </div>
          <h3 className='text-ui-money text-2xl truncate'>
            {formatCurrency(userOrder.orderTotalPrice)}
          </h3>
        </div>
        <div className='flex gap-2 mt-1'>
          <Button 
            type='button' 
            label='Pagar' 
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`}
            onClick={() => showPayOrder(true)}
          />

          <Button
            type='button'
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
        </div>
      </div>

      {/* ⇊ MODALS ⇊ */}

      <MoreActions direction='right' moreActions={moreActions} close={() => showMoreActions(false)}>
        <Button 
          type='button' 
          label="Cancelar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
        />
        <Button 
          type='button' 
          label="Cancelar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
        />
      </MoreActions>

      <Modal 
      isOpen={payOrder} 
      modalTitle={'Pagar pedido'} 
      onCloseModalActions={() => {
        showPayOrder(false);
      }}
      >
        <p>Foi Pedido: 
          <span>
            {formatCurrency(userOrder.orderTotalPrice)}
          </span>
          x
          <span>
            {userOrder.orderAmount}
          </span>
        </p>
      </Modal>
    </div>
  )
}

export default MyOrderProduct

{/* <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.green}`} value={'Aprovado'}/> */}
{/* <StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.yellow}`} value={'Pendente'}/>
<StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.red}`} value={'Cancelado'}/>
<StaticButton style={`flex-1 text-xl mt-1 ${staticButtonColorScheme.red}`} value={'Rejeitado'}/> */}