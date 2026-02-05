import { FaCheck } from 'react-icons/fa6'

const PaidTag = () => {
  return (
    <span className='flex py-1.5 pl-4 md:mt-1 lg:mb-0 mb-2 rounded-bl-2xl items-center sm:justify-start justify-center gap-1 bg-linear-to-r sm:from-green/10 sm:via-transparent from-transparent via-green/10 to-transparent w-full text-xl text-green'>
      <FaCheck size={24}/>
      Pago
    </span>  
  )
}

export default PaidTag;