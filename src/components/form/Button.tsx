import { ColorScheme } from "@/src/constants/generalConfigs";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet"
import { IconType } from "react-icons";

type ButtonProps = {
  colorScheme?: ColorScheme;
  label?: string;
  style?: string;
  icon?: IconType;

  onClick?: () => void;
}

const Button = ({
  colorScheme,
  label,
  style,
  icon: Icon,

  onClick
}:ButtonProps) => {
  return (
    <button onClick={onClick} className={`${style ?? ""} ${
      colorScheme === 'primary' 
        ? buttonColorsScheme.primary
      : colorScheme == 'red'
        ? buttonColorsScheme.red
      :   buttonColorsScheme.secondary
    }`}>{
      Icon
        ? <Icon/>
        : label
    }</button>
  )
}

export default Button