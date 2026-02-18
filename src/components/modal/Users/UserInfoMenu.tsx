'use client';

import { ROLE_LABEL } from '@/src/constants/generalConfigs';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { secondaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { isCustomerAction, isSellerAction, isAdminAction, UsersDTO } from '@/src/types/usersDTO';
import { formattedDate } from '@/src/utils/formattedDate';
import Button from '../../form/Button';
import LabelValue from '../../ui/LabelValue';
import UserMostRecentActionInfoCard from '../../ui/UserMostRecentActionInfoCard';
import Modal from '../Modal';
import Image from 'next/image';
import PlaceHolder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg'
import { UsersPageModals } from '@/src/types/modal';
import NoContentFoundMessage from '../../ui/NoContentFoundMessage';
import { useState } from 'react';

type Props = {
  user: UsersDTO;
  modal: {
    isOpen: boolean;
    onCloseActions: () => void;
    setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  };
  onClick: {
    onAvatarImage: () => void;
  };
}

const UserInfoMenu = ({
  modal,
  user,
  onClick,
}:Props) => {

  const [openCardId, setOpenCardId] = useState<string | null>(null);

  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={
      <>
      <div className="sm:block hidden">Informações do usuário</div>
      <div className="sm:hidden block text-2xl">Info. do usuário</div>
      </>
    } 
    hasXClose
    onCloseModalActions={modal.onCloseActions}
    >
      <div className="max-h-[70dvh] overflow-y-auto h-full">
        <div className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        ">

          <div className="order-1 self-center hover:scale-[1.025] cursor-zoom-in hover:brightness-[1.2] hover:shadow-[0px_0px_15px_orange] transition duration-200 sm:order-2 h-fit w-fit mx-auto border-2 rounded-full p-2 my-2 border-primary">
            <Image
              src={PlaceHolder}
              alt={"placeholder"}
              height={270}
              width={270}
              className="rounded-full aspect-square object-cover"
              onClick={onClick.onAvatarImage}
            />
          </div>

          <div className="order-2 space-y-2 sm:order-1 dark:brightness-[1.2] flex flex-col h-full">
            <LabelValue
              label="Nome completo"
              value={user.name}
            />
            <LabelValue
              label="Posição"
              value={ROLE_LABEL[user.role]}
            />
            <LabelValue
              label="Criado"
              value={formattedDate(user.createdAt)}
            />
            
            {user.role !== 'ADMIN' &&
              <LabelValue
                label="Pedidos feitos"
                value={
                  user.role === 'SELLER'
                    ? user.stats.ordersDone
                  : user.role === 'CUSTOMER'
                    ? user.ordersDone
                  : 0
                }
              />
            }

            {user.role === 'SELLER' &&
              <LabelValue
                label="Vendas feitas"
                value={user.stats.salesDone}
              />
            }

            <LabelValue
              label="Status"
              value={user.isActive 
                ? 'Ativo'
                : 'Inativo'
              }
            />
            
            <div className='flex gap-2 w-fit h-fit mt-auto'>
              {user.role !== 'ADMIN' &&
                user.isActive ? (
                  <Button 
                    type={"button"}
                    label="Desativar conta"
                    style={`px-5 ${buttonColorsScheme.red} w-fit h-fit`}        
                    onClick={() => modal.setActiveModal('DEACTIVATE_USER')}    
                  />
                ) : !user.isActive && (
                  <Button 
                    type={"button"}
                    label="Ativar conta"
                    style={`px-5 ${buttonColorsScheme.green} w-fit h-fit mt-auto`}        
                    onClick={() => modal.setActiveModal('ACTIVATE_USER')}    
                  />
                )
              }

              {(user.role !== 'ADMIN' && user.hasMessages) &&
                <Button 
                  type={"button"}
                  label="Mensagens"
                  style={`px-5 ${buttonColorsScheme.yellow}`}        
                  onClick={() => modal.setActiveModal('USER_SUPPORT_MESSAGES')}    
                />
              }
            </div>
          </div>

          <div className="order-3 lg:col-span-1 max-h-90 overflow-y-hidden sm:col-span-2">
            <h3 className="text-secondary-middledark mb-1 text-xl">
              Ações recentes
            </h3>
            <div className={`border-y max-h-82 overflow-y-auto border-secondary-dark ${secondaryColorScrollBar}`}>

            {user.history.length > 0 ? (
              user.history.map((item, index, array) => {
  
                const orderDate = formattedDate(item.date);
                if (user.role === 'CUSTOMER' && isCustomerAction(item)) {
                  return (
                    <UserMostRecentActionInfoCard
                      key={`${item.orderId}-${item.type}-${index}`}
                      userRole="CUSTOMER"
                      action={item.type}
                      timeStamp={orderDate}
                      product={{
                        name: item.productName ?? '',
                        units: item.unitsOrdered,
                        value: item.value,
                      }}
                      showDivider={index < array.length - 1}
                    />
                  )
                } else if (user.role === 'SELLER' && isSellerAction(item)) {
                  return (
                    <UserMostRecentActionInfoCard
                      key={`${item.date}-${item.type}-${index}`}
                      userRole="SELLER"
                      action={item.type}
                      timeStamp={orderDate}
                      product={{
                        name: item.productName ?? '',
                        units: item.unitsOrdered,
                        value: item.value,
                      }}
                      showDivider={index < array.length - 1}
                    />
                  )
                } else if (user.role === 'ADMIN' && isAdminAction(item)) {
                  return (
                    <UserMostRecentActionInfoCard
                      key={`${item.date}-${item.type}-${index}`}
                      userRole="ADMIN"
                      action={item.type}
                      timeStamp={orderDate}
                      id={index}
                      justification={item.justification}
                      isOpen={openCardId === `${item.date}-${item.type}-${index}`} 
                      onToggle={() => setOpenCardId(openCardId === `${item.date}-${item.type}-${index}` ? null : `${item.date}-${item.type}-${index}`)}
                      target={
                        item.target === 'USER'
                        ? {
                          type: 'USER',
                          username: item.username ?? '',
                        }
                        : {
                          type: 'PRODUCT',
                          productName: item.productName ?? '',
                        }
                      }
                      showDivider={index < array.length - 1}
                    />
                  )
                }
              })
            ) : (
              <NoContentFoundMessage 
                text={'Nenhum ação realizada'}
              />
            )}
            </div>
          </div>        
        </div>          
      </div>
    </Modal>
  )
}

export default UserInfoMenu