import { productCardInfoStyles as styles } from '@/src/styles/Product/productCardInfo.style'

type Props = {
  label: string;
  value: string | number;
  textarea?: boolean;
}

const LabelValue = ({
  label,
  value,
  textarea,
}:Props) => {
  return (
    <div className={styles.genericLabelValue.container}>
      <label className={styles.genericLabelValue.label}>
        {label}
      </label>
      <span className={textarea 
        ? styles.descriptionValue
        : styles.genericLabelValue.value
      }>
        {value}
      </span>
    </div>
  )
}

export default LabelValue