import { ColorScheme } from "@/src/constants/generalConfigs";
import { inputColorScheme } from "@/src/constants/systemColorsPallet";
import { FILTER_OPTIONS, CATEGORY_OPTIONS } from "@/src/constants/generalConfigs";

type Props = {
  selectSetup: 'FILTER' | 'CATEGORY';
  colorScheme: ColorScheme;
  label: string;
  style?: {
    input?: string;
  }
}

const Select = ({
  style, 
  colorScheme,
  selectSetup,
  label,
}:Props) => {

    const options = 
    selectSetup === 'FILTER' 
      ? FILTER_OPTIONS 
      : CATEGORY_OPTIONS;

  return (
    <select className={`text-center py-1 shadow-sm ${
      style?.input
        ? style.input
        : ''
    } ${
      colorScheme === 'primary' 
        ? inputColorScheme.primary
        : inputColorScheme.secondary
    }`}>
      <option value="" disabled selected>{label}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
    </select>
  )
}

export default Select