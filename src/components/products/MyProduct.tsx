"use client";

import Image from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP, CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { IoIosStarOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { useState } from 'react';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import { userProductDTO } from '@/src/types/userProductDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { lockScrollY } from '@/src/utils/lockScrollY';

type Props = {
  userProduct: userProductDTO;
  onComment: () => void;
}

const MyProduct = ({
  userProduct,
  onComment,
}:Props) => {

  const [commentModal, showCommentModal] = useState<boolean>(false);
  const [userProductInfo, showUserProductInfo] = useState<boolean>(false);

  const datePutToSale = new Date(userProduct.createdAt).toLocaleDateString("pt-BR");
  const orderAcceptedAt = new Date(userProduct.orderAcceptedAt ?? 1).toLocaleDateString("pt-BR");
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const category = CATEGORY_LABEL_MAP[userProduct.category];

  lockScrollY(userProductInfo || expandImage || commentModal);

  return (
    <div className={productCardSetup.mainContainer}>
      <div className="relative aspect-square w-full">
        <Image 
          src={userProduct.imageUrl} 
          alt={userProduct.name}
          fill
          className={productCardSetup.image}
        />
      </div>
      <div className={productCardSetup.infosContainer}>
        <h3 className={productCardSetup.name}>{userProduct.name}</h3>
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
        <div className='flex justify-between items-center'>
          <div className='flex xl:text-[27px] text-4xl gap-1 text-yellow'>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
            <IoIosStarOutline/>
          </div>
          <Button type='button' onClick={() => showCommentModal(true)} icon={AiOutlineMessage} style={`px-5 text-2xl ${buttonColorsScheme.yellow}`}/>
        </div>
        <Button 
          type='button' 
          style='mt-2 text-xl' 
          label={"Mais Informações"} 
          colorScheme={'primary'}
          onClick={() => showUserProductInfo(true)}
        />
      </div>

      {/* ⇊ MODALS ⇊ */}

      <Modal 
      isOpen={commentModal}
      modalTitle={"Comentar produto"} 
      onCloseModalActions={() => {
        showCommentModal(false);
      }}
      hasXClose
      >
        <p className={`text-[15px] ${textColors.secondaryDark}`}>
          Deixe um comentário público acerca do que você achou do produto que pediu!
        </p>
        <TextArea style={{input: 'h-30'}} colorScheme='primary' placeholder={'Deixe seu comentário...'}/>
        <Button 
          type='button'
          style='mt-1 text-xl' 
          colorScheme='secondary' 
          label='Comentar'
          onClick={() => {
            onComment();
            showCommentModal(false);
          }}
        />
      </Modal>

      <Modal 
      isOpen={userProductInfo} 
      modalTitle={'Informações'}
      hasXClose 
      onCloseModalActions={() => {
        showUserProductInfo(false);
      }}
      >
        <div className='flex sm:flex-row h-full sm:max-h-full max-h-[70vh] overflow-y-auto h flex-col gap-5 mt-2'>
          <div className='flex-1 relative aspect-square'>
            <Image 
              src={userProduct.imageUrl} 
              alt={userProduct.name}            
              fill
              className='rounded-2xl object-cover aspect-square cursor-zoom-in'
              onClick={() => {
                setExpandImage(true);
                showUserProductInfo(false);
              }}
            />
          </div>
          <div className='flex bg-primary-ultralight/25 p-2 rounded-2xl flex-col gap-1.5 flex-2'>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Nome
              </label>
              <span className='text-secondary-dark'>
                {userProduct.name}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Categoria
              </label>
              <span className='text-secondary-dark'>
                {category}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Descrição
              </label>
              <span className='h-30 overflow-y-auto  
              hover:scrollbar-thumb-primary-light
              scrollbar-thumb-primary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin text-secondary-dark flex-col'>
                {userProduct.description}
              </span>
            </div>
            <div className='flex sm:flex-row flex-col gap-2 sm:text-sm text-base'>
              <div className='flex flex-1 justify-between gap-2'>
                <div className='flex flex-1 flex-col '>
                  <label className='text-primary-middledark font-bold'>
                    Preço unitário
                  </label>
                  <span className='text-secondary-dark'>
                    {formatCurrency(userProduct.price)}
                  </span>
                </div>
                <div className='flex flex-1  flex-col'>
                  <label className='text-primary-middledark font-bold'>
                    Total pago
                  </label>
                  <span className='text-secondary-dark'>
                    {formatCurrency(userProduct.orderTotalPrice)}
                  </span>
                </div>
              </div>
              <div className='flex flex-1 justify-between gap-4'>
                <div className='flex flex-1 flex-col'>
                  <label className='text-primary-middledark font-bold'>
                    Unidades pedidas
                  </label>
                  <span className='text-secondary-dark'>
                    {userProduct.orderedAmount}
                  </span>
                </div>
                <div className='flex flex-1 flex-col'>
                  <label className='text-primary-middledark font-bold'>
                   Pedido em
                  </label>
                  <span className='text-secondary-dark'>
                    {datePutToSale}
                  </span>
                </div>
              </div>
              <div className='flex flex-col'>
                <label className='text-primary-middledark font-bold'>
                  Aceito em
                </label>
                <span className='text-secondary-dark'>
                  {orderAcceptedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
      isOpen={expandImage} 
      modalTitle={''} 
      onCloseModalActions={() => {
        setExpandImage(false);
        showUserProductInfo(true);
      }}>
        <div className='relative aspect-square h-[90vh]'>
          <Image 
            src={userProduct.imageUrl} 
            alt={userProduct.name}            
            fill
            className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
            onClick={() => {
              setExpandImage(false);
              showUserProductInfo(true);
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default MyProduct