import { BsDropbox } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdOutlinePending } from 'react-icons/md';
import { TbCancel } from "react-icons/tb";

type Props = {
  situation:
  | 'Aprovado'
  | 'Cancelado'
  | 'Rejeitado'
  | 'Estoque insuficiente'
  | 'Pendente'
  ;
};

const OrderSituationBottomTag = ({situation}:Props) => {
  return (
    <span className={`flex py-1.5 items-center gap-1 justify-center w-full text-xl ${
      situation === 'Aprovado'
        ? 'text-green dark:brightness-[1.2]'
      : situation === 'Cancelado' 
      || situation === 'Rejeitado' 
      || situation === 'Estoque insuficiente'
        ? 'text-red-dark dark:text-red'
      : 'text-yellow-dark'
    }`}>
      {situation === 'Aprovado'
        ? <FaCheck size={24}/>
      : situation === 'Cancelado'
        ? <TbCancel size={24}/>
      : situation === 'Estoque insuficiente'
        ? <BsDropbox size={24}/>
      : situation === 'Rejeitado'
        ? <IoClose size={30}/>
      : <MdOutlinePending size={24}/>
      }
      {situation}
    </span>
  )
}

export default OrderSituationBottomTag