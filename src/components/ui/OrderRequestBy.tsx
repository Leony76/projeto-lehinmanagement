import { getNameAndSurname } from "@/src/utils/getNameAndSurname";

type Props = {
  customerName: string;
}

const OrderRequestBy = ({customerName}:Props) => {
  return (
    <h4 className='text-yellow-dark xl:text-[14px] flex gap-1 line-clamp-1 truncate'>
      Pedido por: 
      <span className='text-cyan '>
        {getNameAndSurname(customerName)}
      </span>
    </h4>
  )
}

export default OrderRequestBy