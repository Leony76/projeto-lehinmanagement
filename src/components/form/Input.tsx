"use client"

import { ColorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"
import { useState, forwardRef } from "react";
import { IconType } from "react-icons";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import Error from "../ui/Error";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: {
    container?: string; 
    label?: string;
    input?: string;
  };
  label?: string;
  placeholder: string;
  type: InputTypes;
  colorScheme?: ColorScheme;
  miscConfigs?: {
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
  }
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  style,
  label,
  placeholder,
  type,
  colorScheme,
  miscConfigs,
  error,
  name,
  ...props 
}, ref) => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const EyeIcon: IconType = passwordVisible ? IoEyeSharp : IoEyeOutline;

  const statusClasses = error 
  ? "!border-red-400 shadow-[0px_0px_4px_red] !ring-red focus-within:border-red focus-within:ring-red" 
  : colorScheme === "primary"
    ? "focus-within:ring-primary"
    : "focus-within:ring-secondary";

  const baseInputClasses = `
    ${style?.input ?? ""} 
    ${colorScheme === "primary" ? inputColorScheme.primary : inputColorScheme.secondary}
    ${statusClasses}
  `;

  return (
    <div className={`flex flex-col ${style?.container ?? ""}`}>
      {label && (
        <label
          htmlFor={name}
          className={` ${style?.label ?? ""} ${
            colorScheme === "primary" ? textColors.secondaryMiddleDark : textColors.primary
          }`}
        >
          {label}
        </label>
      )}

      {type === 'password' ? (
        <div className="flex flex-col gap-1">
          <div 
            className={`${baseInputClasses} flex items-center transition-all duration-200 
              ${colorScheme === "primary" 
                ? 'focus-within:bg-primary-dark/90 ring-primary' 
                : 'focus-within:bg-secondary-dark focus-within:text-secondary ring-secondary'
              }`}
          >
            <input
              {...props} 
              ref={ref}  
              id={name}
              name={name}
              placeholder={placeholder}
              type={passwordVisible ? 'text' : 'password'}         
              className="w-full focus:outline-none pr-2 bg-transparent"
              {...miscConfigs}
            />      
            <EyeIcon 
              onClick={() => setPasswordVisible(prev => !prev)} 
              size={24} 
              className={`cursor-pointer ${
                colorScheme === "primary" 
                  ? 'text-primary hover:text-primary-light' 
                  : 'text-secondary hover:text-secondary-light'
              }`}
            />      
          </div>
          {error && <Error error={error}/>}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <input
            {...props}
            ref={ref} 
            id={name}
            name={name}
            placeholder={placeholder}
            type={type}
            className={`${baseInputClasses} focus:outline-none`}
            {...miscConfigs}
          />
          {error && <Error error={error}/>}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;