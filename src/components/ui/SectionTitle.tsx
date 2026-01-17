import { titleColors } from '@/src/constants/systemColorsPallet'

type Props = {
  title:string; 
  style?:string;
}

const SectionTitle = ({title, style}:Props) => {
  return (
    <div className={style}>
      <h2 className={`text-center text-3xl ${titleColors.secondary}`}>{title}</h2> 
    </div>
  )
}

export default SectionTitle