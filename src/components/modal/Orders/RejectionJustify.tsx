import React from 'react'
import Modal from '../Modal';
import TextArea from '../../form/TextArea';
import Error from '../../ui/Error';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Button from '../../form/Button';

type Props = {
  userRole: 'CUSTOMER' | 'SELLER';
  isOpen: boolean;
  onCloseActions: () => void;
  editRejection?: boolean;
  newRejectionJustify?: string;
  sellerRejectionJustify: string;
  onChange?: (e:React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  editOrderRejectionJustify?: boolean;
  loading?: boolean;
  error?: string;
  onEdit?: {
    onClick: () => void;
  }
}

const RejectionJustify = ({
  error,
  userRole,
  isOpen,
  editRejection,
  newRejectionJustify,
  sellerRejectionJustify,
  editOrderRejectionJustify,
  loading,
  onEdit,
  onChange,
  onBlur,
  onCloseActions,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={userRole === 'SELLER' 
      ? 'Sua justificativa de rejeição'
      : 'Justificativa de rejeição'
    } 
    onCloseModalActions={onCloseActions}
    >
    {editRejection ? (
      <>
      <TextArea 
        maxLength={500}
        placeholder={'Justificativa'}
        style={{input: 'mb-[-3px]'}}
        label='Justificativa'
        colorScheme='primary'
        value={newRejectionJustify ?? ''}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <Error error={error}/>}
      </>
    ) : (
      <div>
        <label className='text-secondary-dark'>Justificativa:</label>
        <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>
          {sellerRejectionJustify}
        </p>
      </div>
    )}
      {userRole === 'SELLER' ? (

        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
            label='Editar'
            loading={loading}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={onEdit?.onClick}
          />
          <Button
            style={`px-5 ${editOrderRejectionJustify ? buttonColorsScheme.red + 'flex-1' : 'flex-3'} text-xl`}
            onClick={onCloseActions}
            label={editOrderRejectionJustify ? 'Cancelar' : 'Voltar'}
            type='button'
          />
        </div>
      ) : (
        <Button
          style={`px-5 flex-1 text-xl`}
          onClick={onCloseActions}
          label={'Voltar'}
          type='button'
        />
      )}
    </Modal>
  )
}

export default RejectionJustify