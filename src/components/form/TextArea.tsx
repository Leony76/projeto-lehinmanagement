"use client"

import { forwardRef } from "react"
import { ColorScheme } from "@/src/constants/generalConfigs"
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"
import Error from "../ui/Error"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: {
    label?: string
    input?: string
    container?: string
  }
  label?: string
  placeholder: string;
  colorScheme?: ColorScheme
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { style, label, placeholder, colorScheme, error, name, ...props },
    ref
  ) => {
    const statusClasses = error
      ? "!border-red-400 shadow-[0px_0px_4px_red] focus:ring-red"
      : colorScheme === "primary"
      ? "focus:ring-primary"
      : "focus:ring-secondary"

    return (
      <div className={`flex flex-col ${style?.container ?? ""}`}>
        {label && (
          <label
            htmlFor={name}
            className={`${style?.label ?? ""} ${
              colorScheme === "primary"
                ? textColors.secondaryMiddleDark
                : textColors.primary
            }`}
          >
            {label}
          </label>
        )}

        <textarea
          placeholder={placeholder}
          ref={ref}
          id={name}
          name={name}
          {...props}
          className={`
            rounded-xl
            ${style?.input ?? ""}
            ${colorScheme === "primary"
              ? inputColorScheme.primary + 
                `
              hover:scrollbar-thumb-primary-light
              scrollbar-thumb-primary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin
                `
              : inputColorScheme.secondary + 
                `
              hover:scrollbar-thumb-secondary-light
              scrollbar-thumb-secondary-middledark 
              scrollbar-track-secondary-light/20
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-secondary-light
                scrollbar-thin
                `
            }
            ${statusClasses}
            mb-1.5
          `}
        />

        {error && <Error error={error} />}
      </div>
    )
  }
)

TextArea.displayName = "TextArea"
export default TextArea
