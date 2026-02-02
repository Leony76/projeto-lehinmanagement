"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import MoreActions from '../modal/MoreActions';
import { startTransition, useState } from 'react';
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs';
import { OrderProductDTO } from '@/src/types/orderProductDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder, removeOrderFromUserOrders, sendMessageAboutCustomerOrderSituation, updatedProductStock } from '@/src/actions/productActions';
import { motion } from 'framer-motion';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import { editOrderRejectionJustify as editRejectionJustify } from '@/src/actions/productActions';
import Input from '../form/Input';
import OrderSituationTopTag from '../ui/OrderSituationTopTag';
import OrderRequestDate from '../ui/OrderRequestDate';
import OrderRequestBy from '../ui/OrderRequestBy';
import OrderRequestQuantity from '../ui/OrderRequestQuantity';
import StockIfAccpeted from '../ui/StockIfAccpeted';
import OrderCommission from '../ui/OrderCommission';
import PaidTag from '../ui/PaidTag';
import MoreActionsChevronButton from '../ui/MoreActionsChevronButton';
import OrderSituationBottomTag from '../ui/OrderSituationBottomTag';

type Props = {
  order: OrderProductDTO;
}

const OrderProduct = ({order}:Props) => {

  const { showToast } = useToast();

  const userRole = useUserStore((stats) => stats.user?.role);

  const [moreActions, showMoreActions] = useState(false);  
  const datePutToSale = new Date(order.createdAt).toLocaleDateString("pt-BR");
  const orderDate = new Date(order.orderCreatedAt).toLocaleDateString("pt-BR");
  const stockIfOrderAccepted = (order.stock - order.orderedAmount); 
  const category = CATEGORY_LABEL_MAP[order.category];

  const router = useRouter();

  const [acceptanceOrderConfirm, showAcceptanceOrderConfirm] = useState<boolean>(false);
  const [rejectionJustifyConfirm, showRejectionJustifyConfirm] = useState<boolean>(false);
  const [orderRejectionJustify, showOrderRejectionJustify] = useState<boolean>(false);
  const [editOrderRejectionJustify, showEditOrderRejectionJustify] = useState<boolean>(false);
  const [productOuttaStockMessage, showProductOuttaStockMessage] = useState<boolean>(false);
  const [newOrderRejectionJustifyCorfirm, showNewOrderRejectionJustifyCorfirm] = useState<boolean>(false);
  const [resetProductStock, showResetProductStock] = useState<boolean>(false);
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
  const [newOrderRejectionJustify, setNewOrderRejectionJustify] = useState<string | null>(order.orderRejectionJustify)
  const [rejectionJustify, setRejectionJustify] = useState<string>('');
  const [messageAboutCustomerOrderSituation, setMessageAboutCustomerOrderSituation] = useState<string>('');
  
  const [newProductStock, setNewProductStock] = useState<number>(0);

  const handleAcceptOrder = async() => {

    if (loading.accepting) return;
    setLoading(prev => ({...prev, accepting: true}));

    try {
      await acceptRejectProductOrder(
        'APPROVED',
        order.orderId,
        order.id,
        order.orderedAmount,
      );

      showToast('Pedido aprovado com sucesso');
      showAcceptanceOrderConfirm(false);
    } catch(err:unknown) {
      showToast('Erro inesperado:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, accepting: false}));
      showMoreActions(false);
    }
  }

  const handleRejectOrder = async() => {

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
        order.orderId,
        order.id,
        order.orderedAmount,
        rejectionJustify
      );

      showToast('Pedido rejeitado com sucesso');
      showRejectionJustifyConfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, rejecting: false}));
      showMoreActions(false);
    }
  }

  const handleRemoveOrder = async() => {
    if (loading.removing || !userRole) return;
    setLoading(prev => ({...prev, removing: true}));

    try {
      await removeOrderFromUserOrders(
        order.orderId,
        order.orderStatus,
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
      showMoreActions(false);
    }
  };

  const handleEditOrderRejectionJustify = async() => {
    if (loading.editing) return;
    setLoading(prev => ({...prev, editing: true}));

    try {
      await editRejectionJustify(
        newOrderRejectionJustify ?? '',
        order.orderId,
      );

      showToast('Justificativa de rejeição do pedido editada com sucesso', 'success');
      showNewOrderRejectionJustifyCorfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, editing: false}));
      showMoreActions(false);
    }
  }

  const handleSendMessageAboutCustomerOrderSituation = async() => {
    if (loading.sending) return;
    setLoading(prev => ({...prev, sending: true}));

    try {
      await sendMessageAboutCustomerOrderSituation(
        order.orderId,
        order.orderStatus,
        messageAboutCustomerOrderSituation,
      );

      showToast('Mensagem mandada com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      showProductOuttaStockMessage(false);
      setLoading(prev => ({...prev, sending: false}));
      showMoreActions(false);
    }
  }

  const handleUpdateProductStock = async() => {
    if (loading.reseting) return;
    setLoading(prev => ({...prev, reseting: true}));

    try { 
      await updatedProductStock(
        order.id,
        newProductStock,
      );

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      showResetProductStock(false);
      setLoading(prev => ({...prev, reseting: false}));
      showMoreActions(false);
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
          src={order.imageUrl} 
          alt={order.name}
          fill
          className={productCardSetup.image}
          onClick={() => showMoreActions(false)}
        />
      </div>
    {order.orderPaymentStatus === 'PENDING' && order.orderStatus !== 'CANCELED' ? (
      <OrderSituationTopTag situation='Pagamento pendente'/>
    ) : order.orderStatus === 'CANCELED' ? (
      <OrderSituationTopTag situation='Cancelado pelo cliente'/>
    ) : order.orderStatus !== 'PENDING' ? (
      <OrderSituationTopTag situation='Analisado'/>
    ) : (
      <OrderSituationTopTag situation='Não analisado'/>
    )}
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => showMoreActions(false)}>
          <h3 className={productCardSetup.name}>{order.name}</h3>
          <div className={productCardSetup.categoryDateRatingContainer}>
            <div className={productCardSetup.categoryDate}>
              <span>{category}</span>
              <span className="text-[10px] text-gray-400">●</span>
              <span>{datePutToSale}</span>
            </div>
            <div className={productCardSetup.rating}>
              {!order.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
              }
              {order.productAverageRating ?? 'Não avaliado'}
            </div>
          </div>
          <div>
            <OrderRequestDate 
              orderDate={orderDate}
            />
            <OrderRequestBy 
              customerName={order.orderCustomerName ?? '[desconhecido]'}
            />
          </div>
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
        {(order.orderPaymentStatus === 'APPROVED' 
          && order.orderStatus !== 'APPROVED' 
          && order.orderStatus !== 'REJECTED' 
          && order.orderStatus !== 'CANCELED') 
          && !order.orderDeletedByCustomer 
          && (
          <PaidTag/>
        )}
        
        </div>
        <div className='flex gap-2 mt-1'>
        {order.orderStatus === 'APPROVED' ? (
          <>
          <MoreActionsChevronButton
            onClick={() => showMoreActions(!moreActions)}
            moreActions={moreActions}
          />
          <OrderSituationBottomTag
            situation={'Aprovado'}
          />
          </>
        ) : (order.orderStatus === 'CANCELED') ? (
          <>
          <MoreActionsChevronButton
            onClick={() => showMoreActions(!moreActions)}
            moreActions={moreActions}
          />
          <OrderSituationBottomTag
            situation={'Cancelado'}
          />
          </>
        ) : order.orderStatus === 'REJECTED' ? ( 
          <>
          <MoreActionsChevronButton
            onClick={() => showMoreActions(!moreActions)}
            moreActions={moreActions}
          />
          <OrderSituationBottomTag
            situation={'Rejeitado'}
          />
          </>
        ) :  order.orderPaymentStatus === 'APPROVED' 
          && order.orderStatus === 'PENDING' 
          && !order.orderDeletedByCustomer 
          && stockIfOrderAccepted >= 0 
          ? (
          <>
           <Button
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`}
            label='Aceitar'
            onClick={() => showAcceptanceOrderConfirm(true)}
          />
          <Button
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`}
            label='Rejeitar'
            onClick={() => showRejectionJustifyConfirm(true)}
          />
          </>
        ) : order.orderPaymentStatus === 'APPROVED' 
          && order.orderStatus === 'PENDING' 
          && !order.orderDeletedByCustomer 
          && stockIfOrderAccepted < 0  
          ? (
          <>
          <MoreActionsChevronButton
            onClick={() => showMoreActions(!moreActions)}
            moreActions={moreActions}
          />
          <OrderSituationBottomTag
            situation={'Estoque insuficiente'}
          />
          </>
        ) : (order.orderPaymentStatus !== 'APPROVED') && (
          <>
          <MoreActionsChevronButton
            onClick={() => showMoreActions(!moreActions)}
            moreActions={moreActions}
          />
          <OrderSituationBottomTag
            situation={'Pendente'}
          />
          </>
        )}
        </div>
      </div>
      
      <MoreActions 
      direction='left' 
      style={{container: 'mt-3'}} 
      moreActions={moreActions} 
      close={() => showMoreActions(false)}
      >
      {order.orderStatus !== 'CANCELED' && order.orderStatus === 'PENDING' ? (
        <>
        {stockIfOrderAccepted < 0 && (
          <>
          <Button 
            type='button'
            label="Repor estoque" 
            style={`px-5 ${buttonColorsScheme.secondary}`}
            onClick={() => showResetProductStock(true)}
          />
          <Button 
            type='button'
            label="Justificar ao cliente" 
            style={`px-5 ${buttonColorsScheme.yellow}`}
            onClick={() => showProductOuttaStockMessage(true)}
          />
          </>
        )}
        <Button 
          type='button'
          label="Rejeitar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRejectionJustifyConfirm(true)}
        />
        </>
      ) : ( order.orderStatus === 'REJECTED') ? (
        <>
        <Button 
          type='button'
          label="Remover do histórico" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRemoveOrder(true)}
        />
        <Button 
          type='button'
          label="Ver sua justificativa" 
          style={`px-5 ${buttonColorsScheme.yellow}`}
          onClick={() => showOrderRejectionJustify(true)}
        />
        {order.orderPaymentStatus === 'APPROVED' && (
          <Button 
            type='button'
            label="Aprovar pedido" 
            style={`px-5 ${buttonColorsScheme.green}`}
            onClick={() => showAcceptanceOrderConfirm(true)}
          />
        )}
        </>
      ) : (
        <Button 
          type='button'
          label="Remover do histórico" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRemoveOrder(true)}
        />
      )}
      </MoreActions>

      <Modal 
      isOpen={acceptanceOrderConfirm} 
      modalTitle={'Confirmar ação'}
      onCloseModalActions={() => {
        showAcceptanceOrderConfirm(false);
      }}
      >
        <p className={`${textColors.secondaryMiddleDark}`}>
          Tem certeza que aprova o pedido do cliente <span className='text-cyan'>{order.orderCustomerName}</span> de <span className='text-ui-stock'>{order.orderedAmount}</span> {order.orderedAmount > 1 
            ? 'unidades' 
            : 'unidade'
          } desse produto pela comissão de <span className='text-ui-money'>{formatCurrency(order.orderComission)}</span> ?
        </p>
        <span className='text-yellow-dark'>
          (!) Essa ação é irreversível
        </span>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            onClick={handleAcceptOrder}
            loading={loading.accepting}
            loadingLabel='Processando'
            spinnerColor='text-green'
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => showAcceptanceOrderConfirm(loading.accepting ? true : false)}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={rejectionJustifyConfirm} 
      modalTitle={'Confirmar ação'}
      onCloseModalActions={() => {
        showRejectionJustifyConfirm(false);
        setError('');
      }}
      >
        <p className={`${textColors.secondaryMiddleDark}`}>
          Tem certeza que rejeita o pedido do cliente <span className='text-cyan'>{order.orderCustomerName}</span> de <span className='text-ui-stock'>{order.orderedAmount}</span> {order.orderedAmount > 1 
            ? 'unidades' 
            : 'unidade'
          } desse produto pela comissão de <span className='text-ui-money'>{formatCurrency(order.orderComission)}</span> ?
        </p>
        <TextArea 
          style={{input: `mb-[-2px] h-30 ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          maxLength={1000}
          placeholder={'Justificativa'}
          label='Justificativa da rejeição'
          onChange={(e) => {
            setRejectionJustify(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
        <span className='text-yellow-dark'>
          (!) Essa ação pode ser revertida depois
        </span>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            loading={loading.rejecting}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={handleRejectOrder}
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => {
              showRejectionJustifyConfirm(false);
              setError('');
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={removeOrder} 
      modalTitle={'Remover pedido do cliente'} 
      onCloseModalActions={() => {
        showRemoveOrder(false);
      }}> 
        <p className='text-secondary-middledark'>
          Tem certeza que deseja remover esse pedido do cliente <span className='text-cyan'>{order.orderCustomerName}</span> do seu histórico de pedidos?
        </p>
        <p className='text-yellow-dark'>
          (!) Essa ação é irreversível
        </p>
        <div className='flex gap-4'>
          <Button 
            style={`flex-1 ${buttonColorsScheme.green}`} 
            type={'submit'}
            label='Sim'
            loading={loading.removing}
            loadingLabel='Processando'
            onClick={handleRemoveOrder}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'submit'}
            label='Não'     
            onClick={() => showRemoveOrder(false)}    
          />
        </div>
      </Modal>

      <Modal 
      isOpen={orderRejectionJustify} 
      modalTitle={'Sua justificativa de rejeição'} 
      onCloseModalActions={() => {
        showOrderRejectionJustify(false);
        showEditOrderRejectionJustify(false);
        setNewOrderRejectionJustify(order.orderRejectionJustify ?? '');
        setError('');
      }}
      >
      {editOrderRejectionJustify ? (
        <>
        <TextArea 
          placeholder={'Justificativa'}
          style={{input: 'mb-[-3px]'}}
          label='Justificativa'
          colorScheme='primary'
          value={newOrderRejectionJustify ?? ''}
          onChange={(e) => {
            setNewOrderRejectionJustify(e.target.value);
            setError('');
          }}
          onBlur={() => {
            if (newOrderRejectionJustify?.trim() === '') {
              setNewOrderRejectionJustify(order.orderRejectionJustify);
            }
          }}
        />
        {error && <Error error={error}/>}
        </>
      ) : (
        <div>
          <label className='text-secondary-dark'>Justificativa:</label>
          <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>{order.orderRejectionJustify}</p>
        </div>
      )}
       
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
            label='Editar'
            loading={loading.rejecting}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={() => {
              if (editOrderRejectionJustify) {
                if (newOrderRejectionJustify === order.orderRejectionJustify) {
                  setError('Nenhum caractere foi alterado para ser editado');
                  return;
                } else {
                  showNewOrderRejectionJustifyCorfirm(true);
                  showOrderRejectionJustify(false);
                }
              } else {
                showEditOrderRejectionJustify(true);
              }
            }}
          />
          <Button
            style={`px-5 ${editOrderRejectionJustify ? buttonColorsScheme.red + 'flex-1' : 'flex-3'} text-xl`}
            onClick={() => {
              if (editOrderRejectionJustify) {
                showEditOrderRejectionJustify(false);
                setNewOrderRejectionJustify(order.orderRejectionJustify ?? '');
                setError('');
              } else {
                showOrderRejectionJustify(false);
                setNewOrderRejectionJustify(order.orderRejectionJustify ?? '');
              }
            }}
            label={editOrderRejectionJustify ? 'Cancelar' : 'Voltar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={productOuttaStockMessage} 
      modalTitle={'Justificar ao cliente'} 
      onCloseModalActions={() => {
        showProductOuttaStockMessage(false);
        setError('');
      }}
      >
        <p className='text-secondary-dark'>
          Deixe para o cliente uma justificativa a cerca da situação atual de seu pedido.
        </p>
        <TextArea 
          placeholder={'Justificativa'}
          style={{input: `mb-[-3px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          label='Justificativa'
          colorScheme='primary'
          value={messageAboutCustomerOrderSituation}
          onChange={(e) => {
            setMessageAboutCustomerOrderSituation(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
   
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
            label='Mandar'
            loading={loading.sending}
            spinnerColor='text-yellow-dark'
            loadingLabel='Processando'
            onClick={() => {
              if (!messageAboutCustomerOrderSituation) {
                setError('Não se pode mandar uma mensagem vazia');
                return;
              } else {
                handleSendMessageAboutCustomerOrderSituation();
              }
            }}
          />
          <Button
            style={`px-5 flex-1 text-xl`}
            onClick={() => {
              showProductOuttaStockMessage(false);
              setError('');
            }}
            label={'Cancelar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={resetProductStock} 
      modalTitle={'Repor estoque'} 
      onCloseModalActions={() => {
        showResetProductStock(false);
        setError('');
      }}
      >
        <p className='text-secondary-dark'>
          Selecione a quantidade a ser reposta do estoque do produto pedido.
        </p>
        <Input 
          placeholder={'Quantidade'} 
          type={'number'}
          style={{input: `mb-[-5px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          onChange={(e) => {
            setNewProductStock(Number(e.target.value));
            setError('');
          }}
        />
        {error && <Error error={error}/>}
   
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl`} 
            label='Repor'
            colorScheme='primary'
            loading={loading.reseting}
            loadingLabel='Processando'
            onClick={() => {
              if (newProductStock <= 0) {
                setError('Não se pode repor com um valor menor ou igual a zero');
                return;
              } else {
                handleUpdateProductStock();
              }
            }}
          />
          <Button
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`}
            onClick={() => {
              showResetProductStock(false);
            }}
            label={'Cancelar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={newOrderRejectionJustifyCorfirm} 
      modalTitle={'Confirmar ação'} 
      onCloseModalActions={() => {
        showNewOrderRejectionJustifyCorfirm(false);
        showOrderRejectionJustify(true);
      }}>
        <p className='text-secondary-middledark'> 
          Tem certeza que deseja alterar sua justificativa de rejeição atual desse pedido ?
        </p>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            loading={loading.editing}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={handleEditOrderRejectionJustify}
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => {
              showNewOrderRejectionJustifyCorfirm(false);
              showOrderRejectionJustify(true);
            }}
          />
        </div>
      </Modal>
    </motion.div>
  )
}

export default OrderProduct;

