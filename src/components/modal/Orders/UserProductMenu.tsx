import { CATEGORY_LABEL_MAP, CategoryValue, OrderFilterValue, UserProductOrdersFilterValue } from "@/src/constants/generalConfigs";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { motion } from "framer-motion";
import Image from "next/image";
import Search from "../../form/Search";
import Select from "../../form/Select";
import NoContentFoundMessage from "../../ui/NoContentFoundMessage";
import OrderCommission from "../../ui/OrderCommission";
import OrderRequestDate from "../../ui/OrderRequestDate";
import OrderRequestQuantity from "../../ui/OrderRequestQuantity";
import Modal from "../Modal";
import { filteredProductOrders } from "@/src/utils/filters/filteredProductOrdersFromUser";

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  onImageClick: () => void;
  product: {
    imageUrl: string;
    name: string;
    category: CategoryValue;
    description: string;
    price: number;
  }
  orders: {
    id: number;
    orderedAmount: number;
    orderDate: string;
    orderTotalPrice: number;
  }[];
  search: {
    order: string;
    filter: UserProductOrdersFilterValue;
    onSearch: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onFilter: (e:React.ChangeEvent<HTMLSelectElement>) => void;
    onClearSearch: () => void;
  };
}


const UserProductMenu = ({
  isOpen,
  onCloseActions,
  onImageClick,
  product,
  orders,
  search,
}:Props) => {

  const category = CATEGORY_LABEL_MAP[product.category];

  const filteredOrders = filteredProductOrders(
    search,
    orders,
  );

  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={ 
      <>
        <span className="hidden md:inline">Pedidos do produto</span>
        <span className="md:hidden">Pedidos</span>
      </>
    } 
    hasXClose
    onCloseModalActions={onCloseActions}
    >
      <div className='flex h-full max-h-[80vh]'>
        <div className='sm:flex hidden flex-col rounded-b-2xl gap-3 pr-2 flex-1 overflow-y-auto w-full
        hover:scrollbar-thumb-secondary-light
        scrollbar-thumb-secondary-middledark 
          scrollbar-track-transparent
          hover:scrollbar-track-transparent
          scrollbar-active-track-transparent
          scrollbar-active-thumb-primary-light
          scrollbar-thin
        '>
          <div className='relative aspect-square'>
            <Image
              src={product.imageUrl}
              fill
              alt={product.name}
              className='rounded-xl border border-primary-middledark object-cover cursor-zoom-in hover:opacity-80 transition duration-200'
              onClick={onImageClick}
            />
          </div>
          <div className='flex bg-primary-ultralight/25 p-2 border border-primary-middledark rounded-2xl flex-col gap-1.5 flex-2'>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Nome
              </label>
              <span className='text-secondary-dark'>
                {product.name}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Categoria
              </label>
              <span className='text-secondary-dark'>
                {category}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Descrição
              </label>
              <span className='h-full max-h-30 overflow-y-auto text-secondary-dark flex-col  
              hover:scrollbar-thumb-primary-light
              scrollbar-thumb-primary-middledark 
                scrollbar-track-transparent
                hover:scrollbar-track-transparent
                scrollbar-active-track-transparent
                scrollbar-active-thumb-primary-light
                scrollbar-thin
                '>
                {product.description}
              </span>
            </div>
            <div className='flex gap-10'>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Preço unitário
                </label>
                <span className='text-secondary-dark'>
                  {formatCurrency(product.price)}
                </span>
              </div>           
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1 overflow-y-auto flex-2 pr-2
        hover:scrollbar-thumb-primary-light
        scrollbar-thumb-primary-middledark 
          scrollbar-track-transparent
          hover:scrollbar-track-transparent
          scrollbar-active-track-transparent
          scrollbar-active-thumb-primary-light
          scrollbar-thin
        '>
        <div className="flex flex-col md:flex-row items-center gap-3 pl-2 mb-2 mt-3">
          <Search
            style={{ input: 'py-1 w-full flex-1' }}
            colorScheme="primary"
            value={search.order}
            onChange={search.onSearch}
            onClearSearch={search.onClearSearch}
          />
          <Select
            style={{ 
              input: 'flex-1 w-full', 
              container: 'flex-1',
              grid: `
                !grid-cols-1
                sm:!grid-cols-2
                md:!grid-cols-1
                lg:!grid-cols-2
              ` 
            }}
            selectSetup="USER_PRODUCT_ORDERS_FILTER"
            colorScheme="primary"
            label="Filtro"
            value={search.filter}
            onChange={search.onFilter}
          />
        </div>
          {filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredOrders.map((order) => (
                <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 2, scale:  0.5 }}
                animate={{ opacity: 1, y: 0, scale:  1   }}
                   exit={{ opacity: 0, y: -5, scale: 0.5 }}
                transition={{
                  duration: .25,
                  ease: "easeOut"
                }}
                className="flex flex-col"
                >
                <div className='flex lg:flex-row flex-col bg-secondary-light/25 p-2 ml-2 rounded-2xl border border-secondary-middledark'>
                  <div className="flex flex-col m-1 justify-between sm:text-base text-sm sm:space-y-0 space-y-1">
                    <span className="text-primary-middledark italic">
                      Pedido #{order.id}
                    </span>
                    <OrderRequestDate
                      orderDate={order.orderDate}
                    />
                    <OrderRequestQuantity
                      orderQuantity={order.orderedAmount}
                    />
                    <OrderCommission
                      customLabel="Valor:"
                      orderCommission={order.orderTotalPrice}
                    />
                  </div>           
                </div>               
                </motion.div>
              ))}
            </div>
          ) : (
            <NoContentFoundMessage
              text={'Nenhum resultado encontrado!'}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default UserProductMenu