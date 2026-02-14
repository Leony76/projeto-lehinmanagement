import { textColors, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
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
  product: {
    sellerName: string;
  };
  onChange: {
    textarea: (e:React.ChangeEvent<HTMLTextAreaElement>) => void;
  };
  onClick: {
    confirm: () => void;
    cancel: () => void;
  };
  misc: {
    error: string;
    loading: boolean;
  };
}

const RemoveProductJustify = ({
  modal,
  onChange,
  onClick,
  product,
  misc,
}:Props) => {
  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={'Justificativa de remoção'}
    onCloseModalActions={modal.onCloseActions}
    >
      <p className={textColors.secondaryDark}>Cite a justificativa para a remoção desse produto ofertado por {product.sellerName}</p>
      <TextArea 
        style={{input: `h-20 mb-[-3px] ${misc.error ? 'shadow-[0px_0px_8px_red]' : ''}`}}
        placeholder='Justificativa...'
        onChange={onChange.textarea}
      />
      {misc.error && <Error error={misc.error}/>}
      <div className='flex gap-2 mt-2'>
        <Button 
          loading={misc.loading}
          loadingLabel='Processando'
          type={'button'}
          label='Confirmar'
          style={`flex-1 ${buttonColorsScheme.green}`}
          onClick={onClick.confirm}
        />
        <Button 
          type={'button'}
          label='Cancelar'
          style={`flex-1 ${buttonColorsScheme.red}`}
          onClick={onClick.cancel}
        />
      </div>
    </Modal>
  )
}

export default RemoveProductJustify