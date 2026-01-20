import { FaRegCircleCheck } from 'react-icons/fa6'
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { IoIosCloseCircleOutline } from 'react-icons/io';

type Props = {
  type: 'success' | 'error' | 'alert' | 'info';
  value: string;
  isOpen: boolean;
}

const Toast = ({ type, value, isOpen }: Props) => {
  return (
    <div
      className={`
        fixed z-70 top-0 left-1/2 -translate-x-1/2
        transition-all duration-300 ease-out
        ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-5 pointer-events-none'
        }
        flex items-center gap-2 py-5 px-6 w-full justify-center shadow-lg text-lg
        ${
          type === 'success'
            ? 'bg-linear-to-r from-[#36AC12] to-green text-green-100'
          : type === 'error'
            ? 'bg-linear-to-r from-red to-[#AC1212] text-red-100'
          : type === 'alert'
            ? 'bg-linear-to-r from-yellow to-[#C3A500] text-yellow-100'
          :
            'bg-linear-to-r from-blue to-blue-light text-blue-100'
        }
      `}
    >
      {
        type === 'success' 
          ? <FaRegCircleCheck size={30} />
        : type === 'error' 
          ? <IoIosCloseCircleOutline size={40}/>
        : type === 'alert' 
          ? <FiAlertTriangle size={30}/>
        : 
          <FiInfo size={30}/>
      } 
      {value}
    </div>
  )
}

export default Toast
