import { ColorScheme } from "@/src/constants/generalConfigs";
import { inputColorScheme, textColors } from "@/src/constants/systemColorsPallet";
import { FILTER_OPTIONS, CATEGORY_OPTIONS } from "@/src/constants/generalConfigs";

type Props = {
  selectSetup: 'FILTER' | 'CATEGORY';
  colorScheme: ColorScheme;
  label: string;
  hasTopLabel?: boolean;
  style?: {
    label?: string;
    input?: string;
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
      : CATEGORY_OPTIONS;

  return (
    <div className="flex flex-col w-full">
    {hasTopLabel && (
      <label htmlFor={label} className={`${
        style?.label
          ? style.label
          : ''
      } ${
        colorScheme === 'primary' 
          ? textColors.secondaryMiddleDark
          : textColors.primary
      }`}>{label}</label>
    )}
      <select className={`text-center focus:rounded-b-none cursor-pointer py-1 shadow-sm ${
        style?.input
          ? style.input
          : ''
      } ${
        colorScheme === 'primary' 
          ? inputColorScheme.primary
          : inputColorScheme.secondary
      }`}>
        <option value="" disabled selected>{
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