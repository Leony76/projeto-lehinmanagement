import { CategoryTranslatedValue, CategoryValue, OrderFilterValue } from "@/src/constants/generalConfigs";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import { formatCurrency } from "@/src/utils/formatCurrency";
import Button from "../../form/Button";
import Search from "../../form/Search";
import Select from "../../form/Select";
import MoreActionsChevronButton from "../../ui/MoreActionsChevronButton";
import OrderCommission from "../../ui/OrderCommission";
import OrderRequestBy from "../../ui/OrderRequestBy";
import OrderRequestDate from "../../ui/OrderRequestDate";
import OrderRequestQuantity from "../../ui/OrderRequestQuantity";
import OrderSituationBottomTag from "../../ui/OrderSituationBottomTag";
import OrderSituationTopTag from "../../ui/OrderSituationTopTag";
import StockIfAccpeted from "../../ui/StockIfAccpeted";
import Modal from "../Modal";
import Image from "next/image";
import MoreActions from "../MoreActions";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { productCardSetup } from "@/src/constants/cardConfigs";

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  onImageClick: () => void;
  product: {
    imageUrl: string;
    name: string;
    category: CategoryValue;
    description: string;
    price: number;
    stock: number;
    onResetStock: () => void;
  }
  productOrders: {
    orders: {
      orderId: number;
      orderCreatedAt: string;
      orderedAmount: number;
      orderComission: number;
      orderCustomerName: string | null;
      orderStatus: OrderStatus;
      orderPaymentStatus: PaymentStatus | "PENDING";
      orderDeletedByCustomer: boolean;
      orderRejectionJustify: string | null;
    }[];
    actions: {
      moreActionsOrderId: number;
      selectOrder: (orderId: number) => void;
      onAccept: () => void;
      onReject: () => void;
      onRemove: () => void;
      onApprove: () => void;
      onViewJustify: () => void;
      onJustifyCustomer: () => void;
      onMoreActionsOpenClick: (orderId: number) => void;
      onMoreActionsCloseClick: () => void;
    }
  }
  search: {
    order: string;
    filter: OrderFilterValue;
    onSearch: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onFilter: (e:React.ChangeEvent<HTMLSelectElement>) => void;
    onClearSearch: () => void;
  }
}

const OrdersFromProductsMenu = ({
  isOpen,
  onCloseActions,
  onImageClick,
  product,
  productOrders,
  search,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={'Pedidos do produto'} 
    hasXClose
    onCloseModalActions={onCloseActions}
    >
      <div className='flex h-full max-h-[80vh]'>
        <div className='sm:flex hidden flex-col rounded-b-2xl gap-3 pr-2 flex-1 overflow-y-auto w-full
        hover:scrollbar-thumb-secondary-light
        scrollbar-thumb-secondary-middledark 
          scrollbar-track-transparent
          hover:scrollbar-track-transparent
          scrollbar-active-track-transparent
          scrollbar-active-thumb-primary-light
          scrollbar-thin
        '>
          <div className='relative aspect-square'>
            <Image
              src={product.imageUrl}
              fill
              alt={product.name}
              className='rounded-xl border border-primary-middledark object-cover cursor-zoom-in hover:opacity-80 transition duration-200'
              onClick={onImageClick}
            />
          </div>
          <div className='flex bg-primary-ultralight/25 p-2 border border-primary-middledark rounded-2xl flex-col gap-1.5 flex-2'>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Nome
              </label>
              <span className='text-secondary-dark'>
                {product.name}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Categoria
              </label>
              <span className='text-secondary-dark'>
                {product.category}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Descrição
              </label>
              <span className='h-30 overflow-y-auto text-secondary-dark flex-col  
              hover:scrollbar-thumb-primary-light
              scrollbar-thumb-primary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin
                '>
                {product.description}
              </span>
            </div>
            <div className='flex gap-10'>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Preço unitário
                </label>
                <span className='text-secondary-dark'>
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Estoque
                </label>
                <span className='text-secondary-dark'>
                  {product.stock}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1 overflow-y-auto flex-2 pr-2
        hover:scrollbar-thumb-primary-light
        scrollbar-thumb-primary-middledark 
          scrollbar-track-transparent
          hover:scrollbar-track-transparent
          scrollbar-active-track-transparent
          scrollbar-active-thumb-primary-light
          scrollbar-thin
        '>
        <div className="flex flex-col md:flex-row items-center gap-3 pl-2 mb-2 mt-3">
          <Search
            style={{ input: 'py-1 w-full flex-1' }}
            colorScheme="primary"
            value={search.order}
            onChange={search.onSearch}
            onClearSearch={search.onClearSearch}
          />
          <Select
            style={{ 
              input: 'flex-1 w-full', 
              container: 'flex-1',
              grid: `
                !grid-cols-1
                sm:!grid-cols-2
                md:!grid-cols-1
                lg:!grid-cols-2
              ` 
            }}
            selectSetup="ORDER_FILTER"
            colorScheme="primary"
            label="Filtro"
            value={search.filter ?? ''}
            onChange={search.onFilter}
          />
        </div>
        {productOrders.orders.map((order) => {
          
          const stockIfOrderAccepted = product.stock - order.orderedAmount;

          return (
          <motion.div
          key={order.orderId}
          layout
          initial={{
            opacity: 0,
            y: 2,
            scale: 0.5
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -5,
            scale: 0.5
          }}
          transition={{
            duration: .25,
            ease: "easeOut"
          }}
          className="flex flex-col gap-2"
          >
          <div className='flex md:flex-row flex-col bg-secondary-light/25 p-2 ml-2 rounded-2xl border border-secondary-middledark'>
            <div>
              <h3 className='text-primary-middledark italic'>
                Pedido #{order.orderId}
              </h3>
              <OrderRequestDate
                orderDate={new Date(order.orderCreatedAt).toLocaleDateString("pt-BR")}
              />
              <OrderRequestBy
                customerName={order.orderCustomerName ?? '[desconhecido]'}
              />
              <div>
                <OrderRequestQuantity
                  orderQuantity={order.orderedAmount}
                />
                {(order.orderStatus !== 'CANCELED'
                  && order.orderStatus !== 'APPROVED'
                  && order.orderStatus !== 'REJECTED')
                  && (
                  <StockIfAccpeted
                    stockIfOrderAccepted={stockIfOrderAccepted}
                  />
                )}
              </div>
              <OrderCommission
                orderCommission={order.orderComission}
              />
            </div>
            <div className='flex sm:flex-row md:flex-col flex-col mt-2 justify-between gap-3 flex-1'>
              <div className="flex sm:justify-end">
                {order.orderPaymentStatus === 'PENDING' && order.orderStatus !== 'CANCELED' ? (
                  <OrderSituationTopTag situation='Pagamento pendente'/>
                ) : order.orderStatus === 'CANCELED' ? (
                  <OrderSituationTopTag situation='Cancelado pelo cliente'/>
                ) : order.orderStatus !== 'PENDING' ? (
                  <OrderSituationTopTag situation='Analisado'/>
                ) : (
                  <OrderSituationTopTag situation='Não analisado'/>
                )}
              </div>
              <div className='flex gap-2 justify-end'>
                {order.orderStatus === 'APPROVED' ? (
                  <div className='flex gap-5'>
                    <OrderSituationBottomTag
                      situation={'Aprovado'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                      moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                    />
                  </div>
                ) : (order.orderStatus === 'CANCELED') ? (
                  <div className='flex gap-5'>
                    <OrderSituationBottomTag
                      situation={'Cancelado'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                      moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                    />
                  </div>
                ) : (order.orderStatus === 'REJECTED') ? ( 
                  <div className='flex gap-5'>
                    <OrderSituationBottomTag
                      situation={'Rejeitado'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                      moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                    />
                  </div>
                ) :  order.orderPaymentStatus === 'APPROVED' 
                  && order.orderStatus === 'PENDING' 
                  && !order.orderDeletedByCustomer 
                  && stockIfOrderAccepted >= 0 
                  ? (
                  <div className='flex gap-2 sm:w-fit w-full'>
                    <Button
                      type='button'
                      style={`px-5 flex-1 ${buttonColorsScheme.green}`}
                      label='Aceitar'
                      onClick={() => {
                        productOrders.actions.onAccept();
                        productOrders.actions.selectOrder(order.orderId);
                      }}
                    />
                    <Button
                      type='button'
                      style={`px-5 flex-1 ${buttonColorsScheme.red}`}
                      label='Rejeitar'
                      onClick={() => {
                        productOrders.actions.onReject();
                        productOrders.actions.selectOrder(order.orderId);
                      }}
                    />
                  </div>
                ) : order.orderStatus === 'PENDING' 
                  && !order.orderDeletedByCustomer 
                  && stockIfOrderAccepted < 0  
                  ? (
                  <div className='flex gap-5'>
                    <OrderSituationBottomTag
                      situation={'Estoque insuficiente'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                      moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                    />
                  </div>
                ) : (order.orderStatus === 'PENDING' 
                  && order.orderPaymentStatus !== 'APPROVED' 
                  && !order.orderDeletedByCustomer 
                  && stockIfOrderAccepted >= 0 ) && (
                  <div className='flex gap-5'>
                    <OrderSituationBottomTag
                      situation={'Pendente'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                      moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <MoreActions
          direction="right"
          style={{ container: 'mt-[-5px]' }}
          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
          close={productOrders.actions.onMoreActionsCloseClick}
          >
          {order.orderStatus !== 'CANCELED' && order.orderStatus === 'PENDING' ? (
            <>
            {stockIfOrderAccepted < 0 && (
              <>
              <Button 
                type='button'
                label="Repor estoque" 
                style={`px-5 ${buttonColorsScheme.secondary}`}
                onClick={product.onResetStock}
              />
              <Button 
                type='button'
                label="Justificar ao cliente" 
                style={`px-5 ${buttonColorsScheme.yellow}`}
                onClick={productOrders.actions.onJustifyCustomer}
              />
              </>
            )}
            <Button 
              type='button'
              label="Rejeitar pedido" 
              style={`px-5 ${buttonColorsScheme.red}`}
              onClick={productOrders.actions.onReject}
            />
            </>
          ) : ( order.orderStatus === 'REJECTED') ? (
            <>
            <Button 
              type='button'
              label="Remover do histórico" 
              style={`px-5 ${buttonColorsScheme.red}`}
              onClick={() => productOrders.actions.onRemove()}
            />
            <Button 
              type='button'
              label="Ver sua justificativa" 
              style={`px-5 ${buttonColorsScheme.yellow}`}
              onClick={() => productOrders.actions.onViewJustify()}
            />
            {order.orderPaymentStatus === 'APPROVED' && (
              <Button 
                type='button'
                label="Aprovar pedido" 
                style={`px-5 ${buttonColorsScheme.green}`}
                onClick={() => productOrders.actions.onAccept()}
              />
            )}
            </>
          ) : (
            <Button 
              type='button'
              label="Remover do histórico" 
              style={`px-5 ${buttonColorsScheme.red}`}
              onClick={() => productOrders.actions.onRemove()}
            />
          )}
          </MoreActions>
          </motion.div>
        )})}
        </div>
      </div>
    </Modal>
  )
}

export default OrdersFromProductsMenu