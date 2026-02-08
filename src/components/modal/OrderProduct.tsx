"use client";

import Input from '../form/Input'
import Select from '../form/Select'
import Button from '../form/Button'
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet'
import Modal from './Modal'
import { useEffect, useState } from 'react';
import { ProductDTO } from '@/src/types/productDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { PaymentOptionsValue, PaymentStatus } from '@/src/constants/generalConfigs';
import { FaRegCircleCheck, FaRegClock } from 'react-icons/fa6';
import { CgCloseO } from 'react-icons/cg';
import { orderProduct } from '@/src/actions/productActions';
import Error from '../ui/Error';
import { useToast } from '@/src/contexts/ToastContext';
import { ProductPageModals } from '@/src/types/modal';

type Props = {
  activeModal: ProductPageModals | null;
  setActiveModal: React.Dispatch<React.SetStateAction<ProductPageModals | null>>;
  selectedProduct: ProductDTO | null;
}

const OrderProduct = ({
  selectedProduct,
  setActiveModal,
  activeModal,
}:Props) => {  
  const { showToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  
  const [error, setError] = useState<string>('');
  
  const [amountTobeOrdered, setAmountTobeOrdered] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOptionsValue | null>(null);

  const totalOrderPrice = (amountTobeOrdered ?? 1) * (selectedProduct?.price ?? 0);

  const handleOrderProduct = async() => {
    if (!selectedProduct || loading) return;

    setLoading(true);

    try {
      await orderProduct(
        selectedProduct.id,
        totalOrderPrice,
        amountTobeOrdered ?? 1,   
        paymentMethod,
      );

      setPaymentStatus('PENDING');
      setActiveModal(null);
      setAmountTobeOrdered(null);
      setPaymentMethod(null);

      showToast('Produto pedido com sucesso');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error')
    } finally {
      setLoading(false);
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

  return (
    <>
    <Modal 
      hasXClose
      isOpen={activeModal === 'ORDER_PRODUCT_MENU'} 
      modalTitle='Pedir produto' 
      onCloseModalActions={() => {
        setActiveModal(null);
        setPaymentStatus(!paymentMethod ? 'PENDING' : paymentStatus);
        setAmountTobeOrdered(null);
        setPaymentMethod(null);
      }}
    >
      <p className={`${textColors.secondaryDark}`}>
        Peça uma quantidade dentro do estoque disponível.
      </p>
      <div className='flex items-center text-base'>
        <span className={`flex-1 text-lg flex gap-1 ${textColors.gray}`}>
          Estoque: 
          <span className='text-ui-stock'>
            {selectedProduct?.stock ?? 'Sem informação'}
          </span>
        </span>
        <div className='w-[60%] space-y-1'>
          <Input
            style={{input: error ? 'shadow-[0px_0px_5px_red]' : ''}}
            miscConfigs={{
              min: 1,
              max: selectedProduct?.stock,
            }}
            type="number"
            placeholder="Insira a quantidade"
            value={amountTobeOrdered ?? ""}
            onChange={(e) => {
              setAmountTobeOrdered(e.target.value === "" ? null : Number(e.target.value));
              setError('');
            }}
            onBlur={() => {
              if (!selectedProduct) return;

              const max = selectedProduct.stock;
              const min = 1;

              let value = Math.floor(Number(amountTobeOrdered));

              if (Number.isNaN(value)) value = min;
              value = Math.max(min, Math.min(max, value));

              setError('');
              setAmountTobeOrdered(value);
            }}
          />
          {error && <Error error={error}/>}
        </div>
      </div>
      <p className={`${textColors.gray} flex gap-2`}>
        A ser pedido:  
        <span className={textColors.uiMoney + ' dark:brightness-[1.4]'}> 
          {formatCurrency(selectedProduct?.price ?? 0)} 
        </span> 
        x 
        <span className={textColors.uiStock}> 
          {amountTobeOrdered ?? '?'}
        </span>
      </p>
      <h3 className={`text-2xl ${textColors.gray} flex gap-2`}>
        Total: 
        <span className={textColors.uiMoney + ' dark:brightness-[1.4]'}>
          {formatCurrency(totalOrderPrice)}
        </span>
      </h3>
      <p className={`text-sm ${textColors.secondaryMiddleDark}`}>
        O pagamento pode ser efetuado agora ou depois, disponível na aba de ‘meus pedidos’. O pedido no entanto só poderá ser processado ao ser pago, ficando ‘pendende’ se não for.
      </p>
      <div className='flex'>
        <Select 
          style={{input:'text-sm py-1.5 rounded-3xl', container: 'w-[90%]'}} 
          selectSetup={'PAYMENT'} 
          hasTopLabel 
          label={'Pagamento'}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentOptionsValue)}
        />
        <div className="flex flex-1 items-center gap-1 mb-1 text-lg font-bold self-end">
          {paymentStatus === 'PENDING' && (
            <span className="flex items-center tracking-wider gap-1 dark:brightness-[1.4] text-yellow-dark">
              <FaRegClock size={20} /> PENDENTE
            </span>
          )}

          {paymentStatus === 'PROCESSING' && (
            <span className="flex items-center gap-1 text-gray dark:brightness-[1.4] animate-pulse">
              <div className="h-4 w-4 border-2 border-blue-gray border-t-transparent rounded-full animate-spin" />
              PROCESSANDO...
            </span>
          )}

          {paymentStatus === 'APPROVED' && (
            <>
            <span className="flex items-center gap-1 dark:brightness-[1.4] text-green">
              <FaRegCircleCheck  size={20} /> APROVADO
            </span>          
            </>
          )}

          {paymentStatus === 'DENIED' && (
            <>
            <span className="flex items-center gap-1 dark:brightness-[1.4] text-red">
              <CgCloseO size={23} /> REJEITADO
            </span>        
            </>
          )}
        </div>
      </div>
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
            if (!amountTobeOrdered) {
              setError('Insira a quantidade que deseja pedir');
              return;
            } 
            setActiveModal('CONFIRM_ORDER');
          }}
      />
    </Modal>

    <Modal    
    isOpen={activeModal === 'CONFIRM_ORDER'} 
    modalTitle={'Confirmar pedido'} 
    onCloseModalActions={() => {
      setActiveModal('ORDER_PRODUCT_MENU');
      setPaymentMethod(null);
    }} 
    >
      <p className={textColors.secondaryDark}>
        Tem certeza que deseja pedir <span className={textColors.uiStock}>{amountTobeOrdered}</span> {(amountTobeOrdered ?? 1) > 1 ? 'unidades' : 'unidade'} desse produto por <span className='text-ui-money dark:brightness-[1.3]'>{formatCurrency(totalOrderPrice)}</span> ? 
      </p>
    {paymentStatus === 'APPROVED' ? (
      <p className={`text-sm ${textColors.secondaryMiddleDark}`}>
        Após o pedido, você terá o direito de o cancelar e receber o reembolso a qualquer momento desde que o mesmo ainda não tenha sido processado pelo vendedor. Caso o pedido seja rejeitado ou cancelado pelo vendedor ou administrador, será avisado sobre as circunstâncias de tal e reembolsado a valor do pedido
      </p>
    ) : (
      <>
      <p className={`text-sm ${textColors.secondaryMiddleDark}`}>
        Após o pedido, você terá o direito de o cancelar a qualquer momento na aba 'Meus pedidos'.
      </p>
      <p className={`text-sm ${textColors.yellow}`}>
        (!) Você não efetuou o pegamento. O seu pedido ficará em pendente até ser pago e poder ser processado.
      </p>
      </>
    )}
      <div className='flex gap-2 mt-2'>
        <Button 
          type='submit' 
          style={`text-xl flex-1 ${buttonColorsScheme.green}`} 
          label='Sim'
          onClick={handleOrderProduct}
          loading={loading}
          loadingLabel='Processando'
          spinnerColor='green'
        />
        <Button 
          type='button' 
          onClick={() => setActiveModal('ORDER_PRODUCT_MENU')} 
          style={`text-xl flex-1 ${buttonColorsScheme.red}`} 
          label='Não'
        />
      </div>
    </Modal>
    </>
  )
}

export default OrderProduct