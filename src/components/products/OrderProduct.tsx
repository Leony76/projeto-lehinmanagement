"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardStyles as style } from '@/src/styles/Product/productCard.style';
import { OrderFilterValue } from '@/src/constants/generalConfigs';
import { ProductWithOrdersDTO } from '@/src/types/ProductWithOrdersDTO';
import { motion } from 'framer-motion';
import OrderStatusLabel from '../ui/OrderStatusLabel';
import ConfirmAction from '../modal/Orders/ConfirmAction';
import RejectionJustify from '../modal/Orders/RejectionJustify';
import JustifyAboutOrderSituation from '../modal/Orders/JustifyAboutOrderSituation';
import ResetProductStock from '../modal/Orders/ResetProductStock';
import OrdersFromProductsMenu from '../modal/Orders/OrdersFromProductsMenu';
import ImageExpand from '../modal/Orders/ImageExpand';
import { useOrderLogic } from '@/src/hooks/pageLogic/useOrderLogic';

type Props = {
  product: ProductWithOrdersDTO;
}

const OrderProduct = ({product}:Props) => {

  const {
    error,
    loading,
    category,
    ordersStats,
    activeModal,
    orderSearch,
    orderFilter,
    selectedOrder,
    datePutToSale,
    filteredOrders,
    newProductStock,
    moreActionsOrderId,
    newOrderRejectionJustify,
    messageAboutCustomerOrderSituation,
    handleSendMessageAboutCustomerOrderSituation,
    setMessageAboutCustomerOrderSituation,
    handleEditOrderRejectionJustify,
    setNewOrderRejectionJustify,
    handleUpdateProductStock,
    handleMoreActionsOpen,
    setMoreActionsOrderId,
    setRejectionJustify,
    setNewProductStock,
    handleAcceptOrder,
    handleRejectOrder,
    handleRemoveOrder,
    setOrderSearch,
    setOrderFilter,
    setActiveModal,
    selectOrder,
    setError,
  } = useOrderLogic({ product });

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={`relative ${style.mainContentContainer}`}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
      
    >
      <div className="relative aspect-square w-full">
        <Image 
          src={product.imageUrl} 
          alt={product.name}
          fill
          className={style.image}
          onClick={() => setMoreActionsOrderId(null)}
        />
      </div>
      <div className={style.productInfosContainer}>
        <div onClick={() => setMoreActionsOrderId(null)}>
          <h3 className={style.name}>{product.name}</h3>
          <div className={style.category_date_ratingContainer}>
            <div className={style.category_date}>
              <span>{category}</span>
              <span className="text-[10px] text-gray-400">●</span>
              <span>{datePutToSale}</span>
            </div>
            <div className={style.rating}>
              {!product.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
              }
              {product.productAverageRating ?? 'Não avaliado'}
            </div>
            <div className='flex flex-col'>
              <OrderStatusLabel 
                statusLabel={'Aprovados'}
                status={ordersStats.approved} 
              />
              <OrderStatusLabel 
                statusLabel={'Pendentes'}
                status={ordersStats.pending} 
              />
              <OrderStatusLabel 
                statusLabel={'Cancelados'}
                status={ordersStats.canceled} 
              />
              <OrderStatusLabel 
                statusLabel={'Rejeitados'}
                status={ordersStats.rejected} 
              />
              <OrderStatusLabel 
                statusLabel={'Não pagos'}
                status={ordersStats.notPaid} 
              />            
              <OrderStatusLabel 
                statusLabel={'Total'}
                status={ordersStats.total} 
              />                 
            </div>
          </div>        
          <Button
            type='button'
            label='Ver pedidos'
            colorScheme='primary'
            style='w-full text-xl mt-2'
            onClick={() => setActiveModal('ORDERS_FROM_PRODUCT')}
          />        
        </div>       
      </div>
      
      {/* ================================================== */}
      {/* ================== ⇊ MODALS ⇊ =================== */}
      {/* ================================================== */}

      {/* ACCEPT ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={activeModal === 'ACCEPT_ORDER_CONFIRM'} 
        hasWarning
        isActionIrreversible
        decision={'ACCEPT'} 
        loading={loading} 
        onAccept={{
          handleSubmit: handleAcceptOrder
        }}
        order={{
          customerName: selectedOrder?.orderCustomerName ?? '[Desconhecido]',
          commission: selectedOrder?.orderComission ?? 0,
          amount: selectedOrder?.orderedAmount ?? 1,
        }}
        onCloseActions={() => {
          setMoreActionsOrderId(null);
          setActiveModal(loading 
            ? 'ACCEPT_ORDER_CONFIRM' 
            : 'ORDERS_FROM_PRODUCT');
        }} 
      />

      {/* REJECT ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={activeModal === 'REJECT_ORDER_CONFIRM'} 
        hasWarning
        decision={'REJECT'} 
        loading={loading} 
        onReject={{
          handleSubmit: handleRejectOrder,
          error: error,
          onChange: (e) => {
            setRejectionJustify(e.target.value);
            setError('');
          }
        }}
        order={{
          customerName: selectedOrder?.orderCustomerName ?? '[Desconhecido]',
          commission: selectedOrder?.orderComission ?? 0,
          amount: selectedOrder?.orderedAmount ?? 1,
        }}
        onCloseActions={() => {
          setError('');
          setMoreActionsOrderId(null);
          setActiveModal(loading
            ? 'REJECT_ORDER_CONFIRM' 
            : 'ORDERS_FROM_PRODUCT');
        }} 
      />

      {/* REMOVE ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={activeModal === 'REMOVE_ORDER'} 
        hasWarning
        decision={'ACCEPT'} 
        loading={loading} 
        customSentence={{
          title: 'Remover pedido',
          sentence: (
            <>
              Tem certeza que deseja remover esse pedido do cliente{' '} <span className="text-cyan">{selectedOrder?.orderCustomerName}</span>{' '}do seu histórico de pedidos?
            </>
          )
        }}
        onAccept={{
          handleSubmit: handleRemoveOrder,
        }}
        onCloseActions={() => {
          setMoreActionsOrderId(null);
          setActiveModal(loading 
            ? 'REMOVE_ORDER' 
            : 'ORDERS_FROM_PRODUCT');
        }} 
      />

      {/* SELLER REJECTION JUSTIFY ABOUT A CUSTOMER ORDER */}
     
      <RejectionJustify
        userRole='SELLER'
        error={error}
        isOpen={
          activeModal === 'ORDER_REJECTION_JUSTIFY'
        ||activeModal === 'EDIT_ORDER_REJECTION_JUSTIFY'
        }
        editRejection={activeModal === 'EDIT_ORDER_REJECTION_JUSTIFY'}
        newRejectionJustify={newOrderRejectionJustify ?? ''}
        sellerRejectionJustify={selectedOrder?.orderRejectionJustify ?? ''}
        editOrderRejectionJustify={activeModal === 'EDIT_ORDER_REJECTION_JUSTIFY'}
        loading={loading}
        onEdit={{
          onClick: () => {
            if (activeModal === 'EDIT_ORDER_REJECTION_JUSTIFY') {
              if (newOrderRejectionJustify === selectedOrder?.orderRejectionJustify) {
                setError('Nenhum caractere foi alterado para ser editado');
                return;
              }
              setActiveModal('NEW_ORDER_REJECTION_JUSTIFY_CONFIRM');
            } else {
              setActiveModal('EDIT_ORDER_REJECTION_JUSTIFY');              
            }
          }
        }}
        onChange={(e) => {
          setNewOrderRejectionJustify(e.target.value);
          setError('');
        }}
        onBlur={() => {
          if (newOrderRejectionJustify?.trim() === '') {
            setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
          }
        }}
        onCloseActions={() => {
          if (activeModal === 'EDIT_ORDER_REJECTION_JUSTIFY') {
            setActiveModal('ORDER_REJECTION_JUSTIFY');
            setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
            setError('');
            return;
          } if (activeModal === 'ORDER_REJECTION_JUSTIFY') {
            setActiveModal('ORDERS_FROM_PRODUCT');
            return;
          }
        }}
      />

      {/* SEND MESSAGE ABOUT CUSMTOMER SITUATION */}

      <JustifyAboutOrderSituation
        isOpen={activeModal === 'PRODUCT_OUTTA_STOCK_MESSAGE'}
        error={error}
        loading={loading}
        messageAboutSituation={messageAboutCustomerOrderSituation}
        onCloseActions={() => {
          setMessageAboutCustomerOrderSituation('');
          setActiveModal('ORDERS_FROM_PRODUCT');
          setError('');
        }}
        onChange={(e) => {
          setMessageAboutCustomerOrderSituation(e.target.value);
          setError('');
        }}
        onSend={() => {
          if (!messageAboutCustomerOrderSituation) {
            setError('Não se pode mandar uma mensagem vazia');
            return;
          } 
          handleSendMessageAboutCustomerOrderSituation();
        }}
      />

      {/* RESET PRODUCT STOCK */}
        
      <ResetProductStock
        isOpen={activeModal === 'RESET_PRODUCT_STOCK'}
        error={error}
        loading={loading}
        onCloseActions={() => {
          setActiveModal('ORDERS_FROM_PRODUCT');
          setError('');
        }}
        onChange={(e) => {
          setNewProductStock(Number(e.target.value));
          setError('');
        }}
        onReset={() => {
          if (newProductStock <= 0) {
            setError('Não se pode repor com um valor menor ou igual a zero');
            return;
          } 
          handleUpdateProductStock();
        }}
      />

      <ConfirmAction 
        isOpen={activeModal === 'NEW_ORDER_REJECTION_JUSTIFY_CONFIRM'}
        decision={'ACCEPT'} 
        loading={loading} 
        customSentence={{
          title: 'Confirmar ação',
          sentence: `Tem certeza que deseja alterar sua justificativa de rejeição atual desse pedido ?`
        }}
        onAccept={{
          handleSubmit: handleEditOrderRejectionJustify,
        }}
        onCloseActions={() => {
          setMoreActionsOrderId(null);
          setActiveModal('EDIT_ORDER_REJECTION_JUSTIFY');
        }} 
      />

        

      <OrdersFromProductsMenu
        isOpen={activeModal === 'ORDERS_FROM_PRODUCT'}
        onCloseActions={() => setActiveModal(null)}
        onImageClick={() => setActiveModal('EXPAND_IMAGE')}
        product={{
          imageUrl: product.imageUrl,
          name: product.name,
          category: product.category,
          description: product.description ?? '',
          price: product.price,
          stock: product.stock,
          onResetStock: () => setActiveModal('RESET_PRODUCT_STOCK')      
        }}
        productOrders={{
          fromSeller: filteredOrders,
          actions: {
            selectOrder,
            setActiveModal,
            moreActionsOrderId: moreActionsOrderId ?? 1,
            onMoreActionsOpenClick: handleMoreActionsOpen,
            onAccept: () => setActiveModal('ACCEPT_ORDER_CONFIRM'),
            onReject: () => setActiveModal('REJECT_ORDER_CONFIRM'),
            onRemove: () => setActiveModal('REMOVE_ORDER'),
            onApprove: () => setActiveModal('ACCEPT_ORDER_CONFIRM'),
            onViewJustify: () => setActiveModal('ORDER_REJECTION_JUSTIFY'),
            onJustifyCustomer: () => setActiveModal('PRODUCT_OUTTA_STOCK_MESSAGE'),
            onMoreActionsCloseClick: () => setMoreActionsOrderId(null),
          }
        }}
        search={{
          order: orderSearch,
          filter: orderFilter ?? 'value_asc',
          onSearch: (e) => setOrderSearch(e.target.value),
          onFilter: (e) => setOrderFilter(e.target.value as OrderFilterValue), 
          onClearSearch: () => setOrderSearch(''),
        }}
      />

      <ImageExpand
        isOpen={activeModal === 'EXPAND_IMAGE'}
        product={{
          name: product.name,
          imageUrl: product.imageUrl
        }}
        onCloseActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
        onImageClick={() => setActiveModal('ORDERS_FROM_PRODUCT')}
      />
    </motion.div>
  )
}

export default OrderProduct;

