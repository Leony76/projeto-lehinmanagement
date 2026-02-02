type Props = {
  stockIfOrderAccepted: number;
}

const StockIfAccpeted = ({stockIfOrderAccepted}:Props) => {
  return (
    <h4 className='text-gray flex gap-1'>
      Estoque se aceito: 
      <span className={
        stockIfOrderAccepted > 0 
          ? 'text-ui-stock' 
          : 'text-red bg-linear-to-r from-red/50 to-transparent px-2 rounded-tl-2xl'
      }>
        {stockIfOrderAccepted}
      </span>
    </h4>
  )
}

export default StockIfAccpeted