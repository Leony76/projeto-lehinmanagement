"use client"

import { forwardRef } from "react"
import { ColorScheme } from "@/src/constants/generalConfigs"
import { textColors, inputColorScheme } from "@/src/constants/systemColorsPallet"
import Error from "../ui/Error"

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: {
    label?: string
    input?: string
    container?: string
  }
  label?: string
  colorScheme?: ColorScheme
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { style, label, colorScheme, error, name, ...props },
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
          ref={ref}
          id={name}
          name={name}
          {...props}
          className={`
            rounded-xl
            ${style?.input ?? ""}
            ${colorScheme === "primary"
              ? inputColorScheme.primary
              : inputColorScheme.secondary}
            ${statusClasses}
           mb-1.5`}
        />

        {error && <Error error={error} />}
      </div>
    )
  }
)

TextArea.displayName = "TextArea"
export default TextArea
