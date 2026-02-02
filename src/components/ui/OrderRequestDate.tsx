type Props = {
  orderDate: string;
}

const OrderRequestDate = ({orderDate}:Props) => {
  return (
    <h4 className='text-yellow-dark flex gap-1'>
      Data do pedido: 
      <span className='text-gray'>
        {orderDate}
      </span>
    </h4>
  )
}

export default OrderRequestDate;