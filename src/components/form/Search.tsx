import { ColorScheme } from '@/src/constants/generalConfigs';
import { inputColorScheme } from '@/src/constants/systemColorsPallet';
import React from 'react'
import { IoClose } from 'react-icons/io5';
import { VscSearch } from 'react-icons/vsc';

type Props = {
  colorScheme: ColorScheme;
  style?: {
    input?: string;
  };
  onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch?: () => void;
  value?: string;
}

const Search = ({
  colorScheme,
  style,
  value,
  onChange,
  onClearSearch,
}:Props) => {
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
      <input 
        placeholder="Pesquisar" 
        className="flex-1 px-2 text-primary-middledark outline-none" 
        type="text"
        value={value}
        onChange={onChange}
      />
      <IoClose 
        size={20}
        onClick={onClearSearch}
        className='hover:bg-primary transition-all duration-200 scale-[1.1] active:bg-transparent active:text-primary cursor-pointer hover:text-primary-dark rounded-[50%]'
      />
    </div>
  )
}

export default Search