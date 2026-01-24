import { Buttontype, ColorScheme } from "@/src/constants/generalConfigs";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet"
import { IconType } from "react-icons";
import Spinner from "../ui/Spinner";

type ButtonProps = {
  colorScheme?: ColorScheme;
  label?: string;
  style?: string;
  iconStyle?: string;
  icon?: IconType;
  type: Buttontype;

  loading?: boolean;
  loadingLabel?: string;

  onClick?: () => void;
}

const Button = ({
  colorScheme,
  label,
  style,
  icon: Icon,
  iconStyle,
  loading,
  loadingLabel,
  type,
  onClick,
}:ButtonProps) => {
  return (
    <button type={type ?? 'submit'} onClick={onClick} className={`${style ?? ""} ${
      colorScheme === 'primary' 
        ? buttonColorsScheme.primary
      : colorScheme == 'red'
        ? buttonColorsScheme.red
      :   buttonColorsScheme.secondary
    } text-left flex justify-center items-center gap-2`}>{
      loading && <Spinner color={
        colorScheme === 'primary'
         ? 'primary'
         : 'secondary'
      }/> 
    }{
      Icon
        ? <Icon className={iconStyle}/>
        : loading 
          ? loadingLabel
          : label
    }</button>
  )
}

export default Button