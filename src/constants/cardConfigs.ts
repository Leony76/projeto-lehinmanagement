export const productCardSetup = {
  mainContainer: 'rounded-xl shadow-[0px_0px_3px_gray] p-2',
  image: 'rounded-2xl object-cover aspect-square',

  infosContainer: 'flex flex-col gap-1 mt-2',
    name: 'text-primary-middledark xl:text-xl text-2xl  line-clamp-1',

    categoryDateRatingContainer: 'block xl:text-sm',

      categoryDate: 'flex items-center gap-1 text-secondary-dark',
      rating: 'flex items-center gap-1 text-lg text-yellow-dark',
    
    priceStockContainer: 'flex flex-col justify-between mb-1',

      price: 'text-ui-money text-xl',
      stock: 'text-ui-stock xl:text-base text-lg',
      stockLabel: 'text-gray xl:text-base text-lg',
    
    seller: {
      container: 'flex gap-1 text-cyan',
      label: 'text-gray'
    }
}