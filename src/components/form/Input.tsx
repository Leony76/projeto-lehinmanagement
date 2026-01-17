import { ColorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"

type InputProps = {
  style?: {
    label?: string;
    input?: string;
  };
  label: string;
  placeholder: string;
  type: InputTypes;
  colorScheme?: ColorScheme;
}

const Input = ({
  style,
  label,
  placeholder,
  type,
  colorScheme,
}:InputProps) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor={label} className={`${
        style?.label
          ? style.label
          : ''
      } ${
        colorScheme === 'primary' 
          ? textColors.secondaryMiddleDark
          : textColors.primary
      }`}>{label}</label>
      <input placeholder={placeholder} className={`${
        style?.input
          ? style.input
          : ''
      } ${
        colorScheme === 'primary' 
          ? inputColorScheme.primary
          : inputColorScheme.secondary
      }`} type={type}/>
    </div>
  )
}

export default Input