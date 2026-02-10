
type Props = {
  situation:
  | 'Pagamento pendente'
  | 'Cancelado pelo cliente'
  | 'Cancelado por você'
  | 'Analisado'
  | 'Não analisado'
  | 'Em analise'
  ;
}

const OrderSituationTopTag = ({situation}:Props) => {
  return (
    <div className={`flex items-center w-fit text-center py-1 px-3 rounded-2xl border ${
      situation === 'Não analisado'
      || situation === 'Em analise'
        ? 'text-yellow-dark bg-yellow-100 dark:bg-yellow/20 dark:text-yellow border-yellow'
      : situation === 'Pagamento pendente' 
      || situation === 'Cancelado pelo cliente'
      || situation === 'Cancelado por você'
        ? 'text-red-dark bg-red-100 dark:bg-red/30 dark:text-red border-red'
      : situation === 'Analisado'
        && 'text-green bg-green-100 dark:bg-green/30 dark:text-green border-green' 
    }`}>
      {situation}
    </div>
  )
}

export default OrderSituationTopTag;