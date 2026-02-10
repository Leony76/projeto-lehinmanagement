"use client";
import { useState } from "react";

type Props = {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
};

const ToggleButton = ({
  value,
  onChange,
  disabled,
}:Props) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`
        w-14 h-8 rounded-full p-1 transition-colors cursor-pointer
        ${value 
          ? "bg-linear-to-r from-primary-middledark to-primary focus:shadow-[0px_0px_7px_orange] outline-none" 
          : "bg-linear-to-r from-secondary to-secondary-middledark focus:shadow-[0px_0px_5px_cyan] outline-none"
        }
        ${disabled 
          ? "opacity-50 cursor-not-allowed" 
          : ""
        }
      `}
    >
      <div
        className={`
          w-6 h-6 bg-white rounded-full transition-transform
          ${value ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}

export default ToggleButton;
