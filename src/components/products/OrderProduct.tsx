"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { CATEGORY_LABEL_MAP, OrderFilterValue } from '@/src/constants/generalConfigs';
import { ProductWithOrdersDTO } from '@/src/types/ProductWithOrdersDTO';
import Modal from '../modal/Modal';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder, removeOrderFromUserOrders, sendMessageAboutCustomerOrderSituation, updatedProductStock } from '@/src/actions/productActions';
import { motion } from 'framer-motion';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import { editOrderRejectionJustify as editRejectionJustify } from '@/src/actions/productActions';
import { getProductOrdersStats } from '@/src/utils/filters/productOrdersStats';
import { filterOrders } from '@/src/utils/filters/filteredOrdersFromEachProduct';
import OrderStatusLabel from '../ui/OrderStatusLabel';
import ConfirmAction from '../modal/Orders/ConfirmAction';
import RejectionJustify from '../modal/Orders/RejectionJustify';
import JustifyAboutOrderSituation from '../modal/Orders/JustifyAboutOrderSituation';
import ResetProductStock from '../modal/Orders/ResetProductStock';
import OrdersFromProductsMenu from '../modal/Orders/OrdersFromProductsMenu';
import ImageExpand from '../modal/Orders/ImageExpand';

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

  const [acceptanceOrderConfirm, showAcceptanceOrderConfirm] = useState<boolean>(false);
  const [rejectionJustifyConfirm, showRejectionJustifyConfirm] = useState<boolean>(false);
  const [orderRejectionJustify, showOrderRejectionJustify] = useState<boolean>(false);
  const [editOrderRejectionJustify, showEditOrderRejectionJustify] = useState<boolean>(false);
  const [productOuttaStockMessage, showProductOuttaStockMessage] = useState<boolean>(false);
  const [newOrderRejectionJustifyCorfirm, showNewOrderRejectionJustifyCorfirm] = useState<boolean>(false);
  const [resetProductStock, showResetProductStock] = useState<boolean>(false);
  const [ordersFromProduct, showOrdersFromProduct] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [removeOrder, showRemoveOrder] = useState<boolean>(false);


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
      showAcceptanceOrderConfirm(false);
    } catch(err:unknown) {
      showToast('Erro inesperado:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, accepting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
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
      showRejectionJustifyConfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, rejecting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
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
      showRemoveOrder(false);
    
    } catch (err: unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, removing: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
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
      showNewOrderRejectionJustifyCorfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, editing: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
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
      showProductOuttaStockMessage(false);
      setMessageAboutCustomerOrderSituation('');
      setLoading(prev => ({...prev, sending: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
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
      showResetProductStock(false);
      setLoading(prev => ({...prev, reseting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

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
            onClick={() => showOrdersFromProduct(true)}
          />        
        </div>       
      </div>
      
      {/* ================================================== */}
      {/* ================== ⇊ MODALS ⇊ =================== */}
      {/* ================================================== */}

      {/* ACCEPT ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={acceptanceOrderConfirm} 
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
          showAcceptanceOrderConfirm(loading.accepting ? true : false);
          showOrdersFromProduct(true);
          setMoreActionsOrderId(null);
        }} 
      />

      {/* REJECT ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={rejectionJustifyConfirm} 
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
          showRejectionJustifyConfirm(loading.rejecting ? true : false);
          showOrdersFromProduct(true);
          setMoreActionsOrderId(null);
          setError('');
        }} 
      />

      {/* REMOVE ORDERS FROM CUSTOMERS */}

      <ConfirmAction 
        isOpen={removeOrder} 
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
          showRemoveOrder(loading.removing ? true : false);
          showOrdersFromProduct(true);
          setMoreActionsOrderId(null);
        }} 
      />

      {/* SELLER REJECTION JUSTIFY ABOUT A CUSTOMER ORDER */}
     
      <RejectionJustify
        error={error}
        isOpen={orderRejectionJustify}
        editRejection={editOrderRejectionJustify}
        newRejectionJustify={newOrderRejectionJustify ?? ''}
        sellerRejectionJustify={selectedOrder?.orderRejectionJustify ?? ''}
        editOrderRejectionJustify={editOrderRejectionJustify}
        loading={loading.editing}
        onEdit={{
          onClick: () => {
            if (editOrderRejectionJustify) {
              if (newOrderRejectionJustify === selectedOrder?.orderRejectionJustify) {
                setError('Nenhum caractere foi alterado para ser editado');
                return;
              } else {
                showNewOrderRejectionJustifyCorfirm(true);
                showOrderRejectionJustify(false);
              }
            } else {
              showEditOrderRejectionJustify(true);              
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
          if (editOrderRejectionJustify) {
            showEditOrderRejectionJustify(false);
            setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
            setError('');
          } else {
            showOrderRejectionJustify(false);
            setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
            showOrdersFromProduct(true);
          }
        }}
      />

      {/* SEND MESSAGE ABOUT CUSMTOMER SITUATION */}

      <JustifyAboutOrderSituation
        isOpen={productOuttaStockMessage}
        error={error}
        loading={loading.sending}
        messageAboutSituation={messageAboutCustomerOrderSituation}
        onCloseActions={() => {
          showProductOuttaStockMessage(false);
          setMessageAboutCustomerOrderSituation('');
          showOrdersFromProduct(true);
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
          } else {
            handleSendMessageAboutCustomerOrderSituation();
          }
        }}
      />

      <ResetProductStock
        isOpen={resetProductStock}
        error={error}
        loading={loading.reseting}
        onCloseActions={() => {
          showResetProductStock(false);
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
          } else {
            handleUpdateProductStock();
          }
        }}
      />

      <ConfirmAction 
        isOpen={newOrderRejectionJustifyCorfirm}
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
          showNewOrderRejectionJustifyCorfirm(false);
          setMoreActionsOrderId(null);
          showOrdersFromProduct(true);
          showOrderRejectionJustify(true);
        }} 
      />

      <OrdersFromProductsMenu
        isOpen={ordersFromProduct}
        onCloseActions={() => showOrdersFromProduct(false)}
        onImageClick={() => {
          setExpandImage(true);
          showOrdersFromProduct(false);
        }}
        product={{
          imageUrl: product.imageUrl,
          name: product.name,
          category: product.category,
          description: product.description ?? '',
          price: product.price,
          stock: product.stock,
          onResetStock: () => {
            showResetProductStock(true);
            showOrdersFromProduct(false);
          }
        }}
        productOrders={{
          orders: filteredOrders,
          actions: {
            selectOrder,
            moreActionsOrderId: moreActionsOrderId ?? 1,
            onMoreActionsOpenClick: handleMoreActionsOpen,
            onMoreActionsCloseClick: () => setMoreActionsOrderId(null),
            onAccept: () => {
              showAcceptanceOrderConfirm(true);
              showOrdersFromProduct(false);
            },
            onReject: () => {
              showRejectionJustifyConfirm(true);
              showOrdersFromProduct(false);
            },
            onRemove: () => {
              showRemoveOrder(true);
              showOrdersFromProduct(false);
            },
            onApprove: () => {
              showAcceptanceOrderConfirm(true);
              showOrdersFromProduct(false);
            },
            onViewJustify: () => {
               showOrderRejectionJustify(true);
               showOrdersFromProduct(false);
            },
            onJustifyCustomer: () => {
              showProductOuttaStockMessage(true);
              showOrdersFromProduct(false);
            },
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
        isOpen={expandImage}
        product={{
          name: product.name,
          imageUrl: product.imageUrl
        }}
        onCloseActions={() => {
          setExpandImage(false);
          showOrdersFromProduct(true);
        }}
        onImageClick={() => {
          setExpandImage(false);
          showOrdersFromProduct(true);
        }}
      />
    </motion.div>
  )
}

export default OrderProduct;

