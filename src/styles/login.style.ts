import { textColors, titleColors } from "../constants/systemColorsPallet";

export const loginStyle = {
  mainContainer: 'flex flex-col justify-center min-h-dvh bg-linear-to-bl from-secondary-light via-white to-primary-ultralight',
  innerContainer: 'flex flex-col items-center justify-center',
  logo_siteContainer: 'flex flex-col justify-center  items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%',

  formContainer: 'flex flex-col max-w-62.5 w-full',
  title: `${titleColors.secondary} text-3xl text-center`,

  signupContainer: `${textColors.secondaryMiddleDark} mt-2 text-xs m-auto`,
  signup: `${textColors.primary} ml-1 hover:underline`,
}