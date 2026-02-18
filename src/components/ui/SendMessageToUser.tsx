import { UserDeactivatedMenuModals, UsersPageModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import React from 'react'
import Button from '../form/Button';
import TextArea from '../form/TextArea';
import Error from './Error';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';

type Props = {
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: string;
  setSendMessage: React.Dispatch<React.SetStateAction<string>>;
}

const SendMessageToUser = (props:Props) => {
  return (
    <div className='flex flex-col gap-2 pt-1'>
      <p className='text-secondary'>
        Digite sua mensagem para o usuário.
      </p>
      <TextArea 
        maxLength={500}
        style={{input: `h-20 ${props.error
          ? 'shadow-[0px_0px_8px_red]'
          : ''
        }`, container: 'mb-[-8px]'}}
        placeholder={'Digite sua mensagem'}
        colorScheme='primary'
        value={props.sendMessage}
        onChange={(e) => {
          props.setSendMessage(e.target.value);
          if (props.sendMessage.length > 100) {
            props.setError('');
          }
        }}
      />
      {props.error && <Error error={props.error}/>}

      <div className='mt-1 flex gap-3'>
        <Button
          type='button'
          label='Prosseguir'
          style='flex-1'
          onClick={() => {
            if (props.sendMessage.length === 0) {
              props.setError('Sua mensagem não pode ser vazia');
              return;
            } else if (props.sendMessage.length < 100) {
              props.setError('Sua mensagem deve conter até 100 caracteres');
              return;
            }
            props.setError('');
            props.setActiveModal('SUPPORT_MESSAGE_TO_USER_CONFIRM');
          }}
        />
        <Button
          type='button'
          label='Cancelar'
          style={`flex-1 ${buttonColorsScheme.red}`}
          onClick={() => {
            props.setActiveModal('USER_SUPPORT_MESSAGES');
            props.setSendMessage('');
          }}
        />
      </div>
    </div>
  )
}

export default SendMessageToUser