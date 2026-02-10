import { CATEGORY_LABEL_MAP, CategoryValue, OrderFilterValue } from "@/src/constants/generalConfigs";
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
import { OrderStatus, PaymentStatus, Role } from "@prisma/client";
import { motion } from "framer-motion";
import NoContentFoundMessage from "../../ui/NoContentFoundMessage";
import PaidTag from "../../ui/PaidTag";
import { OrderPageModals } from "@/src/types/modal";
import { ordersFromProductMenu as style } from "@/src/styles/Order/ordersFromProductMenu.style";

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
    onResetStock?: () => void;
  }
  productOrders: {
    fromCustomer?: {      
      orderId: number;
      orderedAmount: number;
      orderDate: string;
      sellerName: string;
      orderStatus: OrderStatus;
      orderTotalPrice: number;
      orderPaymentStatus: PaymentStatus | "PENDING";
      orderRejectionJustify: string | null;
    }[];
    fromSeller?: {
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
      setActiveModal: React.Dispatch<React.SetStateAction<OrderPageModals | null>>
      selectOrder: (orderId: number) => void;
      onPay?: () => void;
      onAccept?: () => void;
      onReject?: () => void;
      onRemove?: () => void;
      onCancel?: () => void;
      onApprove?: () => void;
      onViewJustify?: () => void;
      onJustifyCustomer?: () => void;
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

  const category = CATEGORY_LABEL_MAP[product.category];

  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={ 
      <>
        <span className="hidden md:inline">Pedidos do produto</span>
        <span className="md:hidden">Pedidos</span>
      </>
    } 
    hasXClose
    onCloseModalActions={onCloseActions}
    >
      <div className={style.mainContainer}>
        <div className={style.productInfo}>
          <div className={style.image.container}>
            <Image
              src={product.imageUrl}
              fill
              alt={product.name}
              className={style.image.self}
              onClick={onImageClick}
            />
          </div>
          <div className={style.productInfoSubcontainer}>
            <div className={style.genericLabelValue.container}>
              <label className={style.genericLabelValue.label}>
                Nome
              </label>
              <span className={style.genericLabelValue.value}>
                {product.name}
              </span>
            </div>
            <div className={style.genericLabelValue.container}>
              <label className={style.genericLabelValue.label}>
                Categoria
              </label>
              <span className={style.genericLabelValue.value}>
                {category}
              </span>
            </div>
            <div className={style.genericLabelValue.container}>
              <label className={style.genericLabelValue.label}>
                Descrição
              </label>
              <span className={style.descriptionValue}>
                {product.description}
              </span>
            </div>
            <div className={style.price_stockContainer}>
              <div className={style.genericLabelValue.container}>
                <label className={style.genericLabelValue.label}>
                  Preço unitário
                </label>
                <span className={style.genericLabelValue.value}>
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className={style.genericLabelValue.container}>
                <label className={style.genericLabelValue.label}>
                  Estoque
                </label>
                <span className={style.genericLabelValue.value}>
                  {product.stock}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={style.productOrdersContainer}>
          <div className={style.search_selectContainer}>
            <Search
              style={{ input: style.search}}
              colorScheme="primary"
              value={search.order}
              onChange={search.onSearch}
              onClearSearch={search.onClearSearch}
            />
            <Select
              style={{ 
                input: style.select.input, 
                container: style.select.container,
                grid: style.select.grid,
              }}
              selectSetup="ORDER_FILTER"
              colorScheme="primary"
              label="Filtro"
              value={search.filter ?? ''}
              onChange={search.onFilter}
            />
          </div>
        {productOrders.fromSeller ? (  
          productOrders.fromSeller.length > 0 ? (
            productOrders.fromSeller.map((order) => {
              
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
              className={style.productOrdersInnerContainer}
              >
              <div className={style.orderCardContainer}>
                <div className={style.orderCardInnerLeftContainer}>
                  <h3 className={style.orderId}>
                    Pedido #{order.orderId}
                  </h3>
                  <OrderRequestDate
                    orderDate={order.orderCreatedAt}
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
                <div className={style.orderCardInnerRightContainer}>
                  <div className={style.orderSituationTagContainer}>
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
                  <div className={style.buttonSchemeContainer}>
                    {order.orderStatus === 'APPROVED' ? (
                      <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Aprovado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : (order.orderStatus === 'CANCELED') ? (
                      <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Cancelado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : (order.orderStatus === 'REJECTED') ? ( 
                      <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Rejeitado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : order.orderPaymentStatus === 'APPROVED' 
                      && order.orderStatus === 'PENDING' 
                      && !order.orderDeletedByCustomer 
                      && stockIfOrderAccepted >= 0 
                      ? (
                      <div className={style.decisionButtonsContainer}>
                        <Button
                          type='button'
                          style={style.decisionButtons}
                          label='Aceitar'
                          onClick={() => {
                            productOrders.actions.onAccept && productOrders.actions.onAccept();
                            productOrders.actions.setActiveModal('ACCEPT_ORDER_CONFIRM');
                            productOrders.actions.selectOrder(order.orderId);
                          }}
                        />
                        <Button
                          type='button'
                          style={style.decisionButtons}
                          label='Rejeitar'
                          onClick={() => {
                            productOrders.actions.onReject && productOrders.actions.onReject();
                            productOrders.actions.setActiveModal('REJECT_ORDER_CONFIRM');
                            productOrders.actions.selectOrder(order.orderId);
                          }}
                        />
                      </div>
                    ) : order.orderStatus === 'PENDING' 
                      && !order.orderDeletedByCustomer 
                      && stockIfOrderAccepted < 0  
                      ? (
                      <div className={style.buttonsContainer}>
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
                      <div className={style.buttonsContainer}>
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

              {/* MORE ACTIONS MODAL */}

              <MoreActions
              direction="right"
              style={{ container: 'mt-[-5px]' }}
              moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
              close={productOrders.actions.onMoreActionsCloseClick}
              >
              {(order.orderStatus !== 'CANCELED' 
              && order.orderStatus === 'PENDING') 
              ? (
                <>
                {(stockIfOrderAccepted < 0) && (
                  <>
                  <Button 
                    type='button'
                    label="Repor estoque" 
                    style={`px-5 ${buttonColorsScheme.secondary}`}
                    onClick={() => product.onResetStock && product.onResetStock()}
                  />
                  <Button 
                    type='button'
                    label="Justificar ao cliente" 
                    style={`px-5 ${buttonColorsScheme.yellow}`}
                    onClick={() => productOrders.actions.onJustifyCustomer && productOrders.actions.onJustifyCustomer()}
                  />
                  </>
                )}
                <Button 
                  type='button'
                  label="Rejeitar pedido" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() => productOrders.actions.onReject && productOrders.actions.onReject()}
                />
                </>
              ) : ( order.orderStatus === 'REJECTED') ? (
                <>
                <Button 
                  type='button'
                  label="Remover do histórico" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() =>  productOrders.actions.onRemove && productOrders.actions.onRemove()}
                />
                <Button 
                  type='button'
                  label="Ver sua justificativa" 
                  style={`px-5 ${buttonColorsScheme.yellow}`}
                  onClick={() => productOrders.actions.onViewJustify && productOrders.actions.onViewJustify()}
                />
                {order.orderPaymentStatus === 'APPROVED' && (
                  <Button 
                    type='button'
                    label="Aprovar pedido" 
                    style={`px-5 ${buttonColorsScheme.green}`}
                    onClick={() => productOrders.actions.onAccept && productOrders.actions.onAccept()}
                  />
                )}
                </>
              ) : (
                <Button 
                  type='button'
                  label="Remover do histórico" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() => productOrders.actions.onRemove && productOrders.actions.onRemove()}
                />
              )}
                </MoreActions>
              </motion.div>
            )})
          ) : (
            <NoContentFoundMessage
              text={'Nenhum resultado encontrado!'}
            />
          )
        ) : productOrders.fromCustomer && (
          productOrders.fromCustomer.length > 0 ? (
            productOrders.fromCustomer.map((order) => {   
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
              className={style.productOrdersInnerContainer}
              >
              <div className={style.orderCardContainerFromUser}>
                <div className={style.orderCardInnerLeftContainerFromUser}>
                  <OrderRequestDate
                    orderDate={order.orderDate}
                  />
                  <div>
                    <OrderRequestQuantity
                      orderQuantity={order.orderedAmount}
                    />
                  </div>
                  <OrderCommission
                    customLabel="Valor:"
                    orderCommission={order.orderTotalPrice}
                  />
                  {(order.orderPaymentStatus === 'APPROVED' 
                  && order.orderStatus === 'PENDING'
                  ) &&
                    <PaidTag/>
                  }
                </div>
                <div className={style.orderCardInnerRightContainerFromUser}>
                  <div className={style.orderSituationTagContainer}>
                    {(order.orderPaymentStatus !== 'APPROVED' 
                    && order.orderStatus !== 'CANCELED') 
                    ? (
                      <OrderSituationTopTag situation='Pagamento pendente'/>
                    ) : (order.orderStatus === 'CANCELED') ? (
                      <OrderSituationTopTag situation='Cancelado por você'/>
                    ) : (order.orderStatus !== 'PENDING') ? (
                      <OrderSituationTopTag situation='Analisado'/>
                    ) : (
                      <OrderSituationTopTag situation='Em analise'/>
                    )}
                  </div>
                  <div className={style.orderSituationBottomTag}>
                    {order.orderStatus === 'APPROVED' ? (
                      <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Aprovado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : (order.orderStatus === 'CANCELED') ? (
                       <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Cancelado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : (order.orderStatus === 'REJECTED') ? ( 
                      <div className={style.buttonsContainer}>
                        <OrderSituationBottomTag
                          situation={'Rejeitado'}
                        />
                        <MoreActionsChevronButton
                          onClick={() => productOrders.actions.onMoreActionsOpenClick(order.orderId)}
                          moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
                        />
                      </div>
                    ) : (order.orderStatus === 'PENDING') && (
                      <div className={style.buttonsContainer}>
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

              {/* MORE ACTIONS MODAL */}
                    
              <MoreActions
              direction="right"
              style={{ container: 'mt-[-5px]' }}
              moreActions={productOrders.actions.moreActionsOrderId === order.orderId}
              close={productOrders.actions.onMoreActionsCloseClick}
              >
              {(order.orderStatus !== 'CANCELED' 
              && order.orderStatus === 'PENDING') 
              ? (      
                <>
              {order.orderPaymentStatus !== 'APPROVED' && (
                <Button 
                  type='button'
                  label="Pagar" 
                  style={`px-5 ${buttonColorsScheme.green}`}
                  onClick={() => productOrders.actions.onPay && productOrders.actions.onPay()}
                />
              )}
                <Button 
                  type='button'
                  label="Cancelar pedido" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() => productOrders.actions.onCancel && productOrders.actions.onCancel()}
                />
                </>  
              ) : (order.orderStatus === 'REJECTED') ? (
                <>
                <Button 
                  type='button'
                  label="Remover do histórico" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() => productOrders.actions.onRemove && productOrders.actions.onRemove()}
                />
                <Button 
                  type='button'
                  label="Ver justificativa" 
                  style={`px-5 ${buttonColorsScheme.yellow}`}
                  onClick={() => productOrders.actions.onViewJustify && productOrders.actions.onViewJustify()}
                />           
                </>
              ) : (           
                <Button 
                  type='button'
                  label="Remover do histórico" 
                  style={`px-5 ${buttonColorsScheme.red}`}
                  onClick={() => productOrders.actions.onRemove && productOrders.actions.onRemove()}
                />
              )}
                </MoreActions>
              </motion.div>
            )})
          ) : (
            <NoContentFoundMessage
              text={'Nenhum resultado encontrado!'}
            />
          )
        )}
        </div>
      </div>
    </Modal>
  )
}

export default OrdersFromProductsMenu;