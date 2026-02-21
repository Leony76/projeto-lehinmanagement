import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";

export const productCardSetup = {
  mainContainer: 'rounded-3xl shadow-[0px_0px_3px_gray] p-2 dark:shadow-[0px_0px_5px_orange] dark:bg-primary-dark/30',
  image: 'rounded-2xl object-cover aspect-square',

  infosContainer: 'flex flex-col gap-1 mt-2',
    name: 'text-primary-middledark xl:text-xl dark:text-primary text-2xl  line-clamp-1',

    categoryDateRatingContainer: 'block xl:text-sm',

      categoryDate: 'flex items-center gap-1 dark:text-secondary-middledark text-secondary-dark',
      rating: 'flex items-center gap-1 dark:text-yellow text-lg text-yellow-dark',
    
    priceStockContainer: 'flex flex-col justify-between mb-1',

      price: 'text-ui-money text-xl dark:brightness-[1.3]',
      stock: 'text-ui-stock xl:text-base text-lg',
      stockLabel: 'text-gray xl:text-base text-lg',
    
    seller: {
      container: 'flex gap-1 text-cyan',
      label: 'text-gray'
    }
}

export const productCardStyles = {
  mainContentContainer: 'relative rounded-3xl shadow-[0px_0px_3px_gray] p-2 dark:shadow-[0px_0px_5px_orange] dark:bg-primary-dark/30',

  imageContainer: 'relative aspect-square w-full',
  image: 'rounded-2xl object-cover aspect-square dark:border-[1.5px] dark:shadow-[0px_0px_3px_cyan]',
      
  productInfosContainer: 'flex flex-col gap-1 mt-2',     
  name: 'text-primary-middledark xl:text-xl dark:text-primary text-2xl  line-clamp-1',
      
  category_date_ratingContainer: 'block xl:text-sm',
  category_date: 'flex items-center gap-1 dark:text-secondary-middledark text-secondary-dark',
  rating: 'flex items-center gap-1 dark:text-yellow text-lg text-yellow-dark',
  rating_commentContainer: "flex justify-between items-center",
  rate: {
    rated: 'transition-all duration-300 ease-out opacity-100 translate-x-0 pointer-events-auto',
    notRated: 'transition-all duration-300 ease-out opacity-0 translate-x-3 pointer-events-none'
  },

  price_stockContainer: 'flex flex-col justify-between mb-1',     
  stockLabel: 'text-gray xl:text-base text-lg',
  stock: {
    withStock: 'text-ui-stock xl:text-base text-lg flex gap-1 items-center', 
    withoutStock: 'text-red italic bg-linear-to-r from-red/20 pl-2 rounded-tl-xl to-transparent',
  } ,
       
  price_productInfoContainer: 'flex justify-between items-center',
  price: 'text-ui-money text-xl dark:brightness-[1.3]',
  sellerContainer: 'flex gap-1 text-cyan',
      
  label: 'text-gray', 

  moreInfosButton: 'flex-5',
  removeProductButton: `flex-1 ${buttonColorsScheme.red}`,
  warningMessage: 'text-sm text-yellow-dark -mt-2 flex items-center gap-1',
};
    
