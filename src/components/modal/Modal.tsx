import { titleColors } from '@/src/constants/systemColorsPallet';
import React from 'react'
import Button from '../form/Button';
import { IoClose } from 'react-icons/io5';

type Props = {
  isOpen: boolean;
  modalTitle: React.ReactNode;
  style?:{
    modalTitle?:string;
    xClose?: string;
    container?: string;
  };
  hasXClose?: boolean;
  children: React.ReactNode;
  onCloseModalActions: () => void;
}

const Modal = ({isOpen,
  children,
  modalTitle,
  hasXClose,
  style,
  onCloseModalActions, 
}:Props) => {
  return (
    <>
    <div
      className={`
        fixed inset-0 z-50 bg-black/50
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onCloseModalActions}
    />
    <div
      className={`
        fixed z-55 left-1/2 top-1/2
        w-[95vw] max-w-242
        -translate-x-1/2
        rounded-3xl bg-white p-4
        flex flex-col gap-2
      dark:bg-gray-900
        dark:shadow-[0px_0px_8px_orange]
        transition-all duration-300 ease-out
        ${
          isOpen
            ? 'opacity-100 translate-y-[-50%]'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }
      ${style?.container ?? ''}`}
    >
      <div className='flex justify-between'>
        <h2 className={`${style?.modalTitle ?? 'text-3xl'} ${titleColors.primaryDark}`}>{modalTitle}</h2>
        {hasXClose && <Button type='button' onClick={onCloseModalActions} colorScheme='red' style={style?.xClose ?? 'text-2xl px-1.25 border rounded-[50%]!'} icon={IoClose}/>}
      </div>
      {children}
    </div>
    </>
  )
}

export default Modal