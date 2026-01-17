import { titleColors } from '@/src/constants/systemColorsPallet'

type Props = {
  title:string; 
  style?:string;
}

const PageTitle = ({title, style}:Props) => {
  return (
    <div className={style}>
      <h1 className={`text-center text-4xl ${titleColors.primaryDark}`}>{title}</h1>
    </div>
  )
}

export default PageTitle