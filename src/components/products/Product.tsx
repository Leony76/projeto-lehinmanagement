'use client';

import { motion } from 'framer-motion';
import { FaInfo } from 'react-icons/fa6';
import { ProductDTO } from '@/src/types/productDTO';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import { useProductLogic } from '@/src/hooks/pageLogic/useProductLogic';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { productCardSetup } from '@/src/styles/Product/productCard.style';

import { productCardStyles as styles } from '@/src/styles/Product/productCard.style';

import RemoveProductJustify from '../modal/Product/RemoveProductJustify';
import EditProductJustify from '../modal/Product/EditProductJustify';
import ConfirmRemove from '../modal/Product/ConfirmRemove';
import ProductInfo from '../modal/Product/ProductInfo';
import EditProductForm from '../form/EditProductForm';
import OrderProduct from '../modal/OrderProduct';
import ImageExpand from '../modal/ImageExpand';
import Button from '../form/Button';
import Image from 'next/image'
import Modal from '../modal/Modal';
import { formattedDate } from '@/src/utils/formattedDate';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import WarningInfo from '../ui/WarningInfo';
import { LuMessageCircleWarning } from 'react-icons/lu';
import UserMessage from '../modal/Users/UserMessage';
import ConfirmAction from '../modal/Orders/ConfirmAction';

type Props = {
  item: ProductDTO;
}

const Product = ({
  item,
}:Props) => { 

  const { ...logic } = useProductLogic({ item });

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={styles.mainContentContainer}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
      <div className={styles.imageContainer}>
        <Image
          src={logic.product.imageUrl}
          alt={logic.product.name}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.productInfosContainer}>
        <h3 className={styles.name}>
          {logic.product.name}
        </h3>
        <div className={styles.category_date_ratingContainer}>
          <div className={styles.category_date}>
            <span>{logic.category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{logic.datePutToSale}</span>
          </div>
          <div className={styles.rating}>
            {!logic.product.averageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
            }
            {logic.product.averageRating ?? 'Não avaliado'}
          </div>
        {(logic.seller.role !== 'ADMIN') ? (       
          <div className={styles.sellerContainer}>
            <span className={styles.label}>
              Vendedor(a):
            </span> 
            {logic.seller.name === logic.user?.name
              ? getNameAndSurname(logic.seller.name) + ' (Você)'
              : getNameAndSurname(logic.seller.name)
            }
          </div>
        ) : (
          <div className={'text-cyan'}> 
            Ofertado pelo sistema
          </div>
        )}
        </div>
        <div className={styles.price_stockContainer}>
          {logic.product.stock > 0 ? (
            <span className={styles.stock.withStock}>
              <span className={productCardSetup.stockLabel}>
                Em estoque:
              </span> 
              {logic.product.stock}
            </span>
          ) : (
            <span className={styles.stock.withoutStock}>
              Sem estoque
            </span> 
          )}
          <div className={styles.price_productInfoContainer}>
            <span className={styles.price}>
              {formatCurrency(logic.product.price)}
            </span>
            <Button 
              type={'button'}
              icon={FaInfo}
              style='p-2 px-4'
              onClick={() => logic.setActiveModal('PRODUCT_INFO')}
            />
          </div>
        </div>

      {logic.product.status === 'REMOVED' &&
        <span className='text-red py-1 bg-linear-to-r from-transparent via-red/50 to-transparent text-center -mt-0.75 mb-1'>
          {logic.product.removed.by === 'ADMIN'
            ? 'Removido pelo sistema'
            : 'Removido por você'
          }
        </span>
      }

      {logic.product.status === 'REMOVED' && logic.product.removed.by === 'ADMIN' && 
        <div className='flex mb-1  gap-3'>
          <Button
            label='Ver motivo'
            type='button'
            style='flex-1'
            onClick={() => logic.setActiveModal('PRODUCT_REMOVE_JUSTIFY')}
          />
          {logic.product.removed.supportMessages.length > 0 &&
            <Button
              icon={LuMessageCircleWarning}
              type='button'
              style={`text-2xl px-3 ${buttonColorsScheme.yellow}`}
              onClick={() => logic.setActiveModal('PRODUCT_MESSAGES_SUPPORT')}
            />
          }
        </div>
      }
      
      {logic.canOrder ? (
        logic.available > 0 ? (
          <Button
            label="Fazer pedido"
            colorScheme="primary"
            onClick={() => logic.setActiveModal('ORDER_PRODUCT_MENU')}
            type="button"
          />
        ) : (
          <Button
            style={`pointer-events-none ${buttonColorsScheme.red}`}
            label="Indisponível"
            colorScheme="primary"
            type="button"
          />
        )
      ) : (
        <div className="flex gap-2">
          {(logic.product.status === 'REMOVED') ? ( 
            <Button
            type="button"
            label={`${logic.user?.role === 'ADMIN' 
              ? 'Ativar'
              : 'Repor'
            }`}
            style={`flex-1 dark:bg-green-500 ${buttonColorsScheme.green}`}
            onClick={() => {
              if (logic.user?.role === 'SELLER') {
                logic.setActiveModal('ACTIVE_PRODUCT_CONFIRM');
                return;
              }
              logic.setActiveModal('ACTIVE_PRODUCT')
            }}
            />           
          ) : (
            <Button
              type="button"
              label="Editar"
              style={`flex-1 dark:bg-yellow-500 ${buttonColorsScheme.yellow}`}
              onClick={() => {
                logic.setActiveModal('EDIT_PRODUCT');
                logic.setProductToBeEdited(logic.product);
              }}
            />
          )}

          {logic.product.status === 'ACTIVE' ? (
            <Button
              type="button"
              label="Remover"
              style={`flex-1 ${buttonColorsScheme.red}`}
              onClick={() => logic.setActiveModal('CONFIRM_REMOVE_PRODUCT')}
            />
          ) : (
            <Button
              type="button"
              label="Excluir"
              style={`flex-1 ${buttonColorsScheme.red}`}
              onClick={() => logic.setActiveModal('DELETE_PRODUCT_CONFIRM')}
            />
          )}
        </div>
      )}
      </div>

      {/* ⇊ MODALS ⇊ */}

      <ConfirmRemove
        loading={logic.loading}
        modal={{
          isOpen: logic.activeModal === 'CONFIRM_REMOVE_PRODUCT',
          onCloseActions: () => logic.setActiveModal(null),
        }}
        user={{ role: logic.user?.role }}
        onClick={{
          yes: () => {
            if (logic.user?.role === 'ADMIN') {
              logic.setActiveModal('REMOVE_PRODUCT_JUSTIFY');
              return;
            }
            logic.handleRemoveProduct();
          },
          no: () => logic.setActiveModal(null),
        }}
      />
      
      <RemoveProductJustify
        modal={{ 
          isOpen: logic.activeModal === 'REMOVE_PRODUCT_JUSTIFY',
          onCloseActions: () => logic.setActiveModal(null),
        }}
        onChange={{ textarea: (e) => {
          logic.setRemoveJustify(e.target.value);
          logic.setError('');
        }}}
        onClick={{ 
          cancel: () => logic.setActiveModal(null),
          confirm: () => {
            if (logic.user?.role === 'ADMIN' && !logic.removeJustify) {
              logic.setError('A justificativa de remoção é obrigatória');
              return;
            }
            logic.handleRemoveProduct();
          },
        }}
        product={{ sellerName: logic.seller.name ?? '[Desconhecido]' }}
        misc={{ 
          error: logic.error, 
          loading: logic.loading, 
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
          setActiveModal: logic.setActiveModal,
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

      <EditProductJustify
        modal={{
          isOpen: logic.activeModal === 'EDIT_JUSTIFY',
          onCloseActions: () => logic.setActiveModal('EDIT_PRODUCT'),
        }}
        edit={{
          onChange: { textArea: (e) => {
            logic.setEditJustify(e.target.value);
            logic.setError('');
          }},
          onClick: {
            toBack: () => {
              logic.setActiveModal('EDIT_PRODUCT');
              logic.setError('');
              logic.setEditJustify('');
            },
            toEdit: () => {
              if (!logic.editJustify) {
                logic.setError('A justificativa da edição não pode ser vazia');
                return;
              }
              logic.handleEditProduct();
            }
          }
        }}
        misc={{ 
          error: logic.error, 
          loading: logic.loading 
        }}
      />

      <ProductInfo
         modal={{
          isActive: logic.activeModal === 'PRODUCT_INFO',
          onCloseActions: () => logic.setActiveModal(null),
        }}
        product={{
          imageUrl: logic.product.imageUrl,
          name: logic.product.name,
          category: logic.category,
          description: logic.product.description ?? '[Sem descrição]',
          price: logic.product.price,
          stock: logic.product.stock,
          publishedAt: logic.product.createdAt,
          updatedAt: logic.product.updatedAt ?? 'Sem atualização',
          salesCount: logic.product.salesCount ?? 0,
          rating: logic.product.averageRating ?? 'Não avaliado',
        }}
        actions={{
          onImageClick: () => logic.setActiveModal('EXPAND_IMAGE'),
        }}
      />

      <ImageExpand
        modal={{
          isOpen: logic.activeModal === 'EXPAND_IMAGE',
          onCloseActions: () => logic.setActiveModal('PRODUCT_INFO'),
        }}
        image={{
          imageUrl: logic.product.imageUrl,
          name: logic.product.name,
        }}
      />

      <OrderProduct
        activeModal={logic.activeModal}
        selectedProduct={logic.product}
        setActiveModal={logic.setActiveModal} 
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
              {logic.product.removed.at 
                ? formattedDate(logic.product.removed.at)
                : '??/??/??'
              }
            </span>
          </span>
          <div>
            <label className='text-secondary-dark'>Justificativa:</label>
            <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>
              {logic.product.removed.justify}
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
          conversations={logic.product.removed.supportMessages}
          setSelectedConversation={logic.setSelectedConversation}
          setActiveModal={logic.setActiveModal as any}
        />
      </Modal>

      <Modal 
      isOpen={logic.activeModal === 'ACTIVE_PRODUCT'} 
      modalTitle={'Ativar produto'} 
      hasXClose
      onCloseModalActions={() => {
        logic.setActiveModal(null);
      }}>
        <p className='text-secondary'>
          Escreva a justificativa do porquê da ativação desse produto novamente.
        </p>
        <TextArea 
          placeholder={'Justificativa'}
          style={{
            input: `h-30 ${logic.error 
              ? 'shadow-[0px_0px_8px_red]'
              : ''
            }`,
            container: 'mb-[-7px]'
          }}
          maxLength={250}
          onChange={(e) => {
            logic.setReactivateProductJustify(e.target.value);
            logic.setError('');
          }}
          value={logic.reactivateProductJustify}   
          colorScheme='primary'    
        />
        
        {logic.error && <Error error={logic.error}/>}

        <Button 
          type={'button'}
          label='Prosseguir'
          style='mt-1'
          onClick={() => {
            if (!logic.reactivateProductJustify) {
              logic.setError('A justificativa não pode ser vazia');
              return;
            }
            logic.setError('');
            logic.setActiveModal('ACTIVE_PRODUCT_CONFIRM');
          }}
        />
      </Modal>
      
      <ConfirmAction
        isOpen={
          logic.activeModal === 'ACTIVE_PRODUCT_CONFIRM' 
          || logic.activeModal === 'DELETE_PRODUCT_CONFIRM'        
        }
        loading={logic.loading}
        onAccept={{handleSubmit: logic.activeModal === 'ACTIVE_PRODUCT_CONFIRM' 
          ? logic.handleReactiveProduct
          : logic.handleDeleteProduct
        }}
        decision={'ACCEPT'}
        customSentence={{
          title: 'Confirmar ação',
          sentence: logic.activeModal === 'ACTIVE_PRODUCT_CONFIRM' 
            ? logic.user?.role === 'ADMIN' 
              ? `Tem certeza que deseja reativar esse produto do vendedor ${logic.seller.name}?`
              : `Tem certeza que deseja reativar esse produto?`
            : logic.user?.role === 'ADMIN'
              ? `Tem certeza que deseja deletar esse produto do vendedor ${logic.seller.name}?`
              : `Tem certeza que deseja deletar esse produto?`
        }}
        isActionIrreversible
        hasWarning={logic.user?.role === 'ADMIN' || logic.activeModal === 'DELETE_PRODUCT_CONFIRM'}
        onCloseActions={() => {
          if (logic.user?.role === 'ADMIN' && logic.activeModal === 'ACTIVE_PRODUCT_CONFIRM') {
            logic.setActiveModal('ACTIVE_PRODUCT')
            return;
          }
          logic.setActiveModal(null);
        }}
      />
    </motion.div>
  )
}

export default Product

