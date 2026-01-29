"use client";

import Image from 'next/image'
import { IoClose, IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import MoreActions from '../modal/MoreActions';
import { useState } from 'react';
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs';
import { OrderProductDTO } from '@/src/types/orderProductDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder } from '@/src/actions/productActions';
import { MdOutlinePending } from 'react-icons/md';
import { motion } from 'framer-motion';

type Props = {
  order: OrderProductDTO;
}

const OrderProduct = ({order}:Props) => {

  const { showToast } = useToast();

  const [moreActions, showMoreActions] = useState(false);  
  const datePutToSale = new Date(order.createdAt).toLocaleDateString("pt-BR");
  const orderDate = new Date(order.orderCreatedAt).toLocaleDateString("pt-BR");
  const stockIfOrderAccepted = (order.stock - order.orderedAmount); 
  const category = CATEGORY_LABEL_MAP[order.category];

  const [acceptanceOrderConfirm, showAcceptanceOrderConfirm] = useState<boolean>(false);
  const [rejectionJustifyConfirm, showRejectionJustifyConfirm] = useState<boolean>(false);

  const [loading, setLoading] = useState<{
    rejecting: boolean;
    accepting: boolean;
  }>({
    rejecting: false,
    accepting: false,
  });

  const [error, setError] = useState<string>('');
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
      // ${isPending ? "opacity-25 grayscale" : "opacity-100"}
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
    {order.orderPaymentStatus === 'PENDING' ? (
      <div className='absolute top-3 left-3 text-red-dark bg-red-100 w-fit py-1 px-3 rounded-2xl border border-red'>
        Pagamento pendente
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
          {(order.orderStatus === 'REJECTED' || order.orderStatus === 'PENDING') && (
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

        {(order.orderPaymentStatus === 'APPROVED' && order.orderStatus !== 'APPROVED') && (
          <span className='flex py-1.5 items-center gap-1 bg-linear-to-r from-transparent via-green/10 to-transparent justify-center w-full text-xl text-green'>
            <FaCheck size={24}/>
            Pago
          </span>
        )}
        
        </div>
        <div className='flex gap-2 mt-1'>
        {order.orderStatus === 'DELETED_BY_USER' && order.orderPaymentStatus === 'APPROVED' ? (
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
        ) : order.orderStatus === 'DELETED_BY_USER' && order.orderPaymentStatus !== 'APPROVED' ? (
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
        ) : order.orderStatus === 'APPROVED' ? (
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
        ) : order.orderPaymentStatus === 'APPROVED' && order.orderStatus === 'PENDING' ? (
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
        ) : (
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

      <MoreActions direction='left' style={{container: 'mt-3'}} moreActions={moreActions} close={() => showMoreActions(false)}>
        <Button 
          type='button'
          label="Cancelar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
        />
        <Button 
          type='button'
          label="Cancelar pedido" 
          style={`px-5 ${buttonColorsScheme.red}`}
        />
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
    </motion.div>
  )
}

export default OrderProduct;

{/* <Button style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} label='Cancelado pelo cliente'/> */}