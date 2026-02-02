import { formatCurrency } from '@/src/utils/formatCurrency';

type Props = {
  orderCommission: number;
}

const OrderCommission = ({orderCommission}:Props) => {
  return (
    <h3 className='text-gray text-xl w-full lg:text-lg md:text-xl sm:text-2xl sm:max-w-87.5 max-w-68.5 flex gap-1'>
      Comissão: 
      <span className='text-ui-money truncate '>
        {formatCurrency(orderCommission)}
      </span>
    </h3>
  )
}

export default OrderCommission;