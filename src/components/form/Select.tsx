"use client"

import { forwardRef } from "react"
import { ColorScheme, PAYMENT_OPTIONS, FILTER_OPTIONS, CATEGORY_OPTIONS } from "@/src/constants/generalConfigs"
import { inputColorScheme, textColors } from "@/src/constants/systemColorsPallet"
import Error from "../ui/Error"

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSetup: "FILTER" | "CATEGORY" | "PAYMENT"
  colorScheme?: ColorScheme
  label?: string
  hasTopLabel?: boolean
  error?: string
  style?: {
    label?: string
    input?: string
    container?: string
  }
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      style,
      colorScheme,
      selectSetup,
      label,
      hasTopLabel,
      error,
      name,
      ...props
    },
    ref
  ) => {
    const options =
      selectSetup === "FILTER"
        ? FILTER_OPTIONS
        : selectSetup === "CATEGORY"
        ? CATEGORY_OPTIONS
        : PAYMENT_OPTIONS

    const statusClasses = error
      ? "!border-red-400 shadow-[0px_0px_4px_red] focus:ring-red"
      : colorScheme === "primary"
      ? "focus:ring-primary"
      : "focus:ring-secondary"

    return (
      <div className={`flex flex-col ${style?.container ?? ""}`}>
        {label && hasTopLabel && (
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

        <select
          ref={ref}
          id={name}
          name={name}
          {...props}
          className={`
            ${style?.input ?? ""}
            ${colorScheme === "primary"
              ? inputColorScheme.primary
              : inputColorScheme.secondary}
            ${statusClasses}
            text-center py-1 cursor-pointer mb-1
          `}
        >
          <option value="">
            {hasTopLabel ? "-- Selecione --" : label}
          </option>

          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <Error error={error} />}
      </div>
    )
  }
)

Select.displayName = "Select"
export default Select
