import { productCardStyles as style } from '@/src/styles/Product/productCard.style';
import { LuInfo } from 'react-icons/lu';

const WarningInfo = ({text}:{text:string}) => {
  return (
    <p className={style.warningMessage}>
      <LuInfo size={20}/>
      {text}
    </p>
  )
}

export default WarningInfo;