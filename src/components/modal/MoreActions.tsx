"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  moreActions: boolean;
  close: () => void;
  direction: 'right' | 'left';
  style?: {
    container: string;
  }
};

const MoreActions = ({ moreActions,
  close,
  children,
  style,
  direction,
}: Props) => {
  return (
    <div className="relative">
      <div
        className={`
          absolute z-10 ${
            direction === 'right' 
              ? 'right-0' 
              : 'left-0'
          } top-full
          transition-all duration-300 ease-in-out
          ${
            moreActions
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <div className={`flex flex-col gap-2 shadow-[0px_0px_10px_lightgray] p-2 rounded-3xl bg-white ${style?.container ?? ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MoreActions;
