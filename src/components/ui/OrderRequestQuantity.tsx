type Props = {
  orderQuantity: number;
}

const OrderRequestQuantity = ({orderQuantity}:Props) => {
  return (
    <h4 className='text-gray flex gap-1'>
      Quantidade pedida: 
      <span className='text-ui-stock'>
        {orderQuantity}
      </span>
    </h4>
  )
}

export default OrderRequestQuantity