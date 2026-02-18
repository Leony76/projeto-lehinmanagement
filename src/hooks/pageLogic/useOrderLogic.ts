import { acceptRejectProductOrder, removeOrderFromUserOrders, sendMessageAboutCustomerOrderSituation, updatedProductStock } from "@/src/actions/productActions";
import { CATEGORY_LABEL_MAP, OrderFilterValue } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { OrderPageModals } from "@/src/types/modal";
import { filterOrders } from "@/src/utils/filters/customerFilteredOrdersFromEachProduct";
import { getProductOrdersStats } from "@/src/utils/filters/productOrdersStats";
import { useRouter } from "next/router";
import { useMemo, useState, useCallback, startTransition } from "react";
import { useUserStore } from "../store/useUserStore";
import { useLockScrollY } from "../useLockScrollY";
import { ProductWithOrdersDTO } from "@/src/types/ProductWithOrdersDTO";
import { editOrderRejectionJustify } from "@/src/actions/productActions";

type Props = {
  product: ProductWithOrdersDTO;
}

export const useOrderLogic = ({product}:Props) => {
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

  const [activeModal, setActiveModal] = useState<OrderPageModals | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>('');
  const [newOrderRejectionJustify, setNewOrderRejectionJustify] = useState<string | null>(selectedOrder?.orderRejectionJustify ?? '')
  const [rejectionJustify, setRejectionJustify] = useState<string>('');
  const [messageAboutCustomerOrderSituation, setMessageAboutCustomerOrderSituation] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderFilterValue | null>(null);
  const [newProductStock, setNewProductStock] = useState<number>(0);


  const filteredOrders = useMemo(() => {
    const result = filterOrders(
    product.orders as any, 
    orderSearch,
    orderFilter
  );

    return (result as unknown) as ProductWithOrdersDTO['orders'];

  }, [product.orders, orderSearch, orderFilter]);

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

    if (loading) return;
    setLoading(true);

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
      setLoading(false);
      setMoreActionsOrderId(null);
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
      setLoading(false);
      return;
    } 
    
    if (loading) return;
    setLoading(true);

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
      setLoading(false);
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleRemoveOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading || !userRole) return;
    setLoading(true);

    try {
      await removeOrderFromUserOrders(
        selectedOrder.orderId,
        selectedOrder.orderStatus,
        userRole,
      );

      showToast('Pedido removido com sucesso', 'success');
      setActiveModal('REMOVE_ORDER');
    
    } catch (err: unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(false);
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  };

  const handleEditOrderRejectionJustify = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await editOrderRejectionJustify(
        newOrderRejectionJustify ?? '',
        selectedOrder.orderId,
      );

      showToast('Justificativa de rejeição do pedido editada com sucesso', 'success');
      setActiveModal('NEW_ORDER_REJECTION_JUSTIFY_CONFIRM');
    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(false);
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleSendMessageAboutCustomerOrderSituation = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading) return;
    setLoading(true);

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
      setLoading(false);
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  const handleUpdateProductStock = async() => {
    if (loading) return;
    setLoading(true);

    try { 
      await updatedProductStock(
        product.id,
        newProductStock,
      );

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(false);
      setMoreActionsOrderId(null);
      setActiveModal('ORDERS_FROM_PRODUCT');
    }
  }

  useLockScrollY(Boolean(activeModal));

  return {
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
  }
}