import React from 'react'
import Modal from '../Modal';
import { textColors, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Button from '../../form/Button';
import { SystemRoles } from '@/src/constants/generalConfigs';

type Props = {
  modal: {
    isOpen: boolean;
    onCloseActions: () => void;
  };
  user: {
    role: SystemRoles | undefined;
  };
  onClick: {
    yes: () => void;
    no: () => void;
  }
}

const ConfirmRemove = ({
  modal,
  user,
  onClick,
}:Props) => {
  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={'Confirmar remoção'}
    onCloseModalActions={modal.onCloseActions}
    >
      <p className={textColors.secondaryDark}>Tem certeza que deseja tirar esse produto de venda ?</p>
      {user?.role !== 'ADMIN' && <p className={textColors.secondaryMiddleDark}>Caso o queira à venda novamente depois, basta o pôr na aba 'Produtos removidos'.</p>}
      <p className='text-sm text-yellow-dark'>*Clientes que tivem pedidos pendentes do mesmo serão automaticamente reembolsados caso tiverem já tenham pago pelo pedido.</p>
      <div className='flex gap-2'>
        <Button 
          type={'button'}
          label='Sim'
          style={`flex-1 ${buttonColorsScheme.green}`}
          onClick={onClick.yes}
          />
        <Button 
          type={'button'}
          label='Não'
          style={`flex-1 ${buttonColorsScheme.red}`}
          onClick={onClick.no}
        />
      </div>
    </Modal>
  )
}

export default ConfirmRemove