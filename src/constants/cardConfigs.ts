export const productCardSetup = {
  mainContainer: 'rounded-xl shadow-[0px_0px_3px_gray] p-2',
  image: 'rounded-2xl object-cover aspect-square',

  infosContainer: 'flex flex-col gap-1 mt-2',
    name: 'text-primary-middledark text-2xl',

    categoryDateRatingContainer: 'flex items-center justify-between',

      categoryDate: 'flex items-center gap-1 text-secondary-dark',
      rating: 'flex items-center gap-1 text-yellow-dark',
    
    priceStockContainer: 'flex justify-between mb-1',

      price: 'text-ui-money text-xl',
      stock: 'text-ui-stock text-lg',
}