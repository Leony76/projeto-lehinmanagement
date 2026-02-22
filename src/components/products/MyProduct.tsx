"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { UserProductOrdersFilterValue } from '@/src/constants/generalConfigs';
import { AiOutlineMessage } from 'react-icons/ai';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { BoughtProduct, FiltrableUserProduct } from '@/src/types/userProductDTO';
import Rating from '../ui/Rating';
import { FaRegTrashCan } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import UserProductMenu from '../modal/Orders/UserProductMenu';
import { productCardStyles as style } from '@/src/styles/Product/productCard.style';
import ImageExpand from '../modal/ImageExpand';
import RemoveUserProduct from '../modal/Orders/RemoveUserProduct';
import ProductComment from '../modal/Product/ProductComment';
import { useUserProductLogic } from '@/src/hooks/pageLogic/useUserProductLogic';
import ProductInfo from '../modal/Product/ProductInfo';
import EditProductForm from '../form/EditProductForm';
import { ProductDTO } from '@/src/types/productDTO';
import Modal from '../modal/Modal';
import { LuMessageCircleWarning } from 'react-icons/lu';
import { formattedDate } from '@/src/utils/formattedDate';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import WarningInfo from '../ui/WarningInfo';
import UserMessage from '../modal/Users/UserMessage';

type Props = {
  userProduct: FiltrableUserProduct;
}

const MyProduct = ({
  userProduct,
}:Props) => {

  const { ...logic } = useUserProductLogic({ userProduct });

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={style.mainContentContainer}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
      <div className={style.imageContainer}>
        <Image 
          src={logic.productData.imageUrl} 
          alt={logic.productData.name}
          fill
          className={style.image}
        />
      </div>
      <div className={style.productInfosContainer}>
        <h3 className={style.name}>{logic.productData.name}</h3>
        <div className={style.category_date_ratingContainer}>

          {!logic.isPublished && 
            <div className={style.category_date}>
              <span>{logic.category}</span>
              <span className="text-[10px] text-gray-400">●</span>
              <span>{logic.datePutToSale}</span>
            </div>
          }

          {!logic.isPublished && (
            <div className={style.rating}>
              {!(userProduct as BoughtProduct).productAverageRating 
                ? <IoStarOutline/>
                : <IoStar/> 
              }
              {(userProduct as BoughtProduct).productAverageRating ?? 'Não avaliado'}
            </div>
          )}

        </div>
        <div className={style.rating_commentContainer}>

          {!logic.isPublished && 
            <Rating 
              value={logic.rating}
              onChange={logic.setRating}
            />
          }

          <div className={logic.rating !== 0 
            ? style.rate.rated 
            : style.rate.notRated
          }>

          {!logic.isPublished &&
            <Button
              type="button"
              onClick={() => logic.setActiveModal('COMMENT')}
              icon={AiOutlineMessage}
              style={`px-5 text-2xl ${buttonColorsScheme.yellow}`}
            />
          }
          </div>
        </div>

        {logic.isPublished && logic.userProductForSale.status === 'REMOVED' &&
          <span className='text-red py-1 bg-linear-to-r from-transparent via-red/50 to-transparent text-center -mt-0.75 mb-1'>
            {logic.userProductForSale.removed.by === 'ADMIN'
              ? 'Removido pelo sistema'
              : 'Removido por você'
            }
          </span>
        }

        {logic.isPublished && logic.userProductForSale.status === 'REMOVED'
        && logic.userProductForSale.removed.by === 'ADMIN' && 
          <div className='flex mb-1  gap-3'>
            <Button
              label='Ver motivo'
              type='button'
              colorScheme='primary'
              style='flex-1'
              onClick={() => logic.setActiveModal('PRODUCT_REMOVE_JUSTIFY')}
            />
            {(logic.productData as ProductDTO['product']).removed.supportMessages.length > 0 &&
              <Button
                icon={LuMessageCircleWarning}
                type='button'
                style={`text-2xl px-3 ${buttonColorsScheme.yellow}`}
                onClick={() => logic.setActiveModal('PRODUCT_MESSAGES_SUPPORT')}
              />
            }
          </div>
        }

        <div className={`flex gap-2 ${!logic.isPublished ? 'mt-2' : ''}`}>
          <Button 
            type='button' 
            style={style.moreInfosButton} 
            label={"Mais Informações"} 
            onClick={() => {
              if (!logic.isPublished) {
                logic.setActiveModal('USER_PRODUCT_INFO');
                return;
              }
              logic.setActiveModal('PRODUCT_INFO');
            }}
          />
          
          {!logic.isPublished &&
            <Button 
              style={style.removeProductButton}
              type={'submit'}            
              icon={FaRegTrashCan}
              onClick={() => logic.setActiveModal('REMOVE_PRODUCT_FROM_INVENTORY_CONFIRM')}
            />
          }
        </div>

        {logic.isPublished &&
          <div className="flex gap-2 mt-1">
            {logic.userProductForSale.status === 'REMOVED' && logic.userProductForSale.removed.by === 'SELLER' &&
              <Button
                type="button"
                label="Repor"
                style={`flex-1 dark:bg-green-500 ${buttonColorsScheme.green}`}
                onClick={() => logic.setActiveModal('REACTIVE_PRODUCT_CONFIRM')}
              />
            }

            <Button
              type="button"
              label="Editar"
              style={`flex-1 dark:bg-yellow-500 ${buttonColorsScheme.yellow}`}
              onClick={() => {
                logic.setActiveModal('EDIT_PRODUCT');
                logic.setProductToBeEdited(logic.productData as ProductDTO['product']);
              }}
            />

            {logic.userProductForSale.status === 'REMOVED' ? (
              <Button
                type="button"
                label="Excluir"
                style={`flex-1 ${buttonColorsScheme.red}`}
                onClick={() => logic.setActiveModal('DELETE_PRODUCT_FOR_SALE_CONFIRM')}
              />
            ) : (
              <Button
                type="button"
                label="Remover"
                style={`flex-1 ${buttonColorsScheme.red}`}
                onClick={() => logic.setActiveModal('REMOVE_PRODUCT_FOR_SALE_CONFIRM')}
              />
            )}
          </div>
        }
      </div>

    {/* ⇊ MODALS ⇊ */}

      <UserProductMenu
        isOpen={logic.activeModal === 'USER_PRODUCT_INFO'}
        onCloseActions={() => logic.setActiveModal(null)}
        onImageClick={() => logic.setActiveModal('EXPAND_IMAGE')}
        product={{
          imageUrl: logic.productData.imageUrl,
          name: logic.productData.name,
          category: logic.productData.category,
          description: logic.productData.description ?? '[Sem descrição]',
          price: logic.productData.price,
        }}
        orders={
          !logic.isPublished 
          ? (userProduct as BoughtProduct).orders.map(order => ({
              id: order.id,
              orderedAmount: order.items.reduce((sum, item) => sum + item.quantity, 0),
              orderDate: order.acceptedAt ?? '',
              orderTotalPrice: order.total,
            }))
          : [] 
        }
        search={{
          order: logic.orderSearch,
          filter: logic.orderFilter ?? 'most_recent',
          onSearch: (e) => logic.setOrderSearch(e.target.value),
          onFilter: (e) => logic.setOrderFilter(e.target.value as UserProductOrdersFilterValue),
          onClearSearch: () => logic.setOrderSearch(''),
        }}
      />

      <ProductComment
        isOpen={logic.activeModal === 'COMMENT'}
        onCloseActions={() => {
          logic.setActiveModal(null);
          logic.setError('');
        }}
        onChange={{ textArea: (e) =>  {
          logic.setProductComment(e.target.value);
          logic.setError('');
        }}}
        onClick={{ comment: () =>  {
          if (!logic.productComment) {
            logic.setError('Não se pode mandar um comentário vazio');
          } else {
            logic.handleCommentRatingProduct();
            logic.setActiveModal(null);
          }
        }}}
        hasReview={!logic.isPublished ? (userProduct as BoughtProduct).hasReview : false}
        misc={{ error: logic.error }}

      />

      <ImageExpand modal={{
          isOpen: logic.activeModal === 'EXPAND_IMAGE',
          onCloseActions: () => logic.setActiveModal('USER_PRODUCT_INFO'),
        }} image={{
          imageUrl: logic.productData.imageUrl,
          name: logic.productData.name
        }}
      />

      <ImageExpand modal={{
          isOpen: logic.activeModal === 'PRODUCT_INFO_IMAGE_EXPAND',
          onCloseActions: () => logic.setActiveModal('PRODUCT_INFO'),
        }} image={{
          imageUrl: logic.productData.imageUrl,
          name: logic.productData.name
        }}
      />

      <RemoveUserProduct
        isOpen={logic.activeModal === 'REMOVE_PRODUCT_FROM_INVENTORY_CONFIRM'}
        onCloseActions={() => logic.setActiveModal(null)}
        loading={logic.loading}
        onClick={{
          yes: () => logic.handleRemoveUserProductFromInventory(),
          no: () => logic.setActiveModal(null),
        }}
      />

      <RemoveUserProduct
        isOpen={logic.activeModal === 'REMOVE_PRODUCT_FOR_SALE_CONFIRM'}
        onCloseActions={() => logic.setActiveModal(null)}
        loading={logic.loading}
        onClick={{
          yes: () => logic.handleRemoveUserProductForSale(),
          no: () => logic.setActiveModal(null),
        }}
      />

      <ProductInfo
        modal={{
          isActive: logic.activeModal === 'PRODUCT_INFO',
          onCloseActions: () => {
            logic.setActiveModal(null);
          }
        }}
        product={{
          imageUrl: logic.productData.imageUrl,
          name: logic.productData.name,
          category: logic.category,
          description: logic.productData.description ?? '[Sem comentário]',
          price: logic.productData.price,
          stock: logic.productData.stock,
          salesCount: logic.isPublished 
            ? (userProduct as ProductDTO).product.salesCount ?? 0
            : (userProduct as BoughtProduct).orders?.reduce((acc: number, curr: any) => acc + curr.items.length, 0) ?? 0,
          publishedAt: logic.isPublished 
            ? (userProduct as ProductDTO).product.createdAt
            : (userProduct as BoughtProduct).createdAt,

          updatedAt: logic.isPublished 
            ? ((userProduct as ProductDTO).product.updatedAt ?? (userProduct as ProductDTO).product.createdAt)
            : (userProduct as BoughtProduct).createdAt,
          rating: logic.isPublished 
            ? (logic.productData as ProductDTO['product']).averageRating
            : 1
        }}
        actions={{
          onImageClick: () => logic.setActiveModal('PRODUCT_INFO_IMAGE_EXPAND'),
        }}
      />

      <EditProductForm
        isOpen={logic.activeModal === 'EDIT_PRODUCT'}
        productToBeEdited={logic.productToBeEdited}
        onCloseActions={() => {
          logic.setActiveModal(null)
          logic.setProductToBeEdited(null);
          logic.setPreview(null);
        }}
        actions={{
          handleEditProduct: logic.handleEditProduct,
          setActiveModal: logic.setActiveModal as any,
          setFormData: logic.setFormData,
        }}
        imageProps={{
          imageFile: logic.imageFile,
          fileInputRef: logic.fileInputRef,
          preview: logic.preview,
          imageError: logic.imageError,
          setImageFile: logic.setImageFile,
          setPreview: logic.setPreview,
          setImageError: logic.setImageError,
        }}
      />

      <Modal 
      isOpen={logic.activeModal === 'EDIT_PRODUCT_CONFIRM'} 
      modalTitle={'Editar produto'} 
      onCloseModalActions={() => {
        logic.setActiveModal('EDIT_PRODUCT');
      }}
      >
        <p className='text-secondary-dark'>
          Tem certeza que deseja editar esse produto ?
        </p>
        <div className='flex gap-3 text-lg'>
          <Button 
            type={'submit'}
            label='Sim'
            loading={logic.loading}
            loadingLabel='Processando'
            style={`${buttonColorsScheme.green} flex-1`}
            onClick={logic.handleEditProduct}
          />
          <Button 
            type={'submit'}
            label='Não'
            style={`${buttonColorsScheme.red} flex-1`}
            onClick={() => {
              logic.setActiveModal('EDIT_PRODUCT');
            }}
          />
        </div>
      </Modal>

      <Modal
      isOpen={logic.activeModal === 'PRODUCT_REMOVE_JUSTIFY'} 
      modalTitle={'Justificativa'} 
      hasXClose
      onCloseModalActions={() => {
        logic.setActiveModal(null);
      }}
      >
        <>
          <span className='text-gray flex gap-2'>
            Removido em:
            <span className='text-yellow'>
              {logic.userProductForSale.removed?.at !== undefined 
                ? formattedDate(logic.userProductForSale.removed.at)
                : '??/??/??'
              }
            </span>
          </span>
          <div>
            <label className='text-secondary-dark'>Justificativa:</label>
            <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>
              {logic.userProductForSale.removed?.justify}
            </p>
          </div>
        </>
        {logic.user?.role === 'SELLER' &&
          <Button
            type='button'
            label='Entrar em contato com suporte'
            onClick={() => logic.setActiveModal('MESSAGE_TO_SUPPORT')}
          />
        }
      </Modal>

      <Modal 
      isOpen={logic.activeModal === 'MESSAGE_TO_SUPPORT'} 
      modalTitle={'Mensagem ao suporte'} 
      hasXClose
      onCloseModalActions={() => {
        logic.setActiveModal('PRODUCT_REMOVE_JUSTIFY');
        logic.setSupportMessage('');
        logic.setError('');
      }}>
        <p className='text-secondary'>
          Escreva o que deseja que o suporte possa reanalizar para poder reverter a situção do seu produto removido.
        </p>
        <TextArea 
          placeholder={'Mensagem'}
          style={{
            input: `h-30 ${logic.error 
              ? 'shadow-[0px_0px_8px_red]'
              : ''
            }`,
            container: 'mb-[-7px]'
          }}
          maxLength={500}
          onChange={(e) => {
            logic.setSupportMessage(e.target.value);
            logic.setError('');
          }}
          value={logic.supportMessage}   
          colorScheme='primary'    
        />
        
        {logic.error && <Error error={logic.error}/>}

        <Button 
          type={'button'}
          label='Enviar'
          style='mt-1'
          onClick={() => {
            if (!logic.supportMessage) {
              logic.setError('A mensagem não pode ser vazia');
              return;
            }
            logic.setActiveModal('MESSAGE_TO_SUPPORT_CONFIRM');
          }}
        />
      </Modal>

      <Modal 
      isOpen={logic.activeModal === 'MESSAGE_TO_SUPPORT_CONFIRM'} 
      modalTitle={'Confirmar ação'} 
      hasXClose
      onCloseModalActions={() => {
        logic.setActiveModal('MESSAGE_TO_SUPPORT');
        logic.setError('');
      }}>
        <p className='text-secondary'>
          Tem certeza que deseja mandar essa mensagem ?
        </p>
        
        <WarningInfo
          text='Nossa equipe irá responder ao seu apelo o mais rápido e transparente possível. A mensagem de retorno ficará disponível para ser visualizada no cartão do seu produto.'
        />

        <div className='flex gap-3 text-lg'>
          <Button 
            type={'submit'}
            label='Sim'
            loading={logic.loading}
            loadingLabel='Processando'
            style={`${buttonColorsScheme.green} flex-1`}
            onClick={logic.handleSendMessageToSupport}
          />
          <Button 
            type={'submit'}
            label='Não'
            style={`${buttonColorsScheme.red} flex-1`}
            onClick={() => {
              logic.setActiveModal('MESSAGE_TO_SUPPORT');
              logic.setError('');
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={logic.activeModal === 'PRODUCT_MESSAGES_SUPPORT'} 
      modalTitle={'Mensagens'} 
      hasXClose
      onCloseModalActions={() => {
        logic.setActiveModal(null);
      }}>
        <UserMessage
          type='USER_MESSAGE'
          conversations={logic.userProductForSale.removed?.supportMessages}
          setSelectedConversation={logic.setSelectedConversation}
          setActiveModal={logic.setActiveModal as any}
        />
      </Modal>

      <Modal 
      isOpen={
        logic.activeModal === 'REACTIVE_PRODUCT_CONFIRM'
        || logic.activeModal === 'DELETE_PRODUCT_FOR_SALE_CONFIRM'
      } 
      modalTitle={logic.activeModal === 'REACTIVE_PRODUCT_CONFIRM' 
        ? 'Repor produto'
        : 'Excluir produto'
      } 
      hasXClose
      onCloseModalActions={() => logic.setActiveModal(null)}>
        <p className='text-secondary'>
          {logic.activeModal === 'REACTIVE_PRODUCT_CONFIRM' 
            ? 'Tem certeza em repor esse produto ?'
            : 'Tem certeza em excluir esse produto ?'
          }         
        </p>

        <div className='flex gap-3 text-lg'>
          <Button 
            type={'submit'}
            label='Sim'
            loading={logic.loading}
            loadingLabel='Processando'
            style={`${buttonColorsScheme.green} flex-1`}
            onClick={() => {
              if (logic.activeModal === 'REACTIVE_PRODUCT_CONFIRM') {
                logic.handleReactivateProduct(logic.userProductForSale.id);
                return;
              }
              logic.handleDeleteProduct();
            }}
          />
          <Button 
            type={'submit'}
            label='Não'
            style={`${buttonColorsScheme.red} flex-1`}
            onClick={() => {
              if (logic.activeModal === 'REACTIVE_PRODUCT_CONFIRM') {
                logic.setActiveModal('MESSAGE_TO_SUPPORT');
                logic.setError('');
                return;
              }
              logic.setActiveModal(null);
            }}
          />
        </div>
      </Modal>
    </motion.div>
  )
}

export default MyProduct