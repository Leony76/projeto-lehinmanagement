"use client";

import Image from 'next/image'
import { IoClose, IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP, PaymentOptionsValue, PaymentStatus } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, staticButtonColorScheme, textColors } from '@/src/constants/systemColorsPallet';
import StaticButton from '../ui/StaticButton';
import { FaChevronDown, FaRegClock } from 'react-icons/fa';
import { SetStateAction, useEffect, useState, useTransition } from "react";
import MoreActions from '../modal/MoreActions';
import { UserOrderDTO } from '@/src/types/userOrderDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import Modal from '../modal/Modal';
import Select from '../form/Select';
import { CgCloseO } from 'react-icons/cg';
import { FaCheck, FaRegCircleCheck } from 'react-icons/fa6';
import Error from '../ui/Error';
import { payForPeddingOrderPayment, removeOrderFromUserOrders } from '@/src/actions/productActions';
import { useToast } from '@/src/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { useUserStore } from '@/src/store/useUserStore';
import OrderProduct from '../modal/OrderProduct';

type Props = {
  userOrder: UserOrderDTO;
}

const MyOrderProduct = ({
  userOrder,
}:Props) => {
  const { showToast } = useToast();

  const userRole = useUserStore((stats) => stats.user?.role);

  const [loading, setLoading] = useState<boolean>(false);
  const [payOrder, showPayOrder] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [removeOrder, showRemoveOrder] = useState<boolean>(false);
  const [cancelOrder, showCancelOrder] = useState<boolean>(false);
  const [moreActions, showMoreActions] = useState<boolean>(false);
  const [makeAnotherOrder, showMakeAnotherOrder] = useState<boolean>(false);
  const [rejectionJustify, showRejectionJustify] = useState<boolean>(false);
  const [finishOrderPayment, showFinishOrderPayment] = useState<boolean>(false);
  const [userOrderProductInfo, showUserOrderProductInfo] = useState<boolean>(false);
  const [makeAnotherOrderConfirm, showMakeAnotherOrderConfirm] = useState<boolean>(false);
  const [messageAboutOrderSituation, showMessageAboutOrderSituation] = useState<boolean>(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const datePutToSale = new Date(userOrder.createdAt).toLocaleDateString("pt-BR");
  const orderDate = new Date(userOrder.orderDate ?? 1).toLocaleDateString("pt-BR");
  const orderSituationMessageSentAt = userOrder.messageSentAt
  ? new Date(userOrder.messageSentAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  : '';

  const category = CATEGORY_LABEL_MAP[userOrder.category];

  const [error, setError] = useState<string>('');

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOptionsValue | null>(null);

  const handlePayOrder = async() => {   
    if (loading || !paymentMethod) return;
    setLoading(true);

    try {
      await payForPeddingOrderPayment(
        paymentMethod,
        userOrder.orderTotalPrice,
        userOrder.orderId,
      );

      showToast('Pedido pago com sucesso', 'success');
      showFinishOrderPayment(false);
    } catch (err:unknown) {
      showToast('Ocoreeu um erro: ' + err, 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveOrder = async () => {
    if (loading || !userRole) return;
    setLoading(true);

    try {
      await removeOrderFromUserOrders(
        userOrder.orderId,
        userOrder.orderStatus,
        userRole,
        cancelOrder,
      );

      startTransition(() => {
        router.refresh(); 
      });

      if (cancelOrder) {
        showToast('Pedido cancelado com sucesso', 'success');
        showCancelOrder(false);
      } else {
        showToast('Pedido removido com sucesso', 'success');
        showRemoveOrder(false);
      }
    } catch (err: unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(false);
    }
  };

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
          src={userOrder.imageUrl} 
          alt={userOrder.name}
          fill
          className={productCardSetup.image}
          onClick={() => showMoreActions(false)}
        />
      </div>
    {(userOrder.orderPaymentStatus !== 'APPROVED' && userOrder.orderStatus !== 'CANCELED') ? (
      <StaticButton 
        value={'Pagamento pendente'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.red}`}
      />
    ) : (userOrder.orderStatus === 'APPROVED') ? (
      <StaticButton 
        value={'Aprovado'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.green}`}
      />
    ) : (userOrder.orderStatus === 'REJECTED') ? (
      <StaticButton 
        value={'Rejeitado'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.red}`}
      />
    ) : (userOrder.orderStatus === 'CANCELED') ? (
      <StaticButton 
        value={'Cancelado por você'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.red}`}
      />
    ) : (
      <StaticButton 
        value={'Em análise'} 
        style={`absolute top-3 left-3 ${staticButtonColorScheme.yellow}`}
      />
    )}
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => showMoreActions(false)}>

          <h3 className={productCardSetup.name}>{userOrder.name}</h3>
          <div className={productCardSetup.categoryDateRatingContainer}>
            <div className={productCardSetup.categoryDate}>
              <span>{category}</span>
              <span className="text-[10px] text-gray-400">●</span>
              <span>{datePutToSale}</span>
            </div>
            <div className={productCardSetup.rating}>
              {!userOrder.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
              }
              {userOrder.productAverageRating ?? 'Não avaliado'}
            </div>
          </div>
          <div>
            <h4 className='text-yellow-dark flex gap-1'>
              Data do pedido: 
              <span className='text-gray'>
                {orderDate}
              </span>
            </h4>
            <h4 className={`${productCardSetup.stock} flex gap-1`}>
              <span className='text-gray'>
                Quantidade pedida:
              </span> 
              {userOrder.orderAmount}
            </h4>
          </div>
          <h3 className='text-ui-money text-2xl truncate'>
            {formatCurrency(userOrder.orderTotalPrice)}
          </h3>
        </div>
        <div className='flex gap-2 mt-1'>
          {(userOrder.orderPaymentStatus === 'APPROVED' && userOrder.orderStatus !== 'CANCELED' && userOrder.orderStatus === 'PENDING') ? (
            <span className='flex py-1.5 items-center gap-1 justify-center w-full text-xl text-green'>
              <FaCheck size={24}/>
              Pago
            </span>
          ) : (userOrder.orderStatus === 'CANCELED') ? (
            <span className='flex py-1.5 items-center gap-1 justify-center w-full text-xl text-red'>
              <IoClose size={30}/>
              Cancelado
            </span>
          ) : (userOrder.orderStatus === 'APPROVED') ? (
            <span className='flex py-1.5 items-center gap-1 justify-center w-full text-xl text-green'>
              <FaCheck size={24}/>
              Aprovado
            </span>
          ) : (userOrder.orderStatus === 'REJECTED') ? (
            <span className='flex py-1.5 items-center gap-1 justify-center w-full text-xl text-red'>
              <IoClose size={30}/>
              Rejeitado
            </span>
          ) : (userOrder.orderPaymentStatus !== 'APPROVED' && userOrder.orderStatus === 'PENDING') && (
            <Button 
              type='button' 
              label='Pagar' 
              style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`}
              onClick={() => showPayOrder(true)}
            />
          )}
          <Button
            type='button'
            onClick={() => showMoreActions(!moreActions)}
            style={`px-5 flex items-center justify-center ${
              moreActions
                ? '!bg-gray border-gray! text-white hover:bg-gray/15! hover:text-gray!'
                : buttonColorsScheme.gray
            }`}
            icon={FaChevronDown}
            iconStyle={`transition-transform duration-300 ${
              moreActions ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </div>

      {/* ⇊ MODALS ⇊ */}

      <MoreActions 
      style={{container: 'mt-2'}} 
      direction='right' 
      moreActions={moreActions} 
      close={() => showMoreActions(false)}
      >
        <Button 
          type='button' 
          label="Ver informações" 
          style={`px-5 ${buttonColorsScheme.secondary}`}
          onClick={() => showUserOrderProductInfo(true)}
        />
      {(userOrder.orderSituationMessage) && (
        <Button 
          type='button' 
          label="Última mensagem do vendedor" 
          style={`px-5 text-sm py-1.5 !text-center ${buttonColorsScheme.yellow}`}
          onClick={() => showMessageAboutOrderSituation(true)}
        />
      )}
      {(userOrder.orderStatus === 'REJECTED') ? (
        <>
        <Button 
          type='button' 
          label="Ver Justificativa" 
          style={`px-5 ${buttonColorsScheme.yellow}`}
          onClick={() => showRejectionJustify(true)}
        />
        <Button 
          type='button' 
          label="Remover pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRemoveOrder(true)}
        />
        </>
      ) : (userOrder.orderStatus === 'APPROVED') ? (
        <>
        <Button 
          type='button' 
          label="Remover do histórico" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRemoveOrder(true)}
        />
        <Button 
          type='button' 
          label="Fazer outro pedido" 
          style={`px-5 ${buttonColorsScheme.green}`}
          onClick={() => showMakeAnotherOrder(true)}
        />
        </>
      ) : (
        userOrder.orderStatus === 'CANCELED' ? (
        <Button 
          type='button' 
          label="Remover pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRemoveOrder(true)}
        />
        ) : (
        <Button 
          type='button' 
          label="Cancelar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showCancelOrder(true)}
        />
        )
      )}      
      </MoreActions>

      <Modal 
      isOpen={messageAboutOrderSituation} 
      modalTitle={'Mensagem do vendedor'} 
      onCloseModalActions={() => {
        showMessageAboutOrderSituation(false);
      }}
      >
        <div>
          <h3 className='text-sm text-gray'>
            Autor(a) da mensagem
          </h3>
          <h4 className='text-xl text-cyan italic'>
            ~ {userOrder.sellerName} <span className='text-gray text-sm'>●</span> <span className='text-yellow-dark text-base'>{orderSituationMessageSentAt}</span>
          </h4>
        </div>
        <div>
          <label className='text-secondary-dark'>
            Mensagem:
          </label>
          <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>
            {userOrder.orderSituationMessage}
          </p>
        </div>

        <Button
          onClick={() => showMessageAboutOrderSituation(false)}
          label='Voltar'
          type='button'
        />
      </Modal>


      <Modal 
      isOpen={payOrder} 
      modalTitle={'Pagar pedido'} 
      hasXClose
      onCloseModalActions={() => {
        setError('');
        showPayOrder(false);
        setPaymentMethod(null);
        setPaymentStatus(!paymentMethod ? 'PENDING' : paymentStatus);
      }}
      >
        <p className='flex gap-1 text-gray'>Foi Pedido: 
          <span className={textColors.uiMoney}>
            {formatCurrency(userOrder.price)}
          </span>
          x
          <span className={textColors.uiStock}>
            {userOrder.orderAmount}
          </span>
        </p>
        <p className='text-2xl flex gap-1 text-ui-money'>
          <span className={textColors.gray}>
            Total:
          </span>
          {formatCurrency(userOrder.orderTotalPrice)}
        </p>
        <div className='flex -mb-1.75'>
          <Select 
            style={{input: `w-[97%] text-sm py-1.5 rounded-3xl ${error ? 'shadow-[0px_0px_5px_red]' : ''}`, container: 'flex-5'}} 
            selectSetup={'PAYMENT'} 
            hasTopLabel 
            label={'Escolha um método de pagamento'}
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentOptionsValue);
              setError('');
            }}
          />
          <div className="flex flex-1 items-center gap-1 justify-center mb-1 text-lg font-bold self-end">
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
        {error && <Error error={error}/>}
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
                ? 'bg-red-100 text-red border-red pointer-events-none'
                : ''
          }`}
          colorScheme="primary"
          disabled={
            !!(paymentStatus !== 'APPROVED' && paymentMethod)
          }
          onClick={() => {
            if (!paymentMethod) {
              setError('Escolher um método de pagamento é obrigatório');
              return;
            } 
            showPayOrder(false);
            showFinishOrderPayment(true);
          }}
        />
      </Modal>
      
      <Modal 
        isOpen={finishOrderPayment} 
        modalTitle={'Finalizar pagamento'} 
        onCloseModalActions={() => {
          showFinishOrderPayment(false);
          showPayOrder(true);
        }}
      >
        <p className='text-secondary-dark'>
          Tem certeza que quer finalizar o pagamento desse pedido?
        </p>
        <p className='text-sm text-yellow-dark'>
          (!) Você pode cancelar o pedido para obter reembolso caso ainda não tenha sido  aprovado pelo vendedor
        </p>
        <div className='flex gap-4'>
          <Button 
            style={`flex-1 ${buttonColorsScheme.green}`} 
            type={'submit'}
            label='Sim'
            loading={loading}
            loadingLabel='Processando'
            onClick={handlePayOrder}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'submit'}
            label='Não'
            onClick={() => {
              if (loading) return;
              showFinishOrderPayment(false);
              showPayOrder(true);            
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={rejectionJustify} 
      modalTitle={'Justificativa de rejeição'} 
      onCloseModalActions={() => {
        showRejectionJustify(false);
      }}
      >
        <div>
          <h3 className='text-sm text-gray'>Autor(a) da justificativa</h3>
          <h4 className='text-xl text-cyan italic'>~ {userOrder.orderRejectedBy}</h4>
        </div>
        <div>
          <label className='text-secondary-dark'>Justificativa:</label>
          <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>{userOrder.orderRejectionJustify}</p>
        </div>

        <Button
          onClick={() => showRejectionJustify(false)}
          label='Voltar'
          type='button'
        />
      </Modal>

      <Modal 
      isOpen={removeOrder || cancelOrder} 
      modalTitle={
        removeOrder 
        ? 'Remover pedido' 
        : 'Cancelar pedido'
      } 
      onCloseModalActions={() => {
        if (removeOrder) {
          showRemoveOrder(false);
        } else {
          showCancelOrder(false);
        }
      }}
      >
        <p className='text-secondary-dark'>{
          removeOrder 
          ? 'Tem certeza que deseja remover esse pedido ?' 
          : 'Tem certeza que deseja cancelar esse pedido ?'
        } </p>
        <p className='text-sm text-yellow-dark'>{
          removeOrder
          ? '(!) Você pode o pedir novamente na aba "Produtos"'  
          : '(!) Essa ação é irrervesível'
        }</p>
      {userOrder.orderPaymentStatus === 'APPROVED' && cancelOrder && (
        <p className='text-secondary-middledark text-sm'>
          Por você já ter pago pelo pedido, será reembolsado a devida quantia em sua conta novamente!
        </p>
      )}
        <div className='flex gap-4'>
          <Button 
            style={`flex-1 ${buttonColorsScheme.green}`} 
            type={'submit'}
            label='Sim'
            loading={loading}
            loadingLabel='Processando'
            onClick={handleRemoveOrder}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'submit'}
            label='Não'     
            onClick={() => {
              if (removeOrder) {
                showRemoveOrder(false);
              } else {
                showCancelOrder(false);
              }
            }}    
          />
        </div>
      </Modal>

      <Modal 
      isOpen={userOrderProductInfo} 
      modalTitle={'Informações'}
      hasXClose 
      onCloseModalActions={() => {
        showUserOrderProductInfo(false);
      }}
      >
        <div className='flex sm:flex-row h-full sm:max-h-full max-h-[70vh] overflow-y-auto h flex-col gap-5 mt-2'>
          <div className='flex-1 relative aspect-square'>
            <Image 
              src={userOrder.imageUrl} 
              alt={userOrder.name}            
              fill
              className='rounded-2xl object-cover aspect-square cursor-zoom-in'
              onClick={() => {
                setExpandImage(true);
                showUserOrderProductInfo(false);
              }}
            />
          </div>
          <div className='flex bg-primary-ultralight/25 p-2 rounded-2xl flex-col gap-1.5 flex-2'>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Nome
              </label>
              <span className='text-secondary-dark'>
                {userOrder.name}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Categoria
              </label>
              <span className='text-secondary-dark'>
                {category}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Descrição
              </label>
              <span className='h-30 overflow-y-auto  
              hover:scrollbar-thumb-primary-light
              scrollbar-thumb-primary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin text-secondary-dark flex-col'>
                {userOrder.description}
              </span>
            </div>
            <div className='flex gap-10'>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Preço unitário
                </label>
                <span className='text-secondary-dark'>
                  {formatCurrency(userOrder.price)}
                </span>
              </div>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Foi pedida
                </label>
                <span className='text-secondary-dark'>
                  {userOrder.orderAmount}
                </span>
              </div>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Total
                </label>
                <span className='text-secondary-dark'>
                  {formatCurrency(userOrder.orderTotalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
      isOpen={expandImage} 
      modalTitle={''} 
      onCloseModalActions={() => {
        setExpandImage(false);
        showUserOrderProductInfo(true);
      }}>
        <div className='relative aspect-square h-[90vh]'>
          <Image 
            src={userOrder.imageUrl} 
            alt={userOrder.name}            
            fill
            className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
            onClick={() => {
              setExpandImage(false);
              showUserOrderProductInfo(true);
            }}
          />
        </div>
      </Modal>
 
      <OrderProduct 
        isOpen={makeAnotherOrder}
        confirmModal={makeAnotherOrderConfirm}      
        showOrderProductMenu={showMakeAnotherOrder}
        showConfirmModal={showMakeAnotherOrderConfirm}
        selectedProduct={{
          id: userOrder.id,
          name: userOrder.name,
          category: userOrder.category,
          createdAt: userOrder.createdAt,
          description: userOrder.description,
          imageUrl: userOrder.imageUrl,
          price: userOrder.price,
          stock: userOrder.stock,
          sellerName: null,
          sellerRole: null,
          sellerId: '',
          productAverageRating: null,
        }} 
      />
    </motion.div>
  )
}

export default MyOrderProduct;

