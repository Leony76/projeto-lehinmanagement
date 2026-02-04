import React from 'react'
import Modal from '../Modal';
import Input from '../../form/Input';
import Error from '../../ui/Error';
import Button from '../../form/Button';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  error: string;
  loading: boolean;
}

const ResetProductStock = ({
  isOpen,
  onCloseActions,
  onChange,
  onReset,
  error,
  loading,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={'Repor estoque'} 
    onCloseModalActions={onCloseActions}
    >
      <p className='text-secondary-dark'>
        Selecione a quantidade a ser reposta do estoque do produto pedido.
      </p>
      <Input 
        placeholder={'Quantidade'} 
        type={'number'}
        style={{input: `mb-[-5px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
        onChange={onChange}
      />
      {error && <Error error={error}/>}
  
      <div className='flex gap-2 mt-2'>
        <Button 
          type='button'
          style={`px-5 flex-1 text-xl`} 
          label='Repor'
          colorScheme='primary'
          loading={loading}
          loadingLabel='Processando'
          onClick={onReset}
        />
        <Button
          style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`}
          onClick={onCloseActions}
          label={'Cancelar'}
          type='button'
        />
      </div>
    </Modal>
  )
}

export default ResetProductStock