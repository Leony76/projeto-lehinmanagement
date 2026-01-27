"use client";

import Image, { StaticImageData } from 'next/image'
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

type Props = {
  userProduct: userProductDTO;
  onComment: () => void;
}

const MyProduct = ({
  userProduct,
  onComment,
}:Props) => {

  const [commentModal, showCommentModal] = useState(false);

  const datePutToSale = new Date(userProduct.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[userProduct.category];

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
        <div className={productCardSetup.priceStockContainer}>
          <span className={productCardSetup.price}>R$ {userProduct.price.toFixed(2).replace('.',',')}</span>
          <span className={productCardSetup.stock}>Em estoque: {userProduct.stock}</span>
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
        <Button type='button' style='mt-2 text-xl' label={"Mais Informações"} colorScheme={'primary'}/>
      </div>

      {/* ⇊ MODALS ⇊ */}

      <Modal 
        isOpen={commentModal}
        modalTitle={"Comentar produto"} 
        openedModal={showCommentModal}
        hasXClose
        style={{
          modalTitle: 'text-2xl',
          xClose: 'text-2xl px-1 border rounded-[50%]!'
        }}
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
    </div>
  )
}

export default MyProduct