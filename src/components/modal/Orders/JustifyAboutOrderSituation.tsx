import React from 'react'
import Modal from '../Modal';
import TextArea from '../../form/TextArea';
import Error from '../../ui/Error';
import Button from '../../form/Button';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';

type Props = {
  isOpen: boolean;
  error: string;
  loading: boolean;
  onCloseActions: () => void;
  onSend: () => void;
  onChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => void;
  messageAboutSituation: string;
}

const JustifyAboutOrderSituation = ({
  isOpen,
  error,
  loading,
  messageAboutSituation,
  onCloseActions,
  onChange,
  onSend,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={'Justificar ao cliente'} 
    onCloseModalActions={onCloseActions}
    >
      <p className='text-secondary-dark'>
        Deixe para o cliente uma justificativa a cerca da situação atual de seu pedido.
      </p>
      <TextArea 
        placeholder={'Justificativa'}
        style={{input: `mb-[-3px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
        label='Justificativa'
        colorScheme='primary'
        value={messageAboutSituation}
        onChange={onChange}
      />
      {error && <Error error={error}/>}
  
      <div className='flex gap-2 mt-2'>
        <Button 
          type='button'
          style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
          label='Mandar'
          loading={loading}
          spinnerColor='text-yellow-dark'
          loadingLabel='Processando'
          onClick={onSend}
        />
        <Button
          style={`px-5 flex-1 text-xl`}
          onClick={onCloseActions}
          label={'Cancelar'}
          type='button'
        />
      </div>
    </Modal>
  )
}

export default JustifyAboutOrderSituation