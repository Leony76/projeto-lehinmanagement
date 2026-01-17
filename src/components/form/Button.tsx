import { colorScheme } from "@/src/constants/generalConfigs";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet"

type ButtonProps = {
  colorScheme?: colorScheme;
  label: string;
  style?: string;
}

const Button = ({
  colorScheme,
  label,
  style
}:ButtonProps) => {
  return (
    <button className={
      style  
        ? style
        : colorScheme === 'primary' 
          ? buttonColorsScheme.primary
          : buttonColorsScheme.secondary
    }>{label}</button>
  )
}

export default Button