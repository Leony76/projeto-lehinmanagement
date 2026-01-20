import { titleColors } from '@/src/constants/systemColorsPallet';
import React from 'react'
import Button from '../form/Button';
import { IoClose } from 'react-icons/io5';

type Props = {
  isOpen: boolean;
  modalTitle: string;
  style?:{
    modalTitle:string;
    xClose: string;
  };
  hasXClose?: boolean;
  children: React.ReactNode;
  openedModal: React.Dispatch<React.SetStateAction<boolean>>;
  reopenPrevModal?: React.Dispatch<React.SetStateAction<boolean>>; 
}

const Modal = ({isOpen,
  children,
  modalTitle,
  hasXClose,
  style,
  openedModal,
  reopenPrevModal,  
}:Props) => {
  return (
    <>
    <div
      className={`
        fixed inset-0 z-50 bg-black/50
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={() => {openedModal(false); reopenPrevModal?.(true)}}
    />
    <div
      className={`
        fixed z-55 left-1/2 top-1/2
        w-[95vw] max-w-242
        -translate-x-1/2
        rounded-3xl bg-white p-4
        flex flex-col gap-2

        transition-all duration-300 ease-out
        ${
          isOpen
            ? 'opacity-100 translate-y-[-50%]'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }
      `}
    >
      <div className='flex justify-between'>
        <h2 className={`${style?.modalTitle ?? 'text-3xl'} ${titleColors.primaryDark}`}>{modalTitle}</h2>
        {hasXClose && <Button onClick={() => {openedModal(false); reopenPrevModal?.(true)}} colorScheme='red' style={style?.xClose ?? 'text-2xl px-1.25 border rounded-[50%]!'} icon={IoClose}/>}
      </div>
      {children}
    </div>
    </>
  )
}

export default Modal