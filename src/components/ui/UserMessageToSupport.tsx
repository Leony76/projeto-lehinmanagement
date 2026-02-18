import { formattedDate } from '@/src/utils/formattedDate';
import { useState } from 'react'
import Button from '../form/Button';
import { UsersPageModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';

type Props = {
  message: UserAndSupportConversationDTO | null;
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>;
}

const UserMessageToSupport = (props:Props) => {

  const MAX_MESSAGE_LENGTH = 120;
  const [readMoreUserMessage, setReadMoreUserMessage] = useState<boolean>(false);
  const [readMoreReplierMessage, setReadMoreReplierMessage] = useState<boolean>(false);

  const messageTypeLabel = 
    props.message?.type === 'APPEAL'
      ? 'Apelo'
    : props.message?.type === 'QUESTION'
      ? 'Pergunta'
    : 'Sugestão'

  return (
    <div className={`flex flex-col bg-gray-100/10 p-2 rounded-xl border-2
      ${props.message?.repliedAt
        ? 'border-green'
        : 'border-red'
      }
    `}>
      <span className="text-gray text-xs">
        Código da mesagem: {props.message?.id} 
      </span>
      <span className={props.message?.repliedAt
        ? 'text-green-200'
        : 'text-red'
      }>
        {props.message?.repliedAt
          ? 'Respondido'
          : 'Não respondido'
        }
      </span>
      {props.message?.sentBy === 'SUPPORT' &&
        <h4 className="text-cyan mt-1">
          Mandado por você
        </h4>
      }
      <h4 className="text-cyan mt-1">
        {props.message?.subject}
      </h4>
      <span className="text-yellow text-sm">
        {formattedDate(props.message?.sentAt ?? '')}
      </span>
      {props.message?.sentBy !== 'SUPPORT' &&
        <span className="text-gray">
          Tipo de mensagem: <span className="text-secondary-middledark">{messageTypeLabel}</span>
        </span>
      }
      <p className="text-secondary-light wrap-break-word border-y border-primary mt-1 py-1">
        {(props.message?.message.length ?? 0) > MAX_MESSAGE_LENGTH && !readMoreUserMessage
          ? props.message?.message.slice(0, MAX_MESSAGE_LENGTH) + '...'
          : props.message?.message
        }
      </p>
      <div className="flex justify-between mt-2">
        {(props.message?.message.length ?? 0) > MAX_MESSAGE_LENGTH &&
          <button
          onClick={() => setReadMoreUserMessage(prev => !prev)}
          className="text-gray text-left w-fit cursor-pointer">
            {readMoreUserMessage
              ? 'Ler menos'
              : 'Ler mais'
            }             
          </button>
        }
        {!props.message?.repliedAt && props.message?.sentBy === 'USER' &&
          <Button 
            type={"button"}
            label="Responder"
            style="px-5"
            onClick={() => {
              props.setActiveModal('REPLY_MESSAGE');
              props.setSelectedMessage(props.message);
            }}
          />
        }
      </div>

      {props.message?.repliedAt && 
        <div className='pt-1'>
          <h3 className='text-xl text-primary'>
            {props.message.sentBy === 'SUPPORT'
              ? 'Resposta do usuário'
              : 'Sua resposta'
            }
          </h3>
          <span className='text-yellow text-sm'>
            {formattedDate(props.message?.repliedAt ?? '??/??/??')}
          </span>
          <p className="text-secondary-light wrap-break-word border-y my-1 py-1">
            {(props.message?.replyMessage?.length ?? 0) > MAX_MESSAGE_LENGTH && !readMoreReplierMessage
              ? props.message?.replyMessage?.slice(0, MAX_MESSAGE_LENGTH) + '...'
              : props.message?.replyMessage
            }
          </p>
          {(props.message?.replyMessage?.length ?? 0) > MAX_MESSAGE_LENGTH && 
            <button
            onClick={() => setReadMoreReplierMessage(prev => !prev)}
            className="text-gray text-left w-fit cursor-pointer mt-1">
              {readMoreReplierMessage
                ? 'Ler menos'
                : 'Ler mais'
              }             
            </button>
          }
        </div>
      }
    </div>
  )
}

export default UserMessageToSupport