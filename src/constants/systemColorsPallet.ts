export const titleColors = {
  primary: "text-primary-light text-shadow-[1px_1px_0px_var(--color-primary)]",
  primaryDark: "text-primary-middledark text-shadow-[1px_1px_0px_#976344]",

  secondary: "text-secondary text-shadow-[1px_1px_0px_var(--color-secondary-middledark)]",
  secondaryDark: "text-secondary text-shadow-[1px_1px_0px_var(--color-secondary-middledark)]",

  yellow: "text-yellow text-shadow-[1px_1px_0px_#B19705]",
};

export const textColors = {
  primary: "text-primary",
  primaryMiddleDark: "text-primary-middledark",
  primaryDark: "text-primary-dark",
  primaryLight: "text-primary-light",
  primaryLighter: "text-primary-ultralight",

  secondaryLight: "text-secondary-light",
  secondary: "text-secondary",
  secondaryMiddleDark: "text-secondary-middledark",
  secondaryDark: "text-secondary-dark",

  yellowLight: "text-yellow-light",
  yellow: "text-yellow",
  yellowDark: "text-yellow-dark",

  redLight: "text-red-light",
  red: "text-red",
  redDark: "text-red-dark",

  blueLight: "text-blue-light",
  blue: "text-blue",

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
    active:bg-primary-ultralight/70 active:text-primary
    transition duration-300 cursor-pointer
  `,
  secondary: `
    border-secondary-middledark bg-secondary-light/70 text-secondary-middledark
    border-[1.5px] rounded-3xl p-1
    hover:bg-secondary-dark hover:text-secondary-light
    focus:outline-none focus-visible:bg-secondary-dark focus-visible:text-secondary-light
    active:bg-secondary-light active:text-secondary-middledark
    transition duration-150 cursor-pointer
  `,
};

export const inputColorScheme = {
  primary: `
    bg-primary-ultralight/70 
    text-primary
    border-[1.5px] border-primary border-primary rounded-2xl 
    p-0.5 px-3
    hover:bg-primary-dark/90 hover:text-primary-light
    focus:outline-none focus-visible:bg-primary-dark/90 focus-visible:text-primary-light
    transition duration-300
  `,
  secondary: `
    bg-secondary-light/70 
    text-secondary-middledark
    border-[1.5px] border-secondary rounded-2xl 
    p-0.5 px-3
    hover:text-secondary-light hover:bg-secondary-dark
    focus:outline-none focus-visible:text-secondary-light focus-visible:bg-secondary-dark
    transition duration-300
  `,
};
