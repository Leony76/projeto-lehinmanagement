import React, { ChangeEvent } from 'react'
import Modal from '../Modal';
import { textColors } from '@/src/constants/systemColorsPallet';
import Button from '../../form/Button';
import TextArea from '../../form/TextArea';
import Error from '../../ui/Error';
import WarningInfo from '../../ui/WarningInfo';

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  onChange: { textArea: (e:React.ChangeEvent<HTMLTextAreaElement>) => void };
  hasReview: boolean;
  onClick: { comment: () => void }
  misc: { error: string };
}

const ProductComment = ({
  isOpen,
  onCloseActions,
  onChange,
  onClick,
  hasReview,
  misc,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen}
    modalTitle={"Comentar produto"} 
    onCloseModalActions={onCloseActions}
    hasXClose
    >
      <p className={`text-[15px] ${textColors.secondaryDark}`}>
        Deixe um comentário público acerca do que você achou do produto que pediu!
      </p>
      <TextArea 
        style={{input: `h-30 ${misc.error ? 'shadow-[0px_0px_5px_red] mb-[-1px]' : ''}`}} 
        colorScheme='primary' 
        placeholder={'Deixe seu comentário...'}
        onChange={onChange.textArea}
      />
      {hasReview && !misc.error && 
        <WarningInfo 
          text={'Você já comentou sobre esse produto. Um novo comentário sobrescreverá o seu último.'}
        />
      }
      {misc.error && 
        <Error error={misc.error}/>
      }
      <Button 
        type='button'
        style='mt-1 text-xl' 
        colorScheme='secondary' 
        label='Comentar'
        onClick={onClick.comment}
      />
    </Modal>
  )
}

export default ProductComment