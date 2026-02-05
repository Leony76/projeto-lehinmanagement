type Props = {
  orderDate: string;
}

const OrderRequestDate = ({orderDate}:Props) => {
  return (
    <h4 className='text-yellow-dark flex gap-1'>
      Data do pedido: 
      <span className='text-gray sm:block hidden'>
        {new Date(orderDate).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </span>
      <span className='text-gray sm:hidden block'>
        {new Date(orderDate).toLocaleDateString('pt-BR')}
      </span>
    </h4>
  )
}

export default OrderRequestDate;