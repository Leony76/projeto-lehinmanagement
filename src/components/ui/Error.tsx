import React from 'react'
import { FiInfo } from 'react-icons/fi'

const Error = ({error}:{error:string}) => {
  return <p className="flex items-center gap-1 text-red text-sm mt-2 -mb-2"><FiInfo size={16}/>{error}</p> 
}

export default Error