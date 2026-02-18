import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import Button from '../form/Button';
import { useState } from 'react';
import { UserDeactivatedMenuModals } from '@/src/types/modal';
import { MESSAGE_TYPE_LABELS } from '@/src/constants/generalConfigs';

type Props = {
  conversation: UserAndSupportConversationDTO;
  setSelectedConversation: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>
  setActiveModal: React.Dispatch<React.SetStateAction<UserDeactivatedMenuModals | null>>
}

const SupportReplyMessageToUserCard = ({
  conversation,
  setSelectedConversation,
  setActiveModal,
}:Props) => {

  const MAX_MESSAGE_LENGTH = 120;
  const [readMoreUserMessage, setReadMoreUserMessage] = useState<boolean>(false);
  const [readMoreReplierMessage, setReadMoreReplierMessage] = useState<boolean>(false);

  return (
    <div className={`flex flex-col bg-gray-100/10 p-2 rounded-xl border-2
      ${conversation.repliedAt
        ? 'border-green'
        : 'border-red'
      }
    `}>

      <span className="text-gray text-xs">
        Código da mesagem: {conversation.id} 
      </span>

      {conversation.sentBy === 'SUPPORT' &&
        <span className='text-gray text-sm'>
          Por: <span className='text-cyan'>{conversation.sender.name} (administrador)</span>
        </span>
      }

      <span className="text-yellow text-sm">
        {formattedDate(conversation.sentAt)}
      </span>

      <span className="text-gray">
        Tipo de mensagem: <span className="text-secondary-middledark">{MESSAGE_TYPE_LABELS[conversation.type]}</span>
      </span>

      <p className="dark:text-secondary-light wrap-break-word text-primary-middledark border-y border-primary mt-1 py-1">
        {conversation.message.length > MAX_MESSAGE_LENGTH && !readMoreUserMessage 
          ? conversation.message.slice(0, MAX_MESSAGE_LENGTH) + '...'
          : conversation.message
        }
      </p>

      {conversation.message.length > MAX_MESSAGE_LENGTH &&
        <button 
        className='text-gray text-left mt-1 cursor-pointer hover:brightness-[1.5] w-fit'
        onClick={() => setReadMoreUserMessage(prev => !prev)}
        >                 
          {readMoreUserMessage
            ? 'Ler menos'
            : 'Ler mais'
          }
        </button>
      }

      {conversation.repliedAt ? (

        <div className='flex flex-col pt-1'>

          <span className='text-green-300'>
            Respondido
          </span>
        
          <span className='text-gray text-sm'>
            Por: <span className='text-cyan'>{conversation.sentBy === 'USER' 
              ? conversation.replier?.name + ' (administrador)'
              : 'Você'
            }</span>
          </span>

          <span className='text-yellow text-sm mb-2'>
            {formattedDate(conversation.repliedAt)}
          </span>

          <p className='dark:text-secondary-light wrap-break-word text-secondary-middledark mb-2 border-secondary-middledark border-y py-1'>
            {(conversation.replyMessage?.length ?? 0) > MAX_MESSAGE_LENGTH && !readMoreReplierMessage 
              ? conversation.replyMessage?.slice(0, MAX_MESSAGE_LENGTH) + '...'
              : conversation.replyMessage
            }
          </p>

          {(conversation.replyMessage?.length ?? 0) > MAX_MESSAGE_LENGTH &&
            <button 
            className='text-gray text-left mb-1.5 -mt-2 cursor-pointer hover:brightness-[1.5] w-fit'
            onClick={() => setReadMoreReplierMessage(prev => !prev)}
            >                 
              {readMoreReplierMessage
                ? 'Ler menos'
                : 'Ler mais'
              }
            </button>
          }      
        </div>
      ) : (
        <div className='flex justify-between items-center mt-2'>
          <span className='text-red ml-1'>
            Não respondido
          </span>
          {conversation.sentBy === 'SUPPORT' &&
            <Button 
              type={'button'}
              label='Responder'
              style='px-5'
              onClick={() => {
                setSelectedConversation(conversation);
                setActiveModal('REPLY_SUPPORT_MESSAGE');
              }}
            />
          }
        </div>
      )}      
    </div>   
  )
}

export default SupportReplyMessageToUserCard