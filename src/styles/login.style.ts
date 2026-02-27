import { textColors, titleColors } from "../constants/systemColorsPallet";

export const loginStyle = {
  mainContainer: 'flex flex-col justify-center min-h-dvh bg-linear-to-bl from-secondary-light via-white to-primary-ultralight',
  innerContainer: 'flex flex-col items-center justify-center',
  logo_siteContainer: `
    relative
    flex flex-col justify-center items-center 
    transition-transform duration-[776ms] ease-in-out
    hover:scale-[1.1]
    
    after:content-[''] 
    after:absolute after:inset-0 
    after:bg-radial after:from-primary/50 after:to-70% 
    after:opacity-0 after:transition-opacity after:duration-[776ms] 
    hover:after:opacity-100
  `,

  formContainer: 'flex flex-col max-w-62.5 w-full',
  title: `${titleColors.secondary} text-3xl text-center`,

  signupContainer: `${textColors.secondaryMiddleDark} mt-2 text-xs m-auto`,
  signup: `${textColors.primary} ml-1 hover:underline`,
}