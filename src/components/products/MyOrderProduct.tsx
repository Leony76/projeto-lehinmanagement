"use client";

import { productCardSetup } from '@/src/constants/cardConfigs';
import { CATEGORY_LABEL_MAP, OrderFilterValue } from '@/src/constants/generalConfigs';
import { useToast } from '@/src/contexts/ToastContext';
import { useUserStore } from '@/src/store/useUserStore';
import { UserProductsWithOrdersDTO } from '@/src/types/UserProductsWithOrdersDTO';
import { filterOrders } from '@/src/utils/filters/customerFilteredOrdersFromEachProduct';
import { getProductOrdersStats } from '@/src/utils/filters/productOrdersStats';
import { motion } from 'framer-motion';
import { useMemo, useState, useCallback } from 'react';
import { IoStarOutline, IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import ConfirmAction from '../modal/Orders/ConfirmAction';
import ImageExpand from '../modal/Orders/ImageExpand';
import OrdersFromProductsMenu from '../modal/Orders/OrdersFromProductsMenu';
import OrderStatusLabel from '../ui/OrderStatusLabel';
import Image from 'next/image';
import { removeOrderFromUserOrders } from '@/src/actions/productActions';
import RejectionJustify from '../modal/Orders/RejectionJustify';

type Props = {
  product: UserProductsWithOrdersDTO;
}

const MyOrderProduct = ({
  product,
}:Props) => {
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

  const [ordersFromProduct, showOrdersFromProduct] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [removeOrder, showRemoveOrder] = useState<boolean>(false);
  const [orderRejectionJustify, showOrderRejectionJustify] = useState<boolean>(false);
  const [cancelOrder, showCancelOrder] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
    

  const [orderSearch, setOrderSearch] = useState('');
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

  const handleRemoveOrder = async():Promise<void> => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (!selectedOrder) throw new Error('Pedido não encontrado');
      if (!userRole) throw new Error('Houve um erro com as permisões do usuário');

      await removeOrderFromUserOrders(
        selectedOrder?.orderId,
        selectedOrder?.orderStatus,
        userRole,
        true,      
      );

      showToast('Pedido removido com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      showRemoveOrder(false);
      showOrdersFromProduct(true);
    }
  }

  const handleCancelOrder = async() => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (!selectedOrder) throw new Error('Pedido não encontrado');
      if (!userRole) throw new Error('Houve um erro com as permisões do usuário');

      await removeOrderFromUserOrders(
        selectedOrder?.orderId,
        selectedOrder?.orderStatus,
        userRole,
        true,      
      );

      showToast('Pedido cancelado com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      showCancelOrder(false);
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
            onClick={() => showOrdersFromProduct(true)}
          />        
        </div>       
      </div>
      
      {/* ================================================== */}
      {/* ================== ⇊ MODALS ⇊ =================== */}
      {/* ================================================== */}

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
        }}
        productOrders={{
          fromCustomer: filteredOrders,
          actions: {
            selectOrder,
            showOrdersFromProduct,
            moreActionsOrderId: moreActionsOrderId ?? 1,
            onMoreActionsOpenClick: handleMoreActionsOpen,
            onMoreActionsCloseClick: () => setMoreActionsOrderId(null),    
            onRemove: () => {
              showRemoveOrder(true);
            },
            onViewJustify: () => {
              showOrderRejectionJustify(true);
            },
            onCancel: () => {
              showCancelOrder(true);
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

      <ConfirmAction
        isOpen={removeOrder}
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
        onCloseActions={() => {
          showRemoveOrder(false);
          showOrdersFromProduct(true);
        }}
      />

      <ConfirmAction
        isOpen={cancelOrder}
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
        onCloseActions={() => {
          showCancelOrder(false);
          showOrdersFromProduct(true);
        }}
      />

      <RejectionJustify
        userRole='CUSTOMER'
        isOpen={orderRejectionJustify}
        sellerRejectionJustify={selectedOrder?.orderRejectionJustify ?? '[Sem justificativa]'}
        onCloseActions={() => {
          showOrderRejectionJustify(false);
          showOrdersFromProduct(true);
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

export default MyOrderProduct;







