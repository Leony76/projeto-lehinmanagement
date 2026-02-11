import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import React from 'react'
import { LuInfo } from 'react-icons/lu';
import Button from '../../form/Button';
import Modal from '../Modal';

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  loading: boolean;
  onClick: {
    yes: () => void,
    no: () => void,
  };
}

const RemoveUserProduct = ({
  isOpen,
  onCloseActions,
  onClick,
  loading,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={'Excluir produto'} 
    onCloseModalActions={onCloseActions}
    >
      <p className='text-secondary-dark'>
        Tem certeza que deseja excluir esse produto ?
      </p>
      <p className='text-yellow-dark flex items-center gap-1'>
        <LuInfo size={20}/> 
        Essa ação é inrreversível
      </p>
      <div className='flex gap-3 text-lg'>
        <Button 
          type={'submit'}
          label='Sim'
          loading={loading}
          loadingLabel='Removendo'
          style={`${buttonColorsScheme.green} flex-1`}
          onClick={onClick.yes}
        />
        <Button 
          type={'submit'}
          label='Não'
          style={`${buttonColorsScheme.red} flex-1`}
          onClick={onClick.no}
        />
      </div>
    </Modal>
  )
}

export default RemoveUserProduct