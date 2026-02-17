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
import { activateUserAccount, deactivateUserAccount, sendReplyMessage } from "@/src/actions/userActions";
import ActiveDeactiveUserAccount from "../modal/Users/ActiveDeactiveUserAccount";
import { secondaryColorScrollBar } from "@/src/styles/scrollBar.style"; 
import UserMessage from "../modal/Users/UserMessage";

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
  const [replyMessage, setReplyMessage] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [accountDeactivationJustify, setAccountDeactivationJustify] = useState<string>('');
  const [accountActivationJustify, setAccountActivationJustify] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  useLockScrollY(Boolean(activeModal));

  const { showToast } = useToast();

  const handleActivateDeactivateUserAccount = async(actionType: 'ACTIVATE' | 'DEACTIVATE'): Promise<void> => {
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

  const handleSendReplyMessageToUser = async() => {
    if (loading) return;
    setLoading(true);

    try {
      if (!selectedMessage) throw new Error('Mensagem não computada');

      await sendReplyMessage(
        selectedMessage.id,
        user.id,
        replyMessage
      );

      showToast(`Sua mensagem foi mandada para ${user.name} com sucesso`, 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal('USER_SUPPORT_MESSAGES');
      setSelectedMessage(null);
      setReplyMessage('');
    }
  }

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
          <div className="sm:block hidden">Mensagens do usuário</div>
          <div className="sm:hidden block">Mensagens</div>
        </>
      } 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal('USER_INFOS');
        setSelectedMessage(null);
      }}
      >
        <div className={`flex flex-col gap-3 max-h-[50vh] pr-3 overflow-y-auto ${secondaryColorScrollBar}`}>
          {user.role !== 'ADMIN' && user.messages.map((message) => (
            <UserMessage
              key={message.id}
              type="MESSAGE_FROM_USER"
              message={message}
              setActiveModal={setActiveModal}
              setSelectedMessage={setSelectedMessage}
              reply={{
                message: message.reply.message,
                at: message.reply.at
              }}
            />
          ))}
        </div>
      </Modal>

      <Modal
      isOpen={activeModal === 'REPLY_MESSAGE'} 
      modalTitle={
        <>
          <div className="sm:hidden block">Responder</div>
          <div className="sm:block hidden ">Responder mensagem</div>
        </>
      } 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal('USER_SUPPORT_MESSAGES');
        setSelectedMessage(null);
        setError('')
        setReplyMessage('');
      }}
      >
        <UserMessage
          type="MESSAGE_REPLY"
          replyMessage={replyMessage}
          message={selectedMessage}
          setReplyMessage={setReplyMessage}
          setActiveModal={setActiveModal}
          error={error}
          setError={setError}
        />
      </Modal>
    </div>

    <Modal
    isOpen={activeModal === 'REPLY_MESSAGE_CONFIRM'} 
    modalTitle={
      <>
        <div className="sm:hidden block">Confirmar</div>
        <div className="sm:block hidden ">Confirmar ação</div>
      </>
    } 
    hasXClose
    onCloseModalActions={() => setActiveModal('REPLY_MESSAGE')}
    >
      <p className="text-secondary-middledark">
        Tem certeza em mandar sua mensagem à <span className="text-cyan">{user.name}</span> ?
      </p>
      <div className="flex gap-3 mt-1">
        <Button 
          style={`flex-1 ${buttonColorsScheme.green}`}
          type={"submit"}
          label="Sim"
          loading={loading}
          loadingLabel="Processando"
          onClick={handleSendReplyMessageToUser}
        />
        <Button 
          style={`flex-1 ${buttonColorsScheme.red}`}
          type={"submit"}
          label="Não"
          onClick={() => setActiveModal('REPLY_MESSAGE')}
        />
      </div>
    </Modal>

    {isDivided && (
      <div className='border mx-2 my-1 border-secondary dark:border-secondary-dark' />
    )}
    </>
  )
}

export default UserCard