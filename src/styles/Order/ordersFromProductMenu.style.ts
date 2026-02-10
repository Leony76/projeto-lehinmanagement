import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";

export const ordersFromProductMenu = {
  mainContainer: 'flex h-full max-h-[80vh]',

  productInfo: `sm:flex hidden flex-col rounded-b-2xl gap-3 pr-2 flex-1 overflow-y-auto w-full
                hover:scrollbar-thumb-secondary-light
                scrollbar-thumb-secondary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin`,
  image: {
    container: 'relative aspect-square',
    self: 'rounded-xl border border-primary-middledark dark:border-secondary-dark/70 dark:border-2 object-cover cursor-zoom-in hover:opacity-80 transition duration-200',
  },

  productInfoSubcontainer: 'flex bg-primary-ultralight/25 dark:bg-primary/15 dark:brightness-[1.2] p-2 border border-primary-middledark rounded-2xl flex-col gap-1.5 flex-2',
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

  price_stockContainer: 'flex gap-10',



  productOrdersContainer:  `flex flex-col gap-1 overflow-y-auto flex-2 pr-2
                            hover:scrollbar-thumb-primary-light
                            scrollbar-thumb-primary-middledark 
                            scrollbar-track-transparent
                            hover:scrollbar-track-transparent
                            scrollbar-active-track-transparent
                            scrollbar-active-thumb-primary-light
                            scrollbar-thin
                          `,
  productOrdersInnerContainer: "flex flex-col gap-2",                     
  search_selectContainer: "flex flex-col md:flex-row items-center gap-3 pl-2 mb-2 mt-3",                        

  search: 'py-1 w-full flex-1',
  select: {
    container: 'flex-1 w-ful',
    input: 'flex-1',
    grid: `!grid-cols-1
            sm:!grid-cols-2
            md:!grid-cols-1
            lg:!grid-cols-2`,
  },

  orderCardContainer: 'flex lg:flex-row flex-col bg-secondary-light/25 dark:bg-secondary/15 dark:brightness-[1.2] p-2 ml-2 rounded-2xl border border-secondary-middledark',
  orderCardContainerFromUser: 'flex lg:flex-row flex-col dark:bg-secondary/15 dark:brightness-[1.2] bg-secondary-light/25 p-2 ml-2 rounded-2xl border border-secondary-middledark',

  orderCardInnerLeftContainerFromUser: "flex flex-col m-1 justify-between sm:text-base text-sm sm:space-y-0 space-y-1",
  orderCardInnerRightContainerFromUser: 'flex flex-col lg:flex-col sm:flex-row justify-between gap-3 flex-1',

  orderCardInnerLeftContainer: "sm:text-base text-sm sm:space-y-0 space-y-1",

  orderId: 'text-primary-middledark text-lg italic',

  orderCardInnerRightContainer: 'flex flex-col lg:flex-col sm:flex-row justify-between gap-3 flex-1',
  orderSituationTagContainer: "flex sm:justify-end",
  buttonSchemeContainer: "flex sm:justify-end",
  buttonsContainer: 'flex gap-5',
  decisionButtonsContainer: 'flex gap-2 sm:w-fit w-full',
  decisionButtons: `px-5 flex-1 ${buttonColorsScheme.green}`,

  moreActionsButton: `px-5 ${buttonColorsScheme.secondary}`,
  orderSituationBottomTag: 'flex gap-2 justify-end',
}