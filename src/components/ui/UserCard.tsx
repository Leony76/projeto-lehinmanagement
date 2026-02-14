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
import { isAdminAction, isCustomerAction, isSellerAction, UsersDTO } from "@/src/types/usersDTO";
import { formattedDate } from "@/src/utils/formattedDate";
import { ROLE_LABEL } from "@/src/constants/generalConfigs";
import { secondaryColorScrollBar } from "@/src/styles/scrollBar.style";
import UserInfoMenu from "../modal/Users/UserInfoMenu";
import TextArea from "../form/TextArea";
import WarningInfo from "./WarningInfo";
import Error from "./Error";
import { useToast } from "@/src/contexts/ToastContext";

type Props = {
  user: UsersDTO;
  isDivided: boolean;
}

const UserCard = ({
  user,
  isDivided,
}:Props) => {

  const [activeModal, setActiveModal] = useState<UsersPageModals | null>(null);
  const [error, setError] = useState<string>('');
  const [accoutDeactivation, setAccoutDeactivation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useLockScrollY(Boolean(activeModal));

  const { showToast } = useToast();

  const handleDeactivateUserAccount = async():Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {

    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(false);
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
        <div className='rounded-2xl dark:brightness-[1.1] bg-green/20 border-2 border-green-500 tracking-wide px-3 text-green-500'>
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

      <Modal 
      isOpen={activeModal === 'DEACTIVATE_USER'} 
      hasXClose
      modalTitle={'Desativar usuário'} 
      onCloseModalActions={() => {
        setActiveModal('USER_INFOS');
        setAccoutDeactivation('');
        setError('');
      }}>
        <p className="text-secondary-middledark">
          Tenha certeza que deseja desativar <span className="text-cyan">{user.name}</span> do sistema ?
        </p>
        <p className="text-primary">
          Cite a justificativa da desativação
        </p>
        <TextArea
          placeholder={"Justificativa"}
          value={accoutDeactivation}
          style={{
            input: error 
              ? 'shadow-[0px_0px_7px_red]' 
              : '',
            container: 'mb-[-7px]'
          }}
          onChange={(e) => {
            setAccoutDeactivation(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
        <div className="mt-2"/>    
        <WarningInfo 
          text={"Todos os ativos do usuário desativado permanecerão intocáveis. O mesmo também será informado."}
        />
        <div className="flex gap-3">
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={"button"}
            label="Desativar"
            onClick={() => {
              if (accoutDeactivation.length < 100 && accoutDeactivation.length > 0) {
                setError('Não é possível desativar a conta do usuário sem uma justificativa de até 100 caractéres');
                return;
              } else if (accoutDeactivation.length === 0) {
                setError('Não é possível desativar a conta do usuário sem uma justificativa');
                return;
              }
              handleDeactivateUserAccount();
            }}  
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            type={"button"}
            label="Cancelar"
            onClick={() => {
              setActiveModal('USER_INFOS');
              setAccoutDeactivation('');
              setError('');
            }}
          />
        </div>
      </Modal>

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
    </div>

    {isDivided && (
      <div className='border mx-2 my-1 border-secondary dark:border-secondary-dark' />
    )}
    </>
  )
}

export default UserCard