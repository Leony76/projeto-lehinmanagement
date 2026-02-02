import { FaCheck } from 'react-icons/fa6'

const PaidTag = () => {
  return (
    <span className='flex py-1.5 items-center gap-1 bg-linear-to-r from-transparent via-green/10 to-transparent justify-center w-full text-xl text-green'>
      <FaCheck size={24}/>
      Pago
    </span>  
  )
}

export default PaidTag;