import { primaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { UserDeactivatedMenuModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import React from 'react'
import Button from '../form/Button';
import TextArea from '../form/TextArea';
import Error from './Error';
import { MESSAGE_TYPE_LABELS } from '@/src/constants/generalConfigs';

type Props = {
  conversations: UserAndSupportConversationDTO[];
  selectedConversation: UserAndSupportConversationDTO | null;
  setActiveModal: React.Dispatch<React.SetStateAction<UserDeactivatedMenuModals | null>>
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  replySupportMessage: string;
  setReplySupportMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserReplyMessageToSupport = (props:Props) => {
  return (
    <div className="flex flex-col  rounded-xl">
      <span className="text-gray text-xs">
        Código da mesagem: {props.selectedConversation?.id} 
      </span>

      <span className="text-yellow text-sm">
        {formattedDate(props.selectedConversation?.sentAt ?? '')}
      </span>

      <span className='text-gray text-sm'>
        Por: <span className='text-cyan'>{props.selectedConversation?.sender.name} (administrador)</span>
      </span>

      <span className="text-gray">
        Tipo de mensagem: <span className="text-secondary-middledark">{MESSAGE_TYPE_LABELS[props.selectedConversation?.type ?? 'SUPPORT_QUESTION']}</span>
      </span>

      <p className={`text-secondary-light max-h-30 overflow-y-auto border-t border-primary mt-1 pr-1 pt-1 ${primaryColorScrollBar}`}>
        {props.selectedConversation?.message}
      </p>
      
      <div className='border-t flex flex-col gap-2 border-primary mt-1 pt-1'>
        <h3 className='text-secondary text-xl'>
          Sua resposta 
        </h3>
        <TextArea 
          maxLength={500}
          style={{input: `h-20 ${props.error
            ? 'shadow-[0px_0px_8px_red]'
            : ''
          }`, container: 'mb-[-8px]'}}
          placeholder={'Digite sua resposta'}
          colorScheme='primary'
          value={props.replySupportMessage}
          onChange={(e) => {
            props.setReplySupportMessage(e.target.value);
            if (props.replySupportMessage.length > 100) {
              props.setError('');
            }
          }}
        />
        {props.error && <Error error={props.error}/>}
        <Button
          type='button'
          label='Prosseguir'
          style='mt-1'
          onClick={() => {
            if (props.replySupportMessage.length === 0) {
              props.setError('Sua mensagem não pode ser vazia');
              return;
            } else if (props.replySupportMessage.length < 100) {
              props.setError('Sua mensagem deve conter até 100 caracteres');
              return;
            }
            props.setError('');
            props.setActiveModal('SEND_REPLY_CONFIRM');
          }}
        />
      </div>
    </div>
  )
}

export default UserReplyMessageToSupport