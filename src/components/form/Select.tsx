import { inputColorScheme, textColors } from "@/src/constants/systemColorsPallet";
import {  ColorScheme, PAYMENT_OPTIONS, FILTER_OPTIONS, CATEGORY_OPTIONS } from "@/src/constants/generalConfigs";

type Props = {
  selectSetup: 'FILTER' | 'CATEGORY' | 'PAYMENT';
  colorScheme?: ColorScheme;
  label: string;
  hasTopLabel?: boolean;
  style?: {
    label?: string;
    input?: string;
    container?: string;
  }
}

const Select = ({
  style, 
  colorScheme,
  selectSetup,
  label,
  hasTopLabel,
}:Props) => {

    const options = 
    selectSetup === 'FILTER' 
      ? FILTER_OPTIONS 
    : selectSetup === 'CATEGORY'
      ? CATEGORY_OPTIONS
      : PAYMENT_OPTIONS
    ;

  return (
    <div className={`flex flex-col w-full ${style?.container ?? ''}`}>
    {hasTopLabel && (
      <label htmlFor={label} className={`${
        colorScheme === 'primary' 
          ? textColors.secondaryMiddleDark
          : textColors.primary
      } ${style?.label ?? ''}`}>{label}</label>
    )}
      <select className={`text-center focus:rounded-b-none cursor-pointer py-1 shadow-sm ${style?.input ?? ''} ${
        colorScheme === 'primary' 
          ? inputColorScheme.primary
          : inputColorScheme.secondary
      }`}>
        <option defaultValue="">{
          hasTopLabel
            ? '-- Selecione --'       
            : label 
        }</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
      </select>
    </div>
  )
}

export default Select