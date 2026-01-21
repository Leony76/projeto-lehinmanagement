"use client"

import { ColorScheme, InputTypes } from "@/src/constants/generalConfigs";
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"
import { useState } from "react";
import { IconType } from "react-icons";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";

type InputProps = {
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

  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Input = ({
  style,
  label,
  placeholder,
  type,
  colorScheme,
  miscConfigs,
  value,
  name,
  onChange,
}:InputProps) => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const EyeIcon: IconType = passwordVisible ? IoEyeSharp : IoEyeOutline;

  return (
    <div className={`flex flex-col ${style?.container ?? ""}`}>
      {label && (
        <label
          htmlFor={name}
          className={`${
            style?.label ?? ""
          } ${
            colorScheme === "primary"
              ? textColors.secondaryMiddleDark
              : textColors.primary
          }`}
        >
          {label}
        </label>
      )}

      {type === 'password' ? (
        <div 
          className={
           `${
              style?.input ?? ""
            } ${
              colorScheme === "primary"
                ? inputColorScheme.primary + 'focus-within:bg-primary-dark/90'
                : inputColorScheme.secondary + 'focus-within:bg-secondary-dark focus-within:text-secondary'
            } flex items-center`
          }
        >
          <input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={passwordVisible ? 'text' : 'password'}         
            min={miscConfigs?.min}
            max={miscConfigs?.max}
            maxLength={miscConfigs?.maxLength}
            minLength={miscConfigs?.minLength}
            className="w-full focus:outline-none pr-2"
          />      
          <EyeIcon onClick={() => setPasswordVisible(prev => !prev)} size={24} className={
            `${
              style?.input ?? ""
            } ${
              colorScheme === "primary"
                ? 'text-primary hover:text-primary-light'
                : 'text-secondary hover:text-secondary-light'
            } flex items-center cursor-pointer`
          }/>      
        </div>
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          className={`${
            style?.input ?? ""
          } ${
            colorScheme === "primary"
              ? inputColorScheme.primary
              : inputColorScheme.secondary
          }`}
          min={miscConfigs?.min}
          max={miscConfigs?.max}
          maxLength={miscConfigs?.maxLength}
          minLength={miscConfigs?.minLength}
        />
      )}
    </div>
  );
}

export default Input