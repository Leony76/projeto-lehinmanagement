import React from 'react'

type Props = {
  situation:
  | 'Pagamento pendente'
  | 'Cancelado pelo cliente'
  | 'Cancelado por você'
  | 'Analisado'
  | 'Não analisado'
  ;
}

const OrderSituationTopTag = ({situation}:Props) => {
  return (
    <div className={`absolute top-3 left-3 w-fit py-1 px-3 rounded-2xl border ${
      situation === 'Não analisado'
        ? 'text-yellow-dark bg-yellow-100 border-yellow'
      : situation === 'Pagamento pendente' 
        || situation === 'Cancelado pelo cliente'
        || situation === 'Cancelado por você'
        ? 'text-red-dark bg-red-100 border-red'
      : situation === 'Analisado'
        && 'text-green bg-green-100 border-green' 
    }`}>
      {situation}
    </div>
  )
}

export default OrderSituationTopTag;