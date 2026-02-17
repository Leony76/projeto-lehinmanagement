import { UserSupportMessage } from '@/src/types/usersDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import React, { useState } from 'react'
import Button from '../../form/Button';
import { UsersPageModals } from '@/src/types/modal';
import TextArea from '../../form/TextArea';
import Error from '../../ui/Error';
import { primaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import NoContentFoundMessage from '../../ui/NoContentFoundMessage';

type Props = {
  type: 'MESSAGE_FROM_USER';
  message: UserSupportMessage | null;
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<UserSupportMessage | null>>;
  reply: {
    message: string | null;
    at: string | null;
  }
} | {
  type: 'MESSAGE_REPLY';
  message: UserSupportMessage | null;
  replyMessage: string;
  error: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
} | {
  type: 'USER_MESSAGE';
  conversations: UserAndSupportConversationDTO[];
  setSelectedConversation: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>
  setActiveModal: React.Dispatch<React.SetStateAction<"CONTACT_SUPPORT" | "CONFIRM_SEND_MESSAGE" | "LAST_SUPPORT_MESSAGES" | 'REPLY_SUPPORT_MESSAGE' | null>>
} | {
  type: 'USER_REPLY';
  conversations: UserAndSupportConversationDTO[];
  selectedConversation: UserAndSupportConversationDTO | null;
  setActiveModal: React.Dispatch<React.SetStateAction<"CONTACT_SUPPORT" | "CONFIRM_SEND_MESSAGE" | "LAST_SUPPORT_MESSAGES" | 'REPLY_SUPPORT_MESSAGE' | null>>
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  replySupportMessage: string;
  setReplySupportMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserMessage = (props:Props) => {

  const { type } = props;

  const MAX_MESSAGE_LENGTH = 120;

  const [readMoreUserMessage, setReadMoreUserMessage] = useState<boolean>(false);
  const [readMoreReplierMessage, setReadMoreReplierMessage] = useState<boolean>(false);

  const messageTypeLabel = 
  type === 'USER_MESSAGE' || type === 'MESSAGE_REPLY' 
  && props.message?.type === 'APPEAL'
    ? 'Apelo'
  : type === 'MESSAGE_REPLY' 
  && props.message?.type === 'QUESTION'
    ? 'Pergunta'
  : 'Sugestão'

  switch (type) {

    case 'MESSAGE_FROM_USER':

      return (
        <div className={`flex flex-col bg-gray-100/10 p-2 rounded-xl border-2
          ${props.reply.at
            ? 'border-green'
            : 'border-red'
          }
        `}>
          <span className="text-gray text-xs">
            Código da mesagem: {props.message?.id} 
          </span>
          <span className={props.reply.at
            ? 'text-green-200'
            : 'text-red'
          }>
            {props.reply.at
              ? 'Respondido'
              : 'Não respondido'
            }
          </span>
          <h4 className="text-cyan mt-1">
            {props.message?.subject}
          </h4>
          <span className="text-yellow text-sm">
            {formattedDate(props.message?.sentDate ?? '')}
          </span>
          <span className="text-gray">
            Tipo de mensagem: <span className="text-secondary-middledark">{messageTypeLabel}</span>
          </span>
          <p className="text-secondary-light border-y border-primary mt-1 py-1">
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
            {!props.message?.reply.at &&
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

          {props.reply.message && 
            <div className='pt-1'>
              <h3 className='text-xl text-primary'>
                Sua Resposta
              </h3>
              <span className='text-yellow text-sm'>
                {formattedDate(props.message?.reply.at ?? '??/??/??')}
              </span>
              <p className="text-secondary-light border-y my-1 py-1">
                {(props.message?.reply.message?.length ?? 0) > MAX_MESSAGE_LENGTH && !readMoreReplierMessage
                  ? props.message?.reply.message?.slice(0, MAX_MESSAGE_LENGTH) + '...'
                  : props.message?.reply.message
                }
              </p>
              {(props.message?.reply.message?.length ?? 0) > MAX_MESSAGE_LENGTH && 
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

    case 'MESSAGE_REPLY':

      return (
        <div className="flex flex-col bg-gray-100/10 p-2 rounded-xl">
          <span className="text-gray text-xs">
            Código da mesagem: {props.message?.id} 
          </span>
          <h4 className="text-cyan mt-1">
            {props.message?.subject}
          </h4>
          <span className="text-yellow text-sm">
            {formattedDate(props.message?.sentDate ?? '')}
          </span>
          <span className="text-gray">
            Tipo de mensagem: <span className="text-secondary-middledark">{messageTypeLabel}</span>
          </span>
          <p className={`text-secondary-light max-h-30 overflow-y-auto border-t border-primary mt-1 pr-1 pt-1 ${primaryColorScrollBar}`}>
            {props.message?.message}
          </p>
          <div className='border-t flex flex-col gap-2 border-primary mt-1 pt-1'>
            <h3 className='text-secondary text-xl'>
              Sua resposta 
            </h3>
            <TextArea 
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

    case 'USER_MESSAGE':

      return (
        <>
        <div className='space-x-4 mb-1'>
          <span className='text-gray'>
            Contagem: <span className='text-yellow'>{props.conversations.length}</span>
          </span>

          <span className='text-gray'>
            Respondidas: <span className='text-green-200'>{props.conversations.reduce((acc, cur) => 
              cur.replier.repliedAt 
                ? acc + 1
                : acc
            , 0)}
            </span>
          </span>

          <span className='text-gray'>
            Não respondidas: <span className='text-red'>{props.conversations.reduce((acc, cur) => 
              !cur.replier.repliedAt 
                ? acc + 1
                : 0
            , 0)}
            </span>
          </span>
        </div>

        <div className={`flex flex-col gap-3 max-h-[50vh] overflow-y-auto ${primaryColorScrollBar} pr-2`}>
          {props.conversations.length > 0 ? (
            props.conversations.map((conversation) => (

              <div className={`flex flex-col bg-gray-100/10 p-2 rounded-xl border-2
                ${conversation.replier.repliedAt
                  ? 'border-green'
                  : 'border-red'
                }
              `}>

                <span className="text-gray text-xs">
                  Código da mesagem: {conversation.conversationId} 
                </span>

                <span className="text-yellow text-sm">
                  {formattedDate(conversation.sender.sentAt)}
                </span>

                <p className="dark:text-secondary-light text-primary-middledark border-y border-primary mt-1 py-1">
                  {conversation.sender.message.length > MAX_MESSAGE_LENGTH && !readMoreUserMessage 
                    ? conversation.sender.message.slice(0, MAX_MESSAGE_LENGTH) + '...'
                    : conversation.sender.message
                  }
                </p>

                {conversation.sender.message.length > MAX_MESSAGE_LENGTH &&
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

                {conversation.replier.repliedAt ? (

                  <div className='flex flex-col pt-1'>

                    <span className='text-green-300'>
                      Respondido
                    </span>

                    <span className='text-gray text-sm'>
                      Por: <span className='text-cyan'>{conversation.replier.name} (administrador)</span>
                    </span>

                    <span className='text-yellow text-sm mb-2'>
                      {formattedDate(conversation.replier.repliedAt)}
                    </span>

                    <p className='dark:text-secondary-light text-secondary-middledark mb-3 border-secondary-middledark border-y py-1'>
                      {(conversation.replier.reply?.length ?? 0) > MAX_MESSAGE_LENGTH && !readMoreReplierMessage 
                        ? conversation.replier.reply?.slice(0, MAX_MESSAGE_LENGTH) + '...'
                        : conversation.replier.reply
                      }
                    </p>

                    {(conversation.replier.reply?.length ?? 0) > MAX_MESSAGE_LENGTH &&
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

                    <Button 
                      type={"button"}
                      label="Responder"
                      style="px-5"
                      onClick={() => {
                        props.setSelectedConversation(conversation);
                        props.setActiveModal('REPLY_SUPPORT_MESSAGE');
                      }}
                    />
                  </div>
                ) : (
                  <span className='text-red'>
                    Não respondido
                  </span>
                )}      
              </div>          
            ))
          ) : (
            <NoContentFoundMessage text={'Nada'}/>
          )}
        </div>
        </>
      )

    case 'USER_REPLY':

      return (
        <div className="flex flex-col bg-gray-100/10 p-2 rounded-xl">
          <span className="text-gray text-xs">
            Código da mesagem: {props.selectedConversation?.conversationId} 
          </span>
          <span className="text-yellow text-sm">
            {formattedDate(props.selectedConversation?.replier.repliedAt ?? '')}
          </span>
          <p className={`text-secondary-light max-h-30 overflow-y-auto border-t border-primary mt-1 pr-1 pt-1 ${primaryColorScrollBar}`}>
            {props.selectedConversation?.replier.reply}
          </p>
          <div className='border-t flex flex-col gap-2 border-primary mt-1 pt-1'>
            <h3 className='text-secondary text-xl'>
              Sua resposta 
            </h3>
            <TextArea 
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
                props.setActiveModal('LAST_SUPPORT_MESSAGES');
              }}
            />
          </div>
        </div>
      )
  }
}

export default UserMessage