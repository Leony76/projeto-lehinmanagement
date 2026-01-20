import { ColorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"

type InputProps = {
  style?: {
    container?: string; 
    label?: string;
    input?: string;
  };
  label?: string;
  placeholder: string;
  type: InputTypes;
  colorScheme?: ColorScheme;
  miscConfigs?: {
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
  }
}

const Input = ({
  style,
  label,
  placeholder,
  type,
  colorScheme,
  miscConfigs
}:InputProps) => {
  return (
    <div className={`flex flex-col ${style?.container ?? ''}`}>
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
      }`} type={type} min={miscConfigs?.min} max={miscConfigs?.max} maxLength={miscConfigs?.maxLength} minLength={miscConfigs?.minLength}/>
    </div>
  )
}

export default Input