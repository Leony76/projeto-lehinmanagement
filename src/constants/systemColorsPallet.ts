export const titleColors = {
  primary: "text-primary-light text-shadow-[1px_1px_0px_var(--color-primary)]",
  primaryDark: "text-primary-middledark text-shadow-[1px_1px_0px_#976344] dark:brightness-[1.4]",

  secondary: "text-secondary text-shadow-[1px_1px_0px_var(--color-secondary-middledark)]",
  secondaryDark: "text-secondary text-shadow-[1px_1px_0px_var(--color-secondary-middledark)]",

  yellow: "text-yellow text-shadow-[1px_1px_0px_#B19705]",
};

export const textColors = {
  primary: "text-primary",
  primaryMiddleDark: "text-primary-middledark dark:text-primary",
  primaryDark: "text-primary-dark",
  primaryLight: "text-primary-light",
  primaryLighter: "text-primary-ultralight",

  secondaryLight: "text-secondary-light",
  secondary: "text-secondary",
  secondaryMiddleDark: "text-secondary-middledark",
  secondaryDark: "text-secondary-dark dark:text-secondary-middledark",

  yellowLight: "text-yellow-light",
  yellow: "text-yellow",
  yellowDark: "text-yellow-dark",

  redLight: "text-red-light",
  red: "text-red",
  redDark: "text-red-dark",

  blueLight: "text-blue-light",
  blue: "text-blue",

  greenLight: "text-green",

  gray: "text-gray",

  uiMoney: "text-ui-money",
  uiStock: "text-ui-stock",
};

export const inputColors = {
  background: {
    primary: "bg-primary/70",
    primaryDark: "bg-primary-dark/70",
    primaryLight: "bg-primary-light/70",
    primaryLighter: "bg-primary-ultralight/70",

    secondaryLight: "bg-secondary-light",
    secondary: "bg-secondary",
    secondaryMiddleDark: "text-secondary-middledark",
    secondaryDark: "bg-secondary-dark",
  }, 
  
  border: {
    primary: "border-primary",
    primaryDark: "border-primary-dark",
    primaryLight: "border-primary-light",
    primaryLighter: "border-primary-ultralight",

    secondaryLight: "border-secondary-light",
    secondary: "border-secondary",
    secondaryMiddleDark: "text-secondary-middledark",
    secondaryDark: "border-secondary-dark",
  }
};

export const buttonColorsScheme = {
  primary: `
    border-primary bg-primary-ultralight/70 text-primary
    border-[1.5px] rounded-3xl p-1
    hover:bg-primary-dark hover:text-primary-light
    focus:outline-none focus-visible:bg-primary-dark focus-visible:text-primary-light
    sm:active:bg-primary-ultralight/70 sm:active:text-primary
    active:bg-primary-dark active:text-primary-light
    transition sm:duration-300 duration-150 cursor-pointer
    dark:bg-primary-light/30
  `,

  secondary: `
    border-secondary-middledark bg-secondary-light/70 text-secondary-middledark
    border-[1.5px] rounded-3xl p-1
    hover:bg-secondary-dark hover:text-secondary-light
    focus:outline-none focus-visible:bg-secondary-dark focus-visible:text-secondary-light
    sm:active:bg-secondary-light/70 sm:active:text-secondary-middledark
    active:bg-secondary-dark active:text-secondary-light
    transition sm:duration-300 duration-150 cursor-pointer
    dark:bg-secondary-middledark/40
  `,

  green: `
    !border-green !bg-green/15 !text-green dark:bg-green/30!
    border-[1.5px] rounded-3xl p-1
    hover:!bg-green hover:!text-white
    focus:outline-none focus-visible:!bg-green focus-visible:!text-white
    sm:active:!bg-green/15 sm:active:!text-green
    active:!bg-green active:!text-white
    transition sm:duration-300 duration-150 cursor-pointer
  `,

  red: `
    !border-red !bg-red/15 !text-red dark:bg-red/30!
    border-[1.5px] rounded-3xl p-1
    hover:!bg-red hover:!text-white
    focus:outline-none focus-visible:!bg-red focus-visible:!text-white
    sm:active:!bg-red/15 sm:active:!text-red
    active:!bg-red active:!text-white
    transition sm:duration-300 duration-150 cursor-pointer
  `,

  yellow: `
    !border-yellow !bg-yellow-100 !text-yellow dark:bg-yellow-100/15!
    border-[1.5px] rounded-3xl p-1
    hover:!bg-yellow-dark hover:!text-yellow-100
    focus:outline-none focus-visible:!bg-yellow-dark focus-visible:!text-white
    sm:active:!bg-yellow-100 sm:active:!text-yellow-dark
    active:!bg-yellow-dark active:!text-white
    transition sm:duration-300 duration-150 cursor-pointer
  `,

  gray: `
    !border-gray !bg-gray/15 !text-gray
    border-[1.5px] rounded-3xl p-1
    hover:!bg-gray hover:!text-white
    focus:outline-none focus-visible:!bg-gray focus-visible:!text-white
    sm:active:!bg-gray/15 sm:active:!text-gray
    active:!bg-gray active:!text-white
    transition sm:duration-300 duration-150 cursor-pointer
  `,

  menuLi: `
    cursor-pointer p-2 rounded-xl
    text-primary-light
    hover:bg-white/10 hover:text-secondary-light
    focus-visible:bg-white/10 focus-visible:text-secondary-light
    sm:active:text-primary-light
    active:text-secondary-middledark
    transition sm:duration-300 duration-150
  `,
};

export const staticButtonColorScheme = {
    primary: `
    border-primary bg-primary-ultralight/70 text-primary
    border-[1.5px] rounded-3xl p-1
    hover:bg-primary-dark hover:text-primary-light
    transition duration-300 
  `,
  secondary: `
    border-secondary-middledark bg-secondary-light/70 text-secondary-middledark
    border-[1.5px] rounded-3xl p-1
    hover:bg-secondary-dark hover:text-secondary-light
    transition duration-150 
  `,

  green: `
    !text-green !border-green !bg-green-100
    hover:!bg-green hover:!border-green-500 hover:!text-green-100
    transition duration-150 
  `,

  red: `
    !text-red !border-red !bg-red-100
    hover:!bg-red hover:!border-red-500 hover:!text-red-100
    transition duration-150 
  `,

  yellow: `
    !text-yellow !border-yellow !bg-yellow-100
    hover:!bg-yellow-dark hover:!border-yellow-100 hover:!text-yellow-100
    transition duration-150 
  `,

  gray: `
    !text-gray !border-gray !bg-gray-100
    hover:!bg-gray hover:!border-gray hover:!text-gray-100
    transition duration-150 
  `,
}

export const inputColorScheme = {
  primary: `
    bg-primary-ultralight/70 
    text-primary
    border-[1.5px] border-primary border-primary rounded-2xl 
    p-0.5 px-3
    hover:bg-primary-dark/90 hover:text-primary
    focus:outline-none focus-visible:bg-primary-dark/90 focus-visible:text-primary
    transition duration-300
    dark:bg-primary-light/30
  `,
  secondary: `
    bg-secondary-light/70 
    dark:bg-secondary/30
    text-secondary-middledark
    border-[1.5px] border-secondary rounded-2xl 
    p-0.5 px-3
    hover:text-secondary hover:bg-secondary-dark
    focus:outline-none focus-visible:text-secondary focus-visible:bg-secondary-dark
    transition duration-300
    dark:bg-secodary-light/30
  `,
};