"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP, CategoryTranslatedValue } from '@/src/constants/generalConfigs';
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import { UserProductDTO } from '@/src/types/UserProductDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { lockScrollY } from '@/src/utils/lockScrollY';
import Rating from '../ui/Rating';
import { useToast } from '@/src/contexts/ToastContext';
import { rateCommentProduct, removeProduct } from '@/src/actions/productActions';
import Error from '../ui/Error';
import { FaRegTrashCan } from 'react-icons/fa6';
import { motion } from 'framer-motion';

type Props = {
  userProduct: UserProductDTO;
}

const MyProduct = ({
  userProduct,
}:Props) => {

  const { showToast } = useToast();

  const [commentModal, showCommentModal] = useState<boolean>(false);
  const [userProductInfo, showUserProductInfo] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [removeProductConfirm, showRemoveProductConfirm] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  const [productComment, setProductComment] = useState<string>('');

  const [rating, setRating] = useState<number>(userProduct.productRating);

  const datePutToSale = new Date(userProduct.createdAt).toLocaleDateString("pt-BR");
  const orderAcceptedAt = new Date(userProduct.orderAcceptedAt ?? 1).toLocaleDateString("pt-BR");

  const category = CATEGORY_LABEL_MAP[userProduct.category];

  lockScrollY(userProductInfo || expandImage || commentModal);

  const handleCommentRatingProduct = async() => {
    if (rating === 0) return;

    try {
      await rateCommentProduct(
        userProduct.id,
        rating,
        productComment,
      );

      if (rating !== userProduct.productRating) {
        showToast('Produto avaliado', 'info');
      } if (productComment) {
        showToast('Seu comentário sobre o produto foi ao ar', 'info');
        setProductComment('');
      }
    } catch (err:unknown) { 
      showToast('Houve um erro: ' + err, 'error');
    } 
  }

  const handleRemoveUserProduct = async() => {
    try {
      await removeProduct(
        userProduct.id,
        ''
      );

      showToast('Produto removido com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Erro: ' + err, 'error');
    } finally {
      showRemoveProductConfirm(false);
    }
  }

  useEffect(() => {
    handleCommentRatingProduct();
  },[rating]);

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={`relative ${productCardSetup.mainContainer}`}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
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
            {!userProduct.productAverageRating 
            ? <IoStarOutline/>
            : <IoStar/> 
            }
            {userProduct.productAverageRating ?? 'Não avaliado'}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Rating 
            value={rating}
            onChange={setRating}
          />
          <div className={`transition-all duration-300 ease-out
            ${rating !== 0 
              ? 'opacity-100 translate-x-0 pointer-events-auto' 
              : 'opacity-0 translate-x-3 pointer-events-none'}
          `}>
            <Button
              type="button"
              onClick={() => showCommentModal(true)}
              icon={AiOutlineMessage}
              style={`px-5 text-2xl ${buttonColorsScheme.yellow}`}
            />
          </div>
        </div>
        <div className='flex mt-2 gap-2'>
          <Button 
            type='button' 
            style='text-lg flex-5' 
            label={"Mais Informações"} 
            onClick={() => showUserProductInfo(true)}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'submit'}            
            icon={FaRegTrashCan}
            onClick={() => showRemoveProductConfirm(true)}
          />
        </div>
      </div>

      {/* ⇊ MODALS ⇊ */}

      <Modal 
      isOpen={commentModal}
      modalTitle={"Comentar produto"} 
      onCloseModalActions={() => {
        showCommentModal(false);
        setError('');
      }}
      hasXClose
      >
        <p className={`text-[15px] ${textColors.secondaryDark}`}>
          Deixe um comentário público acerca do que você achou do produto que pediu!
        </p>
        <TextArea 
          style={{input: `h-30 ${error ? 'shadow-[0px_0px_5px_red] mb-[-1px]' : ''}`}} 
          colorScheme='primary' 
          placeholder={'Deixe seu comentário...'}
          onChange={(e) => {
            setProductComment(e.target.value);
            setError('');
          }}
        />
        {userProduct.hasReview && !error && 
          <p className='text-sm text-yellow-dark -mt-2'>
            (!) Você já teçou um comentário a esse produto. O novo que você der sobrescreverá o seu atual.
          </p>
        }
        {error && 
          <Error error={error}/>
        }
        <Button 
          type='button'
          style='mt-1 text-xl' 
          colorScheme='secondary' 
          label='Comentar'
          onClick={() => {
            if (!productComment) {
              setError('Não se pode mandar um comentário vazio');
            } else {
              handleCommentRatingProduct();
              showCommentModal(false);
            }
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

      <Modal 
      isOpen={removeProductConfirm} 
      modalTitle={'Excluir produto'} 
      onCloseModalActions={() => {
        showRemoveProductConfirm(false);
      }}
      >
        <p className='text-secondary-dark'>
          Tem certeza que deseja excluir esse produto ?
        </p>
        <p className='text-yellow-dark'> 
          (!) Essa ação é inrreversível
        </p>
        <div className='flex gap-3 text-lg'>
          <Button 
            type={'submit'}
            label='Sim'
            style={`${buttonColorsScheme.green} flex-1`}
            onClick={handleRemoveUserProduct}
          />
          <Button 
            type={'submit'}
            label='Não'
            style={`${buttonColorsScheme.red} flex-1`}
            onClick={() => showRemoveProductConfirm(false)}
          />
        </div>
      </Modal>
    </motion.div>
  )
}

export default MyProduct