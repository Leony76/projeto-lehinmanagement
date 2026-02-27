import { IconType } from "react-icons"
import ToggleButton from "./ToggleButton";

type Props = {
  icon: IconType;
  iconSize: number;
  label: string;
  onChange: {
    toggleOption: () => void;
    optionValue: boolean;
  };
}

const ToggleOptionContainer = ({
  icon: Icon,
  iconSize,
  label,
  onChange,
}:Props) => {
  return (
    <div className="flex justify-between dark:bg-secondary/30 bg-secondary-light/50 rounded-4xl p-4 border border-secondary-middledark">
      <span className="flex text-lg text-primary-middledark dark:text-primary items-center gap-1">
        <Icon size={iconSize}/>
        {label}
      </span>
      <ToggleButton 
        value={onChange.optionValue}
        onChange={onChange.toggleOption}
      />
    </div>
  )
}

export default ToggleOptionContainer