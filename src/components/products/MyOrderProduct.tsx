"use client";

import { productCardSetup } from '@/src/constants/cardConfigs';
import { CATEGORY_LABEL_MAP, OrderFilterValue, PaymentOptionsValue, PaymentStatus } from '@/src/constants/generalConfigs';
import { useToast } from '@/src/contexts/ToastContext';
import { useUserStore } from '@/src/store/useUserStore';
import { UserProductsWithOrdersDTO } from '@/src/types/UserProductsWithOrdersDTO';
import { filterOrders } from '@/src/utils/filters/customerFilteredOrdersFromEachProduct';
import { getProductOrdersStats } from '@/src/utils/filters/productOrdersStats';
import { motion } from 'framer-motion';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { IoStarOutline, IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import ConfirmAction from '../modal/Orders/ConfirmAction';
import ImageExpand from '../modal/Orders/ImageExpand';
import OrdersFromProductsMenu from '../modal/Orders/OrdersFromProductsMenu';
import OrderStatusLabel from '../ui/OrderStatusLabel';
import Image from 'next/image';
import { payForPeddingOrderPayment, removeOrderFromUserOrders } from '@/src/actions/productActions';
import RejectionJustify from '../modal/Orders/RejectionJustify';
import Modal from '../modal/Modal';
import Select from '../form/Select';
import { CgCloseO } from 'react-icons/cg';
import { FaRegClock, FaRegCircleCheck } from 'react-icons/fa6';
import { OrderPageModals, UserOrderPageModals } from '@/src/types/modal';

type Props = {
  product: UserProductsWithOrdersDTO;
}

const MyOrderProduct = ({
  product,
}:Props) => {
  const { showToast } = useToast()


  const ordersStats = useMemo(
    () => getProductOrdersStats(product),
    [product.orders]
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const selectedOrder = product.orders.find(
    o => o.orderId === selectedOrderId
  );

  const [moreActionsOrderId, setMoreActionsOrderId] = useState<number | null>(null);
  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [paymentMethod, setPaymentMethod] = useState<PaymentOptionsValue | null>(null); 
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');

  const [loading, setLoading] = useState<boolean>(false);

  const [activeModal, setActiveModal] = useState<UserOrderPageModals | null>(null);

  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<OrderFilterValue | null>(null);

  const filteredOrders = useMemo(() => 
    filterOrders(
      product.orders,
      orderSearch,
      orderFilter
    ),[product.orders, orderSearch, orderFilter]
  );

  const selectOrder = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setMoreActionsOrderId(prev =>
      prev === orderId ? null : orderId
    );
  }, []);

  const handleMoreActionsOpen = useCallback(
    (orderId: number) => {
      selectOrder(orderId);
    },
    [selectOrder]
  );

  const handleRemoveOrder = async() => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (!selectedOrder) throw new Error('Pedido não encontrado');

      await removeOrderFromUserOrders(
        selectedOrder?.orderId,
        selectedOrder?.orderStatus,
        'CUSTOMER',
        false,      
      );

      showToast('Pedido removido com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal('ORDERS_FROM_PRODUCT');
      setMoreActionsOrderId(null);
    }
  }

  const handleCancelOrder = async() => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (!selectedOrder) throw new Error('Pedido não encontrado');

      await removeOrderFromUserOrders(
        selectedOrder?.orderId,
        selectedOrder?.orderStatus,
        'CUSTOMER',
        true,      
      );

      showToast('Pedido cancelado com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal('ORDERS_FROM_PRODUCT');
      setMoreActionsOrderId(null);
    }
  }

  const handlePayOrder = async() => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (!selectedOrder) throw new Error('Pedido não encontrado');
      if (!paymentMethod) throw new Error('Método de pagamento não selecionado');

      await payForPeddingOrderPayment(
        paymentMethod,
        selectedOrder.orderTotalPrice,
        selectedOrder.orderId,
      );

      showToast('Pedido pago com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal('ORDERS_FROM_PRODUCT');
      setMoreActionsOrderId(null);
    }
  }

  useEffect(() => {
    if (paymentMethod) {
      setPaymentStatus('PROCESSING');

      const timerFinalResult = setTimeout(() => {

        const isApproved = Math.random() < 0.75;
        
        setPaymentStatus(isApproved ? 'APPROVED' : 'DENIED');
      }, 3000);

      return () => {
        clearTimeout(timerFinalResult);
      };
    } 
  }, [paymentMethod]);
  

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
          src={product.imageUrl} 
          alt={product.name}
          fill
          className={productCardSetup.image}
          onClick={() => setMoreActionsOrderId(null)}
        />
      </div>
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => setMoreActionsOrderId(null)}>
          <h3 className={productCardSetup.name}>{product.name}</h3>
          <div className={productCardSetup.categoryDateRatingContainer}>
            <div className={productCardSetup.categoryDate}>
              <span>{category}</span>
              <span className="text-[10px] text-gray-400">●</span>
              <span>{datePutToSale}</span>
            </div>
            <div className={productCardSetup.rating}>
              {!product.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
              }
              {product.productAverageRating ?? 'Não avaliado'}
            </div>
            <div className='flex flex-col'>
              <OrderStatusLabel 
                statusLabel={'Aprovados'} status={ordersStats.approved} 
              />
              <OrderStatusLabel 
                statusLabel={'Pendentes'} status={ordersStats.pending} 
              />
              <OrderStatusLabel 
                statusLabel={'Cancelados'} status={ordersStats.canceled} 
              />
              <OrderStatusLabel 
                statusLabel={'Rejeitados'} status={ordersStats.rejected} 
              />
              <OrderStatusLabel 
                statusLabel={'Não pagos'} status={ordersStats.notPaid} 
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

      <OrdersFromProductsMenu
        isOpen={activeModal === 'ORDERS_FROM_PRODUCT'}
        onCloseActions={() => {
          setActiveModal(null);
          setOrderSearch('');
        }}
        onImageClick={() => setActiveModal('EXPAND_IMAGE')}
        product={{
          imageUrl: product.imageUrl,
          name: product.name,
          category: product.category,
          description: product.description ?? '',
          price: product.price,
          stock: product.stock,
        }}
        productOrders={{
          fromCustomer: filteredOrders,
          actions: {
            selectOrder,
            setActiveModal: setActiveModal as React.Dispatch<React.SetStateAction<OrderPageModals | null>>,
            moreActionsOrderId: moreActionsOrderId ?? 1,
            onMoreActionsOpenClick: handleMoreActionsOpen,
            onMoreActionsCloseClick: () => setMoreActionsOrderId(null), 
            onPay: () => setActiveModal('PAY_ORDER'),  
            onRemove: () => setActiveModal('REMOVE_ORDER'),
            onViewJustify: () => setActiveModal('ORDER_REJECTION_JUSTIFY'),
            onCancel: () => setActiveModal('CANCEL_ORDER'),
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

      <ConfirmAction
        isOpen={activeModal === 'REMOVE_ORDER'}
        loading={loading}
        hasWarning={true}
        isActionIrreversible={true}
        decision='REMOVE'
        customSentence={{
          sentence: 'Tem certeza que deseja remover esse pedido do seu histórico?',
          title: 'Remover pedido'
        }}
        onReject={{
          handleSubmit: handleRemoveOrder
        }}
        onCloseActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
      />

      <ConfirmAction
        isOpen={activeModal === 'CANCEL_ORDER'}
        loading={loading}
        hasWarning={true}
        isActionIrreversible={true}
        decision='CANCEL'
        customSentence={{
          sentence: (
            <span className='text-secondary-dark'>
              Tem certeza que deseja cancelar esse pedido?
            </span>
          ),
          title: 'Cancelar pedido'
        }}
        onReject={{
          handleSubmit: handleCancelOrder,
        }}
        onCloseActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
      />

      <RejectionJustify
        userRole='CUSTOMER'
        isOpen={activeModal === 'ORDER_REJECTION_JUSTIFY'}
        sellerRejectionJustify={selectedOrder?.orderRejectionJustify ?? '[Sem justificativa]'}
        onCloseActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
      />

      <Modal 
      isOpen={activeModal === 'PAY_ORDER'} 
      hasXClose
      modalTitle={'Pagar pedido'} 
      onCloseModalActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
      >
        <p className='text-secondary-middledark'>
          Selecione um método de pagamento disponível.
        </p>
        <div className='flex'>
          <Select 
            selectSetup={'PAYMENT'}
            colorScheme='primary'
            onChange={(e) => setPaymentMethod(e.target.value as PaymentOptionsValue)}
          />
          <div className="flex mx-5 flex-1 items-center gap-1 mb-1 text-lg font-bold self-end">
            {paymentStatus === 'PENDING' && (
              <span className="flex items-center tracking-wider gap-1 text-yellow-dark">
                <FaRegClock size={20} /> PENDENTE
              </span>
            )}
  
            {paymentStatus === 'PROCESSING' && (
              <span className="flex items-center gap-1 text-gray animate-pulse">
                <div className="h-4 w-4 border-2 border-blue-gray border-t-transparent rounded-full animate-spin" />
                PROCESSANDO...
              </span>
            )}
  
            {paymentStatus === 'APPROVED' && (
              <>
              <span className="flex items-center gap-1 text-green">
                <FaRegCircleCheck  size={20} /> APROVADO
              </span>          
              </>
            )}
  
            {paymentStatus === 'DENIED' && (
              <>
              <span className="flex items-center gap-1 text-red">
                <CgCloseO size={23} /> REJEITADO
              </span>        
              </>
            )}
          </div>
        </div>
          <Button 
            type="button"
            label={
              paymentStatus === 'PROCESSING'
                ? 'Processando...'
                : paymentStatus === 'DENIED' 
                  ? 'Não é possível prosseguir' 
                  : 'Prosseguir'
            }
            style={`mt-2 ${
              paymentStatus === 'PROCESSING'
                ? 'opacity-60 cursor-not-allowed'
              : paymentStatus === 'DENIED'
                ? '!bg-red-100 !text-red !border-red pointer-events-none'
              : paymentStatus === 'PENDING'
                && 'brightness-[0.8] opacity-90 pointer-events-none'
            }`}
            colorScheme="secondary"
            disabled={!!(paymentStatus !== 'APPROVED' && paymentMethod)}
            onClick={() => setActiveModal('ORDERS_FROM_PRODUCT')}
        />
      </Modal>

      <ConfirmAction
        isOpen={activeModal === 'PAY_ORDER_CONFIRM'}
        loading={loading}
        isActionIrreversible={true}
        decision='PAY'
        customSentence={{
          sentence: (
            <span className='text-secondary-dark'>
              Tem certeza que deseja pagar esse pedido com esse método de pagamento?
            </span>
          ),
          title: 'Pagar pedido'
        }}
        onReject={{
          handleSubmit: handlePayOrder,
        }}
        onCloseActions={() => setActiveModal('ORDERS_FROM_PRODUCT')}
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

export default MyOrderProduct;







