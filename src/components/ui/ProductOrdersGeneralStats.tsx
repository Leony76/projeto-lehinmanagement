import React from 'react'

type Props = {
  approved: number;
  pending: number;
  canceled: number;
  rejected: number;
  notPaid: number;
  total: number;
}

const ProductOrdersGeneralStats = ({
  approved,
  pending,
  canceled,
  rejected,
  notPaid,
  total,
}:Props) => {
  return (
    <div className="grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 grid-cols-2 gap-2">
      <div className="flex flex-col p-3 text-xl rounded-xl border text-green border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Aprovados</span> 
        {approved}
      </div>
      <div className="flex flex-col p-3 text-xl rounded-xl border text-yellow-dark border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Pendentes</span> 
        {pending}
      </div>
      <div className="flex flex-col p-3 text-xl rounded-xl border text-red border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Cancelados</span> 
        {canceled}
      </div>
      <div className="flex flex-col p-3 text-xl rounded-xl border text-red border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Rejeitados</span> 
        {rejected}
      </div>
      <div className="flex flex-col p-3 text-xl rounded-xl border text-red border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Não pagos</span> 
        {notPaid}
      </div>
      <div className="flex flex-col p-3 text-xl rounded-xl border text-ui-stock border-secondary-middledark bg-secondary-light/35">
        <span className="text-base text-gray">Total</span> 
        {total}
      </div>
    </div>
  )
}

export default ProductOrdersGeneralStats