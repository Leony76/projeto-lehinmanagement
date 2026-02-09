"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { CATEGORY_LABEL_MAP, OrderFilterValue } from '@/src/constants/generalConfigs';
import { ProductWithOrdersDTO } from '@/src/types/ProductWithOrdersDTO';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder, removeOrderFromUserOrders, sendMessageAboutCustomerOrderSituation, updatedProductStock } from '@/src/actions/productActions';
import { motion } from 'framer-motion';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import { editOrderRejectionJustify as editRejectionJustify } from '@/src/actions/productActions';
import { getProductOrdersStats } from '@/src/utils/filters/productOrdersStats';
import OrderStatusLabel from '../ui/OrderStatusLabel';
import ConfirmAction from '../modal/Orders/ConfirmAction';
import RejectionJustify from '../modal/Orders/RejectionJustify';
import JustifyAboutOrderSituation from '../modal/Orders/JustifyAboutOrderSituation';
import ResetProductStock from '../modal/Orders/ResetProductStock';
import OrdersFromProductsMenu from '../modal/Orders/OrdersFromProductsMenu';
import ImageExpand from '../modal/Orders/ImageExpand';
import { filterOrders } from '@/src/utils/filters/sellerFilteredOrdersFromEachProduct';
import { useLockScrollY } from '@/src/utils/useLockScrollY';
import { OrderPageModals } from '@/src/types/modal';

type Props = {
  product: ProductWithOrdersDTO;
}

const OrderProduct = ({product}:Props) => {

  const { showToast } = useToast()

  const userRole = useUserStore((stats) => stats.user?.role);

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

  const router = useRouter();

  const [activeModal, setActiveModal] = useState<OrderPageModals | null>(null);
  
  const [loading, setLoading] = useState<{
    rejecting: boolean;
    sending: boolean;
    accepting: boolean;
    removing: boolean;
    editing: boolean;
    reseting: boolean;
  }>({
    rejecting: false,
    accepting: false,
    sending: false,
    removing: false,
    editing: false,
    reseting: false,
  });

  const [error, setError] = useState<string>('');
  const [newOrderRejectionJustify, setNewOrderRejectionJustify] = useState<string | null>(selectedOrder?.orderRejectionJustify ?? '')
  const [rejectionJustify, setRejectionJustify] = useState<string>('');
  const [messageAboutCustomerOrderSituation, setMessageAboutCustomerOrderSituation] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderFilterValue | null>(null);
  const [newProductStock, setNewProductStock] = useState<number>(0);

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

  const handleAcceptOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.accepting) return;
    setLoading(prev => ({...prev, accepting: true}));

    try {
      await acceptRejectProductOrder(
        'APPROVED',
        selectedOrder.orderId,
        product.id,
        selectedOrder.orderedAmount,
      );

      showToast('Pedido aprovado com sucesso');
      setActiveModal(null);
    } catch(err:unknown) {
      showToast('Erro inesperado:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, accepting: false}));
      setActiveModal('ORDERS_FROM_PRODUCT')
    }
  }

  const handleRejectOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (!rejectionJustify) {
      setError('A justificativa de rejeição é obrigatória');
      setLoading(prev => ({...prev, rejecting: false}));
      return;
    } 
    
    if (loading.rejecting)return;
    setLoading(prev => ({...prev, rejecting: true}));

    try {
      await acceptRejectProductOrder(
        'REJECTED',
        selectedOrder.orderId,
        product.id,
        selectedOrder.orderedAmount,
        rejectionJustify
      );

      showToast('Pedido rejeitado com sucesso');
      setActiveModal(null);
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, rejecting: false}));
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleRemoveOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.removing || !userRole) return;
    setLoading(prev => ({...prev, removing: true}));

    try {
      await removeOrderFromUserOrders(
        selectedOrder.orderId,
        selectedOrder.orderStatus,
        userRole,
      );

      startTransition(() => {
        router.refresh(); 
      });

      showToast('Pedido removido com sucesso', 'success');
      setActiveModal('REMOVE_ORDER');
    
    } catch (err: unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, removing: false}));
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  };

  const handleEditOrderRejectionJustify = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.editing) return;
    setLoading(prev => ({...prev, editing: true}));

    try {
      await editRejectionJustify(
        newOrderRejectionJustify ?? '',
        selectedOrder.orderId,
      );

      showToast('Justificativa de rejeição do pedido editada com sucesso', 'success');
      setActiveModal('NEW_ORDER_REJECTION_JUSTIFY_CONFIRM');
    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, editing: false}));
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleSendMessageAboutCustomerOrderSituation = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.sending) return;
    setLoading(prev => ({...prev, sending: true}));

    try {
      await sendMessageAboutCustomerOrderSituation(
        selectedOrder.orderId,
        selectedOrder.orderStatus,
        messageAboutCustomerOrderSituation,
      );

      showToast('Mensagem mandada com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setMessageAboutCustomerOrderSituation('');
      setLoading(prev => ({...prev, sending: false}));
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleUpdateProductStock = async() => {
    if (loading.reseting) return;
    setLoading(prev => ({...prev, reseting: true}));

    try { 
      await updatedProductStock(
        product.id,
        newProductStock,
      );

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, reseting: false}));
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  useLockScrollY(Boolean(activeModal));

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
        decision={'ACCEPT'} 
        loading={loading.accepting} 
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
          setActiveModal(loading.accepting 
            ? 'ACCEPT_ORDER_CONFIRM' 
            : 'ORDERS_FROM_PRODUCT');
        }} 
      />

      {/* REJECT ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={activeModal === 'REJECT_ORDER_CONFIRM'} 
        hasWarning
        decision={'REJECT'} 
        loading={loading.rejecting} 
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
          setActiveModal(loading.rejecting 
            ? 'REJECT_ORDER_CONFIRM' 
            : 'ORDERS_FROM_PRODUCT');
        }} 
      />

      {/* REMOVE ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={activeModal === 'REMOVE_ORDER'} 
        hasWarning
        decision={'ACCEPT'} 
        loading={loading.removing} 
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
          setActiveModal(loading.removing 
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
        loading={loading.editing}
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
        loading={loading.sending}
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
        loading={loading.reseting}
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
        loading={loading.editing} 
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

