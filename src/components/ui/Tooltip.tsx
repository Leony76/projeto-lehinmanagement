type TooltipPosition = 
| 'top' 
| 'bottom' 
| 'right' 
| 'left'
;

type TooltipProps = {
  text: string;
  position: TooltipPosition;
  children: React.ReactNode;
  style?: string;
};

export function Tooltip({ 
  text, 
  children,
  position, 
  style,
}: TooltipProps) {

  const positionClasses: Record<TooltipPosition, string> = {
    top: ` bottom-full left-1/2 -translate-x-1/2 mb-2 translate-y-1 group-hover:translate-y-0`,
    bottom: `top-full left-1/2 -translate-x-1/2 mt-2 -translate-y-1 group-hover:translate-y-0`,
    left: `right-full top-1/2 -translate-y-1/2 mr-2 translate-x-1 group-hover:translate-x-0`,
    right: `left-full top-1/2 -translate-y-1/2 ml-2 -translate-x-1 group-hover:translate-x-0`,
  };

  return (
    <div className={`relative inline-flex group ${style ?? ''}`}>
      {children}

      <span className={`
        pointer-events-none
        absolute
        scale-0 group-hover:scale-100
        transition-all duration-150
        rounded-md bg-secondary-dark/30 px-2 py-1
        text-xs text-primary
        brightness-[1.2]
        whitespace-nowrap shadow
        ${positionClasses[position]}
      `}>
        {text}
      </span>
    </div>
  )
}
