import { ColorScheme } from "@/src/constants/generalConfigs";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet"
import { IconType } from "react-icons";

type ButtonProps = {
  colorScheme?: ColorScheme;
  label?: string;
  style?: string;
  icon?: IconType;
}

const Button = ({
  colorScheme,
  label,
  style,
  icon: Icon
}:ButtonProps) => {
  return (
    <button className={`${style ?? ""} ${
      colorScheme === 'primary' 
        ? buttonColorsScheme.primary
        : buttonColorsScheme.secondary
    }`}>{
      Icon
        ? <Icon/>
        : label
    }</button>
  )
}

export default Button