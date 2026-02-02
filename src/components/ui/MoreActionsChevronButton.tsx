import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import { FaChevronDown } from "react-icons/fa6";
import Button from "../form/Button";

type Props = {
  onClick: () => void;
  moreActions: boolean;
}

const MoreActionsChevronButton = ({
  onClick,
  moreActions,
}:Props) => {
  return (
    <Button
      type='button'
      onClick={onClick}
      style={`px-5 flex items-center justify-center ${
        moreActions
          ? '!bg-gray border-gray! text-white hover:bg-gray/15! hover:text-gray!'
          : buttonColorsScheme.gray
      }`}
      icon={FaChevronDown}
      iconStyle={`transition-transform duration-300 ${
        moreActions ? 'rotate-180' : 'rotate-0'
      }`}
    />
  )
}

export default MoreActionsChevronButton;