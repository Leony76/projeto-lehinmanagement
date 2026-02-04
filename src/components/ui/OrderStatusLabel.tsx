type Props = {
  status: number;
  statusLabel: 
  | 'Aprovados'
  | 'Pendentes'
  | 'Cancelados'
  | 'Rejeitados'
  | 'Não pagos'
  | 'Total'
  ;
}

const OrderStatusLabel = ({
  status,
  statusLabel
}:Props) => {
  return (
    <span className={`text-gray flex gap-1 ${
      statusLabel === 'Total'
        ? 'text-xl mt-1' 
        : '' 
    }`}>
      <span className={
        statusLabel === 'Aprovados'
          ? 'text-green'
        : statusLabel === 'Pendentes'
          ? 'text-yellow-dark'
        : statusLabel === 'Total'
         ? 'text-ui-stock'
        : 'text-red'
      }>{statusLabel}:</span> 
      {status}
    </span>
  )
}

export default OrderStatusLabel