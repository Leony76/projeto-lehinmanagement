export const productCardInfoStyles = {
  mainContainer: 'flex sm:flex-row h-full sm:max-h-full max-h-[70vh] overflow-y-auto h flex-col gap-5 mt-2',

  imageContainer: 'flex-1 relative aspect-square',
  image: 'rounded-2xl hover:opacity-80 dark:border-2 dark:border-secondary-dark transition duration-200 active:opacity-100 object-cover aspect-square cursor-zoom-in',

  infosContainer: 'flex bg-primary-ultralight/25 dark:bg-gray-800 dark:brightness-[1.3] p-2 rounded-2xl flex-col gap-1.5 flex-2',
  genericLabelValue: {
    container: 'flex flex-col',
    label: 'text-primary-middledark font-bold',
    value: 'text-secondary-dark',
  },
  descriptionValue:`max-h-30 overflow-y-auto  
                    hover:scrollbar-thumb-primary-light
                    scrollbar-thumb-primary-middledark 
                    scrollbar-track-transparent
                    hover:scrollbar-track-transparent
                    scrollbar-active-track-transparent
                    scrollbar-active-thumb-primary-light
                    scrollbar-thin text-secondary-dark flex-col
                  `
  ,

  infosLowerContainer: 'flex flex-wrap gap-6',
  stockContainer: 'flex flex-col sm:ml-0 ml-5',
  
  soldUnits: {
    container: 'flex flex-col sm:ml-0 ml-5',
    label: 'text-primary-middledark text-sm font-bold',
  }
}