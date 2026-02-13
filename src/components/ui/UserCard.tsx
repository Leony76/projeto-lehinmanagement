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
import { UsersDTO } from "@/src/types/usersDTO";
import React from "react";
import { formattedDate } from "@/src/utils/formattedDate";
import { ROLE_LABEL } from "@/src/constants/generalConfigs";

type Props = {
  user: UsersDTO;
}

const UserCard = ({user}:Props) => {

  const [activeModal, setActiveModal] = useState<UsersPageModals | null>(null);

  useLockScrollY(Boolean(activeModal));

  return (
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

      <Modal 
      isOpen={activeModal === 'USER_INFOS'} 
      modalTitle={
        <>
        <div className="sm:block hidden">Informações do usuário</div>
        <div className="sm:hidden block text-2xl">Info. do usuário</div>
        </>
      } 
      hasXClose
      onCloseModalActions={() => {
        setActiveModal(null);
      }}
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
                onClick={() => setActiveModal('EXPAND_IMAGE')}
              />
            </div>

            <div className="order-2 space-y-2 sm:order-1 dark:brightness-[1.2]">
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
              <LabelValue
                label="Pedidos feitos"
                value={user.stats.ordersDone}
              />
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
            </div>

            <div className="order-3 lg:col-span-1 sm:col-span-2">
              <h3 className="text-secondary-middledark mb-1 text-xl">
                Ações recentes
              </h3>
              <div className="border-y max-h-76 overflow-y-auto border-secondary-dark
              hover:scrollbar-thumb-secondary-light
              scrollbar-thumb-secondary-middledark 
                scrollbar-track-secondary-light/0
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-secondary-light
                scrollbar-thin
              ">
              {user.history.map((item, index, array) => {

                const orderDate = formattedDate(item.date);

                if (user.role === 'CUSTOMER' && item.type === 'Pedido') {
                  return (
                    <React.Fragment key={`${item.orderId}-${item.type}-${index}`}>
                    <UserMostRecentActionInfoCard
                      action={item.type}
                      timeStamp={orderDate}
                      product={{
                        name: item.productName,
                        units: item.unitsOrdered,
                        value: item.value,
                      }}
                    />
                    {(index < array.length - 1) && 
                      <div className='border my-1 w-[95%] border-secondary-dark/30'/>
                    }
                    </React.Fragment>
                  )
                } else if (user.role === 'SELLER') {
                  return (
                    <React.Fragment key={`${item.orderId}-${item.type}-${index}`}>
                    <UserMostRecentActionInfoCard
                      action={item.type}
                      timeStamp={orderDate}
                      product={{
                        name: item.productName,
                        units: item.unitsOrdered,
                        value: item.value,
                      }}
                    />
                    {(index < array.length - 1) && 
                      <div className='border my-1 w-[95%] border-secondary-dark/30'/>
                    }
                    </React.Fragment>
                  )
                } else if (user.role === 'ADMIN') {
                   return (
                    <React.Fragment key={`${item.orderId}-${item.type}-${index}`}>

                    <div className="flex flex-col text-sm mb-2 mt-1">
                      <div className="flex gap-2 items-center">
                        <h4 className=''>
                          {'action'}
                        </h4>
                        <span className="text-gray">●</span>
                        <span className="text-yellow text-xs">
                          {'timeStamp'}
                        </span>
                      </div>
                      <span className="text-gray">
                        Produto: <span className="text-cyan">{'name'}</span>
                      </span>
                      <span className="text-gray">
                        Justificativa: <p className="text-gray">{'sad'}</p>
                      </span>
                    </div>

                    {(index < array.length - 1) && 
                      <div className='border my-1 w-[95%] border-secondary-dark/30'/>
                    }
                    </React.Fragment>
                  )
                }
              })}
              </div>
            </div>        
          </div>          
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
  )
}

export default UserCard