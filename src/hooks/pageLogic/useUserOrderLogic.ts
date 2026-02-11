import { removeOrderFromUserOrders, payForPeddingOrderPayment } from "@/src/actions/productActions";
import { CATEGORY_LABEL_MAP, PaymentOptionsValue, OrderFilterValue } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { UserOrderPageModals } from "@/src/types/modal";
import { UserProductsWithOrdersDTO } from "@/src/types/UserProductsWithOrdersDTO";
import { filterOrders } from "@/src/utils/filters/customerFilteredOrdersFromEachProduct";
import { getProductOrdersStats } from "@/src/utils/filters/productOrdersStats";
import { PaymentStatus } from "@/src/constants/generalConfigs";
import { useMemo, useState, useCallback, useEffect } from "react";

type Props = {
  product: UserProductsWithOrdersDTO;
}

export const useUserOrderLogic = ({product}:Props) => {
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

  return {
     loading,
    category,
    activeModal,
    orderSearch,
    orderFilter,
    ordersStats,
    datePutToSale,
    paymentMethod,
    paymentStatus,
    selectedOrder,
    filteredOrders,
    moreActionsOrderId,
    setMoreActionsOrderId,
    handleMoreActionsOpen,
    handleRemoveOrder,
    handleCancelOrder,
    setPaymentMethod,
    setActiveModal,
    setOrderSearch,
    setOrderFilter,
    handlePayOrder,
    selectOrder,
  }
}