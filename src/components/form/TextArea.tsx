import { ColorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"

type InputProps = {
  style?: {
    label?: string;
    input?: string;
  };
  label?: string;
  placeholder: string;
  colorScheme?: ColorScheme;
}

const TextArea = ({
  style,
  label,
  placeholder,
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
      <textarea placeholder={placeholder} className={`rounded-xl ${
        style?.input
          ? style.input
          : ''
      } ${
        colorScheme === 'primary' 
          ? inputColorScheme.primary
          : inputColorScheme.secondary
      }`}/>
    </div>
  )
}

export default TextArea