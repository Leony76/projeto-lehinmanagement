'use client';

import Image from 'next/image'
import LRC from '@/public/LericoriaPadraoFogo2.png';
import { Logout } from '../auth/Logout';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Button from '../form/Button';
import { useState } from 'react';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import WarningInfo from './WarningInfo';
import Error from './Error';
import { useToast } from '@/src/contexts/ToastContext';
import { sendMessageToSupport, sendReplyMessage } from '@/src/actions/userActions';
import { useUserStore } from '@/src/hooks/store/useUserStore';
import { SupportMessageSentBy, SupportMessageType, UserSituation } from '@prisma/client';
import { UserDeactivatedDTO } from '@/src/types/UserDeactivatedReasonDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import UserMessage from '../modal/Users/UserMessage';
import { UserDeactivatedMenuModals } from '@/src/types/modal';

type Props = {
  deactivation: UserDeactivatedDTO;
  conversations: UserAndSupportConversationDTO[];
}

const UserDeactivedMenu = ({
  deactivation,
  conversations,
}:Props) => {

  const { showToast } = useToast();

  const user = useUserStore((s) => s.user);

  const [selectedConversation, setSelectedConversation] = useState<UserAndSupportConversationDTO | null>(null);

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [activeModal, setActiveModal] = useState<UserDeactivatedMenuModals | null>(null);

  const handleSendMessageToSupport = async() => {
    if (loading) return;
    setLoading(true);

    const userData = {
      id: user?.id ?? '',
      situation: user?.isActive
        ? "ACTIVATED" 
        : "DEACTIVATED" as UserSituation
    };

    const data = {
      message: supportMessage,
      type: 'APPEAL' as SupportMessageType,
      sentBy: 'USER' as SupportMessageSentBy,
    }

    try {
      await sendMessageToSupport(
        userData,
        data,        
      );

      showToast('Seu apelo foi enviado ao suporte', 'info');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal(null);
      setSupportMessage('');
    }
  }

  const handleSendReplyMessageToSupport = async() => {
    if (loading) return;
    setLoading(true);

    try {
      if (!selectedConversation) return;

      await sendReplyMessage(
        selectedConversation.id,
        user?.id!,
        supportMessage,
      );

      showToast(`Sua mensagem foi mandada para ${user?.name} com sucesso`, 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal('LAST_SUPPORT_MESSAGES');
      setSelectedConversation(null);
      setSupportMessage('');
    }
  }

  return (
    <div className="bg-zinc-800 max-w-200 rounded-3xl max-h-fit mx-2 p-4">
      <div className="flex flex-col justify-center items-center w-[90%] mx-auto">
        <Image 
          src={LRC} 
          alt={"LRC"}
          height={76}
          width={67}
        />
        <h1 className="text-red text-xl">
          Conta desativada
        </h1>
        <span className="text-yellow">
          {formattedDate(deactivation.deactivationDate)}
        </span>
        <p className="text-primary text-center text-sm">
          Nossos administradores apuraram circunstância que inferiram na desativação de sua conta por tempo indeterminado
        </p>
        <div className="mb-4 w-full">
          <label className="text-secondary">
            Razão
          </label>
          <p className="text-gray text-sm max-h-30 overflow-y-auto wrap-break-word">
            {deactivation.reason}
          </p>
        </div>

        <WarningInfo text='OBSERVAÇÃO: Seus ativos produtos já comprados no site não foram descartados do seu histórico, assim como seus pedidos já feitos. Pedidos que esjavam pedentes foram cancelados e pedidos com pagamento já reazliado foram cancelados e o pagamento extornado para seu bolso. '/>

        <div className="w-full flex flex-col sm:flex-row sm:gap-4 gap-2 mt-4">
          <Logout className={buttonColorsScheme.red + ' text-center flex-[.5]'}>
            Sair
          </Logout>
          
          <Button
            type='button'
            label='Entrar em contato com suporte'
            style={`flex-1 ${buttonColorsScheme.yellow}`} 
            onClick={() => setActiveModal('CONTACT_SUPPORT')}
          />

          {conversations.length > 0 && 
            <Button
              type='button'
              label='Últimas mensagens'
              style={`flex-1`} 
              onClick={() => setActiveModal('LAST_SUPPORT_MESSAGES')}
            />
          }
        </div>
      </div>




      <Modal 
      isOpen={activeModal === 'CONTACT_SUPPORT'} 
      modalTitle={'Contatar suporte'} 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal(null);
        setSupportMessage('');
        setError('');
      }}
      >
        <p className='text-secondary-middledark'>
          Mande uma mensagem com algum argumento que possa ajudar na reativação de sua conta no sistema por nossa equipe. Faremos o possível para reverter a desativação perante provas válidas.
        </p>
        <TextArea 
          style={{input: `h-30 ${error
            ? 'shadow-[0px_0px_8px_red]'
            : ''
          }`, container: 'mb-[-7px]'}}
          maxLength={1000}
          placeholder={'Manda sua mensagem aqui'}
          value={supportMessage}
          onChange={(e) => {
            setSupportMessage(e.target.value);
            if (supportMessage.length > 100) {
              setError('');
            }
          }}
        />
        {error && <Error error={error}/>}
        <div className='flex gap-3 mt-1'>
          <Button 
            type={'submit'}
            label='Prosseguir'
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            onClick={() => {
              if (supportMessage.length === 0) {
                setError('Sua mensagem ao suporte não pode ser vazia');
                return;
              } else if (supportMessage.length < 100) {
                setError('Sua mensagem ao suporte precisa ter até 100 caractéres para poder ser válida');
                return;
              }       
              setActiveModal('CONFIRM_SEND_MESSAGE');
            }}
          />
          <Button 
            type={'submit'}
            label='Cancelar'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => {
              setActiveModal(null);
              setSupportMessage('');
              setError('');
            }}
          />
        </div>
      </Modal>

      <Modal
      isOpen={activeModal === 'CONFIRM_SEND_MESSAGE'} 
      modalTitle={'Confirmar ação'} 
      hasXClose
      onCloseModalActions={() => setActiveModal('CONTACT_SUPPORT')}
      >
        <p className='text-secondary-middledark mb-2'>
          Tem certeza que deseja enviar essa mensagem como argumento para nossa equipe avaliar a possibilidade de reativação de sua conta ?
        </p>
        <WarningInfo 
          text='Nossa equipe responderá sua apelação em até 24 horas úteis de segunda a sexta-feira. Caso precissemos de mais informações sobre sua apelação, se demonstrá-se válida, comunicaremos de volta nessa tela para processeguir com o processo de reativação de sua conta no sistema.'
        />
        <div className='flex gap-3'>
          <Button 
            type={'submit'}
            label='Mandar'
            loading={loading}
            loadingLabel='Processando'
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            onClick={handleSendMessageToSupport}
          />
          <Button 
            type={'submit'}
            label='Cancelar'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => setActiveModal('CONTACT_SUPPORT')}
          />
        </div>
      </Modal>





      <Modal 
      isOpen={activeModal === 'LAST_SUPPORT_MESSAGES'} 
      modalTitle={'Suas mensagens'} 
      hasXClose
      onCloseModalActions={() => {setActiveModal(null)}}
      >
        <UserMessage
          type={'USER_MESSAGE'}
          conversations={conversations}
          setActiveModal={setActiveModal}
          setSelectedConversation={setSelectedConversation}    
        />
      </Modal>






      <Modal 
      isOpen={activeModal === 'REPLY_SUPPORT_MESSAGE'} 
      modalTitle={'Responder'} 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal('LAST_SUPPORT_MESSAGES'); 
        setSupportMessage('');
        setError('');
      }}
      >
        <UserMessage
          type={'USER_REPLY'}
          conversations={conversations}
          setActiveModal={setActiveModal}
          error={error} 
          replySupportMessage={supportMessage}
          selectedConversation={selectedConversation}
          setError={setError}
          setReplySupportMessage={setSupportMessage}
        />
      </Modal>

      <Modal 
      isOpen={activeModal === 'SEND_REPLY_CONFIRM'} 
      modalTitle={'Responder'} 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal('REPLY_SUPPORT_MESSAGE'); 
        setError('');
      }}
      >
        <p className='text-secondary-middledark mb-2'>
          Tem certeza que deseja enviar essa nova mensagem como argumento para nossa equipe avaliar a possibilidade de reativação de sua conta novamente ?
        </p>
        <WarningInfo 
          text='Nossa equipe responderá sua apelação em até 24 horas úteis de segunda a sexta-feira. Caso precissemos de mais informações sobre sua apelação, se demonstrá-se válida, comunicaremos de volta nessa tela para processeguir com o processo de reativação de sua conta no sistema.'
        />
        <div className='flex gap-3'>
          <Button 
            type={'submit'}
            label='Mandar'
            loading={loading}
            loadingLabel='Processando'
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            onClick={handleSendReplyMessageToSupport}
          />
          <Button 
            type={'submit'}
            label='Cancelar'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => {
              setActiveModal('REPLY_SUPPORT_MESSAGE');              
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default UserDeactivedMenu