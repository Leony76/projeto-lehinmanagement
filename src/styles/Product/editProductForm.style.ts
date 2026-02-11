import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";

export const editProductFormStyle = {
  mainContainer: 'mb-4 sm:flex block sm:max-h-full max-h-[70vh] overflow-y-auto h-full gap-6 w-full max-w-200 mx-auto',
  addSellProductMainContainer: "mb-4 sm:flex block gap-6 w-full max-w-200  mx-auto",

  changeImageContainer: `relative flex w-full flex-col justify-center items-center text-sm text-center mt-5 mb-1 border aspect-square rounded-3xl overflow-hidden ${buttonColorsScheme.primary}}`,
  image: 'absolute inset-0 w-full h-full object-cover',

  formInputsContainer: 'flex flex-1 flex-col gap-2 justify-between sm:gap-0 mt-2',
  price_stock: {
    container: 'w-full flex-1',
    input: 'w-full',
  },

  editButton: `mt-3 text-xl ${buttonColorsScheme.yellow}`,

  imageContainerForMobile: 'hidden sm:flex flex-col flex-1',

  misc: {
    errorInputGlow: 'shadow-[0px_0px_5px_red]',
  }
}