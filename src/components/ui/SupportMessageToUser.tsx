import { primaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { UsersPageModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import Button from '../form/Button';
import TextArea from '../form/TextArea';
import Error from './Error';
import { MESSAGE_TYPE_LABELS } from '@/src/constants/generalConfigs';

type Props = {
  message: UserAndSupportConversationDTO | null;
  replyMessage: string;
  error: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const SupportMessageToUser = (props:Props) => {
  
  return (
    <div className="flex flex-col bg-gray-100/10 p-2 rounded-xl">
      <span className="text-gray text-xs">
        Código da mesagem: {props.message?.id} 
      </span>
      <h4 className="text-cyan mt-1">
        {props.message?.subject}
      </h4>
      <span className="text-yellow text-sm">
        {formattedDate(props.message?.sentAt ?? '')}
      </span>
      <span className="text-gray">
        Tipo de mensagem: <span className="text-secondary-middledark">{MESSAGE_TYPE_LABELS[props.message?.type ?? 'APPEAL']}</span>
      </span>
      <p className={`text-secondary-light max-h-30 overflow-y-auto border-t border-primary mt-1 pr-1 pt-1 ${primaryColorScrollBar}`}>
        {props.message?.message}
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
          value={props.replyMessage}
          onChange={(e) => {
            props.setReplyMessage(e.target.value);
            if (props.replyMessage.length > 100) {
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
            if (props.replyMessage.length === 0) {
              props.setError('Sua mensagem não pode ser vazia');
              return;
            } else if (props.replyMessage.length < 100) {
              props.setError('Sua mensagem deve conter até 100 caracteres');
              return;
            }
            props.setError('');
            props.setActiveModal('REPLY_MESSAGE_CONFIRM');
          }}
        />
      </div>
    </div>
  )
}

export default SupportMessageToUser