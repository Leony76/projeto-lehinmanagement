'use client';

import Image from "next/image";
import PlaceHolder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg'
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import { IoInformation } from "react-icons/io5";
import Button from "../form/Button";
import Modal from "../modal/Modal";
import { UsersPageModals } from "@/src/types/modal";
import { useState } from "react";
import { Tooltip } from "./Tooltip";
import { useLockScrollY } from "@/src/hooks/useLockScrollY";
import { getNameAndSurname } from "@/src/utils/getNameAndSurname";
import LabelValue from "./LabelValue";
import UserMostRecentActionInfoCard from "./UserMostRecentActionInfoCard";
import ImageExpand from "../modal/ImageExpand";
import { isAdminAction, isCustomerAction, isSellerAction, UsersDTO, UserSupportMessage } from "@/src/types/usersDTO";
import { formattedDate } from "@/src/utils/formattedDate";
import { ROLE_LABEL } from "@/src/constants/generalConfigs";
import UserInfoMenu from "../modal/Users/UserInfoMenu";
import { useToast } from "@/src/contexts/ToastContext";
import { activateUserAccount, deactivateUserAccount } from "@/src/actions/userActions";
import ActiveDeactiveUserAccount from "../modal/Users/ActiveDeactiveUserAccount";
import { secondaryColorScrollBar } from "@/src/styles/scrollBar.style"; 

type Props = {
  user: UsersDTO;
  isDivided: boolean;
}

const UserCard = ({
  user,
  isDivided,
}:Props) => {

  const [activeModal, setActiveModal] = useState<UsersPageModals | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<UserSupportMessage | null>(null);

  const [error, setError] = useState<string>('');
  const [accountDeactivationJustify, setAccountDeactivationJustify] = useState<string>('');
  const [accountActivationJustify, setAccountActivationJustify] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [readMore, setReadMore] = useState<boolean>(false);

  const MAX_MESSAGE_LENGTH = 120;

  useLockScrollY(Boolean(activeModal));

  const { showToast } = useToast();

  const handleActivateDeactivateUserAccount = async (actionType: 'ACTIVATE' | 'DEACTIVATE'): Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      if (actionType === 'ACTIVATE') {
        await activateUserAccount(user.id, accountActivationJustify);
        showToast('Usuário ativado com sucesso', 'success');
      } else {
        await deactivateUserAccount(user.id, accountDeactivationJustify);
        showToast('Usuário desativado com sucesso', 'success');
      }
      
    } catch (err: any) {
      showToast(err.message || 'Ocorreu um erro', 'error');
    } finally {
      setAccountActivationJustify('');
      setAccountDeactivationJustify('');
      setActiveModal(null); 
      setLoading(false);
    }
  };

  return (
    <>
    <div className='flex p-2'>
      <div className='flex items-center gap-2 flex-1'>
        <div className='border-2 border-primary aspect-square rounded-full p-1'>
          <Image
            src={PlaceHolder}
            alt={'placeholder'}
            width={50}
            height={50}
            className='rounded-full h-full object-cover'
          />
        </div>
        <div className='flex flex-col'>
          <span className='text-cyan'>
            {getNameAndSurname(user.name)}
          </span>
          <span className='text-gray'>
            {ROLE_LABEL[user.role]}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className={`rounded-2xl dark:brightness-[1.1] tracking-wide px-3 border-2 
          ${user.isActive
            ? 'border-green-500 text-green-500 bg-green/20'
            : 'border-red-500 text-red-500 bg-red/20'
          }`}>
          {user.isActive  
            ? 'Ativo' 
            : 'Inativo'
          }
        </div>
        <Tooltip 
        text="Informações do usuário"
        position="left"
        style='self-end'
        >
          <Button 
            type={'button'}
            icon={IoInformation}
            style={`${buttonColorsScheme.yellow} py-1 text-2xl px-3 !border-2`}
            onClick={() => setActiveModal('USER_INFOS')}
          />
        </Tooltip>
      </div>

      {/* ⇊ MODALS ⇊ */}

      <UserInfoMenu
        modal={{
          isOpen: activeModal === 'USER_INFOS',
          onCloseActions: () => setActiveModal(null),
          setActiveModal,
        }}
        user={user}
        onClick={{ onAvatarImage: () =>  setActiveModal('EXPAND_IMAGE')}}
      />

      <ActiveDeactiveUserAccount
        modal={{
          activeModal,
          setActiveModal,
          onCloseActions: () => {
            setActiveModal('USER_INFOS');
            setError('');
            setAccountActivationJustify('');
            setAccountDeactivationJustify('');
          }
        }}
        user={user}
        handles={{
          handleActivateUserAccount: () => handleActivateDeactivateUserAccount('ACTIVATE'),
          handleDeactivateUserAccount: () => handleActivateDeactivateUserAccount('DEACTIVATE'),
        }}
        onChange={{
          setAccountActivationJustify,
          setAccountDeactivationJustify,      
        }}
        textArea={{
          accountActivationJustify,
          accountDeactivationJustify,
        }}
        misc={{ error, loading, setError }}
      />

      <ImageExpand 
        modal={{
          isOpen: activeModal === 'EXPAND_IMAGE',
          onCloseActions: () => setActiveModal('USER_INFOS'),
        }} 
        image={{
          imageUrl: PlaceHolder,
          name: 'placeholder'
        }}
      />

      <Modal 
      isOpen={activeModal === 'USER_SUPPORT_MESSAGES'} 
      modalTitle={
        <>
          <h4 className="sm:block hidden">Mensagens do usuário</h4>
          <h4 className="sm:hidden block">Mensagens</h4>
        </>
      } 
      hasXClose
      onCloseModalActions={() => setActiveModal('USER_INFOS')}
      >
        <div className={`flex flex-col gap-3 max-h-[50vh] pr-3 overflow-y-auto ${secondaryColorScrollBar}`}>
          {user.role !== 'ADMIN' && user.messages.map((message) => {
            const type = message.type === 'APPEAL'
              ? 'Apelo'
            : message.type === 'QUESTION'
              ? 'Pergunta'
            : 'Sugestão'

            return (
              <div className="flex flex-col bg-gray-100/10 p-2 rounded-xl">
                <span className="text-gray text-xs">
                  Código da messagem: {message.id} 
                </span>
                <h4 className="text-cyan mt-1">
                  {message.subject}
                </h4>
                <span className="text-yellow text-sm">
                  {formattedDate(message.sentDate)}
                </span>
                <span className="text-gray">
                  Tipo de mensagem: <span className="text-secondary-middledark">{type}</span>
                </span>
                <p className="text-secondary-light border-t border-primary mt-1 pt-1">
                  {message.message.length > MAX_MESSAGE_LENGTH && !readMore
                    ? message.message.slice(0, MAX_MESSAGE_LENGTH) + '...'
                    : message.message
                  }
                </p>
                <div className="flex justify-between mt-1">
                  <button
                  onClick={() => setReadMore(prev => !prev)}
                  className="text-gray text-left w-fit cursor-pointer"
                  >
                    {readMore
                      ? 'Ler menos'
                      : 'Ler mais'
                    }             
                  </button>
                  <Button 
                    type={"button"}
                    label="Responder"
                    style="px-5"
                    onClick={() => {
                      setActiveModal('REPLY_MESSAGE');
                      setSelectedMessage(message);
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      <Modal
      isOpen={activeModal === 'REPLY_MESSAGE'} 
      modalTitle={'Responder mensagem'} 
      hasXClose
      onCloseModalActions={() => setActiveModal('USER_SUPPORT_MESSAGES')}
      >
        <p className="text-gray">Responder a mensagem {selectedMessage?.id}</p>
      </Modal>
    </div>

    {isDivided && (
      <div className='border mx-2 my-1 border-secondary dark:border-secondary-dark' />
    )}
    </>
  )
}

export default UserCard