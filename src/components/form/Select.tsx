"use client"

import { forwardRef, useEffect, useState } from "react"
import { ColorScheme, PAYMENT_OPTIONS, PRODUCT_FILTER_OPTIONS, CATEGORY_OPTIONS, SelectFilterOptions, ORDER_FILTER_OPTIONS, USER_ORDER_FILTER_OPTIONS, USER_PRODUCT_FILTER_OPTIONS, USER_PRODUCT_ORDERS_FILTER_OPTIONS, USERS_FILTER_OPTIONS, USER_ROLE_FILTER_OPTIONS } from "@/src/constants/generalConfigs"
import { textColors } from "@/src/constants/systemColorsPallet"
import Error from "../ui/Error"
import Button from "./Button"
import { AnimatePresence, motion } from "framer-motion"
import { FaFilterCircleXmark } from "react-icons/fa6"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSetup: SelectFilterOptions;
  colorScheme?: ColorScheme
  label?: string
  hasTopLabel?: boolean
  error?: string
  style?: {
    label?: string
    input?: string
    container?: string
    grid?: string;
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
      selectSetup === "PRODUCT_FILTER"
        ? PRODUCT_FILTER_OPTIONS
      : selectSetup === "USER_PRODUCT_FILTER"
        ? USER_PRODUCT_FILTER_OPTIONS
      : selectSetup === "ORDER_FILTER"
        ? ORDER_FILTER_OPTIONS
      : selectSetup === "USER_ORDER_FILTER"
        ? USER_ORDER_FILTER_OPTIONS
      : selectSetup === "CATEGORY" 
        ? CATEGORY_OPTIONS
      : selectSetup === "USER_PRODUCT_ORDERS_FILTER"
        ? USER_PRODUCT_ORDERS_FILTER_OPTIONS
      : selectSetup === "USERS_FILTER"
        ? USERS_FILTER_OPTIONS
      : selectSetup === "USERS_ROLE"
        ? USER_ROLE_FILTER_OPTIONS
      : PAYMENT_OPTIONS

    const dropdownVariants = {
      hidden: {
        opacity: 1,
        y: 0,
        scaleY: 0.1,
        transition: {
          duration: 0.1,
          ease: "easeOut"
        }
      },
      visible: {
        opacity: 0.90,
        y: 0,
        scaleY: 1,
        transition: {
          duration: 0.1,
          ease: "easeOut"
        }
      },
      exit: {
        opacity: 1,
        y: 0,
        scaleY: 0.1,
        transition: {
          duration: 0.1,
          ease: "easeIn"
        }
      }
    };

    const handleSelect = (optionValue: string) => {
      setValue(optionValue);
      showSelectOptions(false);

      props.onChange?.({
        target: { value: optionValue, name }
      } as React.ChangeEvent<HTMLSelectElement>);
    };

    const [selectOptions, showSelectOptions] = useState<boolean>(false);
    const [value, setValue] = useState<string>((props.value as string) || (props.defaultValue as string) || '');

    useEffect(() => {
      const externalValue = (props.value as string) || (props.defaultValue as string) || '';
      if (externalValue !== value) {
        setValue(externalValue);
      }
    }, [props.value, props.defaultValue]);


    const selectedOption = options.find(opt => opt.value === value);

    return (
      <div className={`flex w-full flex-col ${style?.container ?? ""}`}>
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
          name={name} 
          defaultValue={value}
          hidden
        >
          <option value="" />
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>


        <div className={`relative ${style?.container ?? ''}`}>
          <Button 
            type="button"
            label={selectedOption?.label ?? label ?? "Selecione"}
            colorScheme={colorScheme}
            style={`w-full !text-center ${selectOptions ? 'rounded-b-none' : ''} ${style?.input ?? ''}`}
            onClick={() => showSelectOptions(prev => !prev)}
          />

          <AnimatePresence>
            {selectOptions && (
              <motion.div
              key="select-options"
              variants={dropdownVariants as any}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top" }}
              className={`
                absolute z-10 w-full
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                p-4 rounded-b-3xl border-b-10 border-double gap-2
                ${style?.grid ?? ''} ${
                  colorScheme === 'primary'
                    ? 'bg-linear-to-b from-primary-dark to-primary border-primary-ultralight'
                    : 'bg-linear-to-b from-secondary-dark to-secondary-middledark border-secondary-light'
                }
              `}
              >
                <button 
                type="button"
                className={`text-left flex items-center gap-2 justify-center transition duration-200 hover:text-white hover:bg-white/15 rounded-2xl p-0.5 cursor-pointer active:bg-transparent ${
                  colorScheme === 'primary'
                    ? 'text-red'
                    : 'text-red'
                }`}
                onClick={() => handleSelect('')}
                >
                  <FaFilterCircleXmark/>
                  {'Nenhum'}
                </button>
              {options.map((option) => (
                <button 
                key={option.value}
                type="button"
                className={`transition duration-200 hover:text-white hover:bg-white/15 rounded-2xl p-0.5 cursor-pointer active:bg-transparent ${
                  colorScheme === 'primary'
                    ? 'text-primary-ultralight'
                    : 'text-secondary-light'
                } ${
                  option.label.length > 10
                    ? 'text-sm'
                    : 'text-base'
                }`}
                onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <Error error={error} />}
      </div>
    )
  }
)

Select.displayName = "Select"
export default Select

