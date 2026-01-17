import { ColorScheme } from '@/src/constants/generalConfigs';
import { inputColorScheme } from '@/src/constants/systemColorsPallet';
import React from 'react'
import { IoClose } from 'react-icons/io5';
import { VscSearch } from 'react-icons/vsc';

type Props = {
  colorScheme: ColorScheme;
  style?: {
    input?: string;
  }
}

const Search = ({colorScheme, style}:Props) => {
  return (
    <div className={`flex items-center py-0.75 shadow-sm ${
      style?.input
        ? style.input
        : ''
    } ${
      colorScheme === 'primary' 
        ? inputColorScheme.primary
        : inputColorScheme.secondary
    }`}>
      <VscSearch size={17}/>
      <input placeholder="Pesquisar" className="flex-1 px-2 text-primary-middledark outline-none" type="text"/>
      <IoClose size={20}/>
    </div>
  )
}

export default Search