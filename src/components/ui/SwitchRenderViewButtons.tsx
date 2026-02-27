type Props = {
  onClick: {
    setFirstView: () => void;
    setSecondView: () => void;
  };
  view: {
    first: boolean;
    second: boolean;
  };
  label: {
    first: string;
    second: string;
  }
}

const SwitchRenderViewButtons = ({
  onClick,
  view,
  label,
}:Props) => {
  return (
    <div className="flex border-2 border-secondary rounded-3xl w-fit text-secondary">
      <button
      onClick={onClick.setFirstView}
      className={`flex-1 rounded-l-xl p-1 px-4 cursor-pointer transition durantion-400 hover:bg-secondary/40 
        ${view.first 
          ? 'bg-secondary text-white' 
          : ''
        }
      `}
      >         
        {label.first}
      </button>

      <div className="bg-secondary-middledark w-0.5"/>

      <button 
      onClick={onClick.setSecondView}
      className={`flex-2 rounded-r-xl p-1 px-4 cursor-pointer transition durantion-400 hover:bg-secondary/40 
        ${view.second
          ? 'bg-secondary text-white' 
          : ''
        }
      `}
      >
        {label.second}
      </button>
    </div>
  )
}

export default SwitchRenderViewButtons