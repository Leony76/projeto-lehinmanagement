import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import React from 'react'
import Button from '../../form/Button';
import TextArea from '../../form/TextArea';
import Modal from '../Modal';
import Error from '../../ui/Error';

type Props = {
  modal: {
    isOpen: boolean;
    onCloseActions: () => void;
  };
  edit: {
    onClick: {
      toEdit: () => void;
      toBack: () => void;
    }
    onChange: {
      textArea: (e:React.ChangeEvent<HTMLTextAreaElement>) => void;
    }
  };
  misc: { 
    error: string;
    loading: boolean;
  };
}

const EditProductJustify = ({
  modal,
  edit,
  misc,
}:Props) => {
  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={'Justificativa de edição'} 
    onCloseModalActions={modal.onCloseActions}>
      <p className='text-secondary-dark'>
        Escreva uma breve justificativa do porquê dessa edição para o vendedor.
      </p>
      <TextArea 
        style={{
          container: 'mb-[-8px]',
          input: `${misc.error 
            ? 'shadow-[0px_0px_7px_red]' 
            : ''} h-30`,
        }}
        placeholder={'Justificativa'}
        onChange={edit.onChange.textArea}
        maxLength={500}
      />
      {misc.error && <Error error={misc.error}/>}
      <div className='flex gap-3 mt-2'>
        <Button 
          style={`flex-1 ${buttonColorsScheme.yellow}`}
          type={'button'}
          label='Editar'
          loadingLabel='Processando'
          loading={misc.loading}
          onClick={edit.onClick.toEdit}
        />
        <Button 
          style={`flex-1 ${buttonColorsScheme.red}`}
          type={'button'}
          label='Voltar'
          onClick={edit.onClick.toBack}
        />
      </div>
    </Modal>
  )
}

export default EditProductJustify
