import { textColors } from '@/src/constants/systemColorsPallet'

type Props = {
  title: string;
  content: string | number;
  colSpanFull?: boolean
  style?: {
    container?: string;
    title?: string;
    content?: string; 
  }
}

const InfoCard = ({
  title,
  content,
  colSpanFull,
  style,
}:Props) => {
  return (
    <div className={`bg-primary-ultralight/50 transition duration-500 
        dark:shadow-[0px_0px_5px_cyan]
        dark:active:shadow-[0px_0px_3px_cyan]
        dark:bg-primary-dark/60
        hover:scale-[1.020] 
        hover:shadow-[0px_0px_8px_#4ad6cd] 
        active:scale-[1.020] 
        active:shadow-[0px_0px_8px_#4ad6cd] 
      py-2 px-4 rounded-xl shadow-[0px_0px_3px_#4ad6cd] ${
      colSpanFull 
        ? 'col-span-full' 
        : ''
    } ${
      style?.container
       ? style.container
       : ''
    }`}>    
      <h3 className={`text-lg dark:text-secondary  ${textColors.secondaryDark} ${
        style?.title
          ? style.title
          : ''
      }`}>{title}</h3>
      <span className={`text-xl ${textColors.primaryMiddleDark} ${
        style?.content
          ? style.content
          : ''
      }`}>{content}</span>
    </div>
  )
}

export default InfoCard