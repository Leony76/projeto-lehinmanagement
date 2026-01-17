import { colorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"

type InputProps = {
  style?: {
    label?: string;
    input?: string;
  };
  label: string;
  placeholder: string;
  type: InputTypes;
  colorScheme?: colorScheme;
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
      <label htmlFor={label} className={
        style?.label
          ? style.label
          : colorScheme === 'Fire' 
            ? textColors.secondaryMiddleDark
            : textColors.primary
      }>{label}</label>
      <input placeholder={placeholder} className={
        style?.input
          ? style.input
          : colorScheme === 'Fire' 
            ? inputColorScheme.primary
            : inputColorScheme.secondary
      } type={type} name={label} id={label} />
    </div>
  )
}

export default Input