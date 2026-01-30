"use client";

import Image from 'next/image'
import { IoClose, IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import MoreActions from '../modal/MoreActions';
import { startTransition, useState } from 'react';
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs';
import { OrderProductDTO } from '@/src/types/orderProductDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder, removeOrderFromUserOrders } from '@/src/actions/productActions';
import { MdOutlinePending } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import { editOrderRejectionJustify as editRejectionJustify } from '@/src/actions/productActions';


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
  const [newOrderRejectionJustifyCorfirm, showNewOrderRejectionJustifyCorfirm] = useState<boolean>(false);
  const [removeOrder, showRemoveOrder] = useState<boolean>(false);

  const [loading, setLoading] = useState<{
    rejecting: boolean;
    accepting: boolean;
    removing: boolean;
    editing: boolean;
  }>({
    rejecting: false,
    accepting: false,
    removing: false,
    editing: false,
  });

  const [error, setError] = useState<string>('');
  const [newOrderRejectionJustify, setNewOrderRejectionJustify] = useState<string | null>(order.orderRejectionJustify)
  const [rejectionJustify, setRejectionJustify] = useState<string>('');
  
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
      <div className='absolute top-3 left-3 text-red-dark bg-red-100 w-fit py-1 px-3 rounded-2xl border border-red'>
        Pagamento pendente
      </div>
    ) : order.orderStatus === 'CANCELED' ? (
      <div className='absolute top-3 left-3 text-red-dark bg-red-100 w-fit py-1 px-3 rounded-2xl border border-red'>
        Cancelado pelo cliente
      </div>
    ) : order.orderStatus !== 'PENDING' ? (
      <div className='absolute top-3 left-3 text-green bg-green-100 w-fit py-1 px-3 rounded-2xl border border-green'>
        Analisado
      </div>
    ) : (
      <div className='absolute top-3 left-3 text-yellow-dark bg-yellow-100 w-fit py-1 px-3 rounded-2xl border border-yellow'>
        Não analisado
      </div>
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
              <IoStar/>
              {4}
            </div>
          </div>
          <div>
            <h4 className='text-yellow-dark flex gap-1'>
              Data do pedido: 
              <span className='text-gray'>
                {orderDate}
              </span></h4>
            <h4 className='text-yellow-dark xl:text-[14px] flex gap-1 line-clamp-1 truncate'>
              Pedido por: 
              <span className='text-cyan '>
                {getNameAndSurname(order.orderCustomerName)}
              </span></h4>
          </div>
          <div>
            <h4 className='text-gray flex gap-1'>
              Quantidade pedida: 
              <span className='text-ui-stock'>
                {order.orderedAmount}
              </span>
            </h4>
          {(order.orderStatus !== 'CANCELED' && order.orderStatus !== 'APPROVED' &&  order.orderStatus !== 'REJECTED') && (
            <h4 className='text-gray flex gap-1'>
              Estoque se aceito: 
              <span className='text-ui-stock'>
                {stockIfOrderAccepted}
              </span>
            </h4>
          )}
          </div>
          <h3 className='text-gray text-xl w-full lg:text-lg md:text-xl sm:text-2xl sm:max-w-87.5 max-w-68.5 flex gap-1'>
            Comissão: 
            <span className='text-ui-money truncate '>
              {formatCurrency(order.orderComission)}
            </span>
          </h3>

        {(order.orderPaymentStatus === 'APPROVED' && order.orderStatus !== 'APPROVED' && order.orderStatus !== 'REJECTED' && !order.orderDeletedByCustomer && order.orderStatus !== 'CANCELED') && (
          <span className='flex py-1.5 items-center gap-1 bg-linear-to-r from-transparent via-green/10 to-transparent justify-center w-full text-xl text-green'>
            <FaCheck size={24}/>
            Pago
          </span>
        )}
        
        </div>
        <div className='flex gap-2 mt-1'>
        {order.orderStatus === 'APPROVED' ? (
          <>
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
          <span className='flex py-1.5 items-center gap-1 justify-center w-full text-xl text-green'>
            <FaCheck size={24}/>
            Aprovado
          </span>
          </>
        ) : (order.orderStatus === 'CANCELED') ? (
          <>
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
          <span className='flex items-center py-1.5 gap-1 justify-center w-full text-xl text-red-dark'>
            <IoClose size={30}/>
            Cancelado
          </span>
          </>
        ) : order.orderStatus === 'REJECTED' ? ( 
          <>
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
          <span className='flex items-center py-1.5 gap-1 justify-center w-full text-xl text-red-dark'>
            <IoClose size={30}/>
            Rejeitado
          </span>
          </>
        ) : order.orderPaymentStatus === 'APPROVED' && order.orderStatus === 'PENDING' && !order.orderDeletedByCustomer ? (
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
        ) : (order.orderPaymentStatus !== 'APPROVED') && (
          <>
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
          <span className='flex items-center py-1.5 gap-1 justify-center w-full text-xl text-yellow-dark'>
            <MdOutlinePending size={24}/>
            Pendente
          </span>
          </>
        )}
        </div>
      </div>
      
      {/* ⇊ MODALS ⇊ */}
{/* order.orderPaymentStatus !== 'APPROVED' && !order.orderDeletedByCustomer && order.orderPaymentStatus !== 'CANCELED' && order.orderStatus !== 'REJECTED' */}
      <MoreActions direction='left' style={{container: 'mt-3'}} moreActions={moreActions} close={() => showMoreActions(false)}>
      {order.orderStatus !== 'CANCELED' && order.orderStatus === 'PENDING' ? (
        <Button 
          type='button'
          label="Rejeitar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
          onClick={() => showRejectionJustifyConfirm(true)}
        />
      ) :  order.orderStatus === 'REJECTED' ? (
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
        <Button 
          type='button'
          label="Aprovar pedido" 
          style={`px-5 ${buttonColorsScheme.green}`}
          onClick={() => showAcceptanceOrderConfirm(true)}
        />
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

{/* <Button style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} label='Cancelado pelo cliente'/> */}