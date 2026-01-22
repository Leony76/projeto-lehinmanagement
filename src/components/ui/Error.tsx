import { FiInfo } from 'react-icons/fi'

const Error = ({error}:{error:string}) => {
  return <p className={`flex items-center gap-1 
    text-red text-${
      error.length > 30 
        ? 'xs' 
        : 'sm'
    } -mb-1 mt`}><FiInfo size={16}/>{error}</p> 
}

export default Error