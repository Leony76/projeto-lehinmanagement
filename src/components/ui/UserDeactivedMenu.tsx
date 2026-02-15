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
import { sendMessageToSupport } from '@/src/actions/userActions';
import { useUserStore } from '@/src/hooks/store/useUserStore';
import { getRequiredSession } from '@/src/lib/get-session-user';
import { SupportMessageType, UserSituation } from '@prisma/client';

type Props = {
  deactivation: {
    date: string;
    reason: string;
  }
}

const UserDeactivedMenu = ({
  deactivation
}:Props) => {

  const { showToast } = useToast();

  const user = useUserStore((s) => s.user);

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [activeModal, setActiveModal] = useState<
  | 'CONTACT_SUPPORT' 
  | 'CONFIRM_SEND_MESSAGE' 
  | null
  >(null);

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
          {deactivation.date}
        </span>
        <p className="text-primary text-center text-sm">
          Nossos administradores apuraram circunstância que inferiram na desativação de sua conta por tempo indeterminado
        </p>
        <div className="">
          <label className="text-secondary">
            Razão
          </label>
          <p className="text-gray text-sm sm:max-h-30 overflow-y-auto">
            {deactivation.reason}
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row sm:gap-4 gap-2 mt-4">
          <Logout className={buttonColorsScheme.red + ' text-center flex-1'}>
            Sair
          </Logout>
          <Button
            type='button'
            label='Entra em contato com suporte'
            style={`flex-1 ${buttonColorsScheme.yellow}`} 
            onClick={() => setActiveModal('CONTACT_SUPPORT')}
          />
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
    </div>
  )
}

export default UserDeactivedMenu