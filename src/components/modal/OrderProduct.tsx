"use client";

import Input from '../form/Input'
import Select from '../form/Select'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import Button from '../form/Button'
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet'
import Modal from './Modal'
import { useState } from 'react';
import { ProductDTO } from '@/src/types/form/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

type Props = {
  isOpen: boolean;
  showOrderProductMenu: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: ProductDTO | null;
}

const OrderProduct = ({
  selectedProduct,
  showOrderProductMenu, 
  isOpen
}:Props) => {  

  const [confirmModal, showConfirmModal] = useState(false);
  const [amountTobeOrdered, setAmountTobeOrdered] = useState<number | null>(null);

  const totalOrderPrice = (amountTobeOrdered ?? 1) * (selectedProduct?.price ?? 0);

  return (
    <>
    <Modal 
      hasXClose
      isOpen={isOpen} 
      modalTitle='Pedir produto' 
      openedModal={showOrderProductMenu}
    >
      <p className={`${textColors.secondaryDark}`}>
        Peça uma quantidade dentro do estoque disponível.
      </p>
      <div className='flex items-center text-base'>
        <span className={`flex-1 ${textColors.uiStock}`}>
          Estoque: {selectedProduct?.stock ?? 'Sem informação'}
        </span>
        <Input
          style={{ container: 'w-[60%]' }}
          miscConfigs={{
            min: 1,
            max: selectedProduct?.stock,
          }}
          type="number"
          placeholder="Insira a quantidade"
          value={amountTobeOrdered ?? ""}
          onChange={(e) => {
            setAmountTobeOrdered(e.target.value === "" ? null : Number(e.target.value));
          }}
          onBlur={() => {
            if (!selectedProduct) return;

            const max = selectedProduct.stock;
            const min = 1;

            let value = Math.floor(Number(amountTobeOrdered));

            if (Number.isNaN(value)) value = min;
            value = Math.max(min, Math.min(max, value));

            setAmountTobeOrdered(value);
          }}
        />
      </div>
      <p className={`${textColors.gray} flex gap-2`}>
        A ser pedido:  
        <span className={textColors.uiMoney}> 
          {formatCurrency(selectedProduct?.price ?? 0)} 
        </span> 
        x 
        <span className={textColors.uiStock}> 
          {amountTobeOrdered}
        </span>
      </p>
      <h3 className={`text-2xl ${textColors.gray} flex gap-2`}>
        Total: 
        <span className={textColors.uiMoney}>
          {formatCurrency(totalOrderPrice)}
        </span>
      </h3>
      <p className={`text-sm ${textColors.secondaryMiddleDark}`}>
        O pagamento pode ser efetuado agora ou depois, disponível na aba de ‘meus pedidos’. O pedido no entanto só poderá ser processado ao ser pago, ficando ‘pendende’ se não for.
      </p>
      <div className='flex'>
        <Select 
          style={{input:'w-[90%] text-sm py-1.5 rounded-3xl'}} 
          selectSetup={'PAYMENT'} 
          hasTopLabel 
          label={'Pagamento'}
        />
        <span className='flex flex-1 mb-1 text-lg font-bold self-end items-center gap-1 text-green'>
          <IoIosCheckmarkCircleOutline size={20}/>
          APROVADO
        </span>
      </div>
      <Button 
        type='button'
        style='mt-2 text-lg' label='Prosseguir' 
        colorScheme='primary'
        onClick={() => {
          showConfirmModal(true); 
          showOrderProductMenu(false)
        }} 
      />
    </Modal>

    <Modal    
      isOpen={confirmModal} 
      modalTitle={'Confirmar pedido'} 
      openedModal={showConfirmModal} 
      reopenPrevModal={showOrderProductMenu}
    >
      <p className={textColors.secondaryDark}>
        Tem certeza que deseja pedir <span className={textColors.uiStock}>{amountTobeOrdered}</span> {(amountTobeOrdered ?? 1) > 1 ? 'unidades' : 'unidade'} desse produto por <span className={textColors.uiMoney}>{formatCurrency(totalOrderPrice)}</span> ? 
      </p>
      <p className={`text-sm ${textColors.secondaryMiddleDark}`}>
        Após o pedido, você terá o direito de o cancelar e receber o reembolso ( caso tenha pago no momentodo pedido ) a qualquer momento desde que o mesmo ainda não tenha sido processado pelo vendedor. Caso o pedido seja rejeitado ou cancelado pelo vendedor ou administrador, será avisado sobre as circunstâncias de tal
      </p>
      <p className={`text-sm ${textColors.yellow}`}>
        (!) Você não efetuou o pegamento. O seu pedido ficará em pendente até ser pago e poder ser processado.
      </p>
      <div className='flex gap-2 mt-2'>
        <Button 
          type='submit' 
          style={`text-xl flex-1 ${buttonColorsScheme.green}`} 
          label='Sim'
        />
        <Button 
          type='button' 
          onClick={() => {showConfirmModal(false); showOrderProductMenu(true)}} 
          style={`text-xl flex-1 ${buttonColorsScheme.red}`} 
          label='Não'
        />
      </div>
    </Modal>
    </>
  )
}

export default OrderProduct