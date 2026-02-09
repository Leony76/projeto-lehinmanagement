import { formatCurrency } from '@/src/utils/formatCurrency'
import React from 'react'
import Modal from '../Modal'
import { ProductPageModals } from '@/src/types/modal'
import Image from 'next/image'

type Props = {
  modal: {
    isActive: boolean;
    onCloseActions: () => void;
  };
  product: {
    imageUrl: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    salesCount: number;
    publishedAt: string;
    updatedAt: string;
  };
  actions: {
    onImageClick: () => void;
  };
}

const ProductInfo = ({
  modal,
  product,
  actions,
}:Props) => {

  const publishedAt = new Date(product.publishedAt).toLocaleDateString('pt-BR');
  const updatedAt = new Date(product.updatedAt).toLocaleDateString('pt-BR');

  return (
    <Modal 
    isOpen={modal.isActive} 
    modalTitle={'Informações'}
    hasXClose 
    onCloseModalActions={modal.onCloseActions}
    >
      <div className='flex sm:flex-row h-full sm:max-h-full max-h-[70vh] overflow-y-auto h flex-col gap-5 mt-2'>
        <div className='flex-1 relative aspect-square'>
          <Image 
            src={product.imageUrl} 
            alt={product.name}            
            fill
            className='rounded-2xl hover:opacity-80 dark:border-2 dark:border-secondary-dark transition duration-200 active:opacity-100 object-cover aspect-square cursor-zoom-in'
            onClick={actions.onImageClick}
          />
        </div>
        <div className='flex bg-primary-ultralight/25 dark:bg-gray-800 dark:brightness-[1.3] p-2 rounded-2xl flex-col gap-1.5 flex-2'>
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
              {product.category}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-primary-middledark font-bold'>
              Descrição
            </label>
            <span className='max-h-30 overflow-y-auto  
            hover:scrollbar-thumb-primary-light
            scrollbar-thumb-primary-middledark 
              scrollbar-track-transparent
              hover:scrollbar-track-transparent
              scrollbar-active-track-transparent
              scrollbar-active-thumb-primary-light
              scrollbar-thin text-secondary-dark flex-col'>
              {product.description}
            </span>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex flex-col '>
              <label className='text-primary-middledark font-bold'>
                Preço unitário
              </label>
              <span className='text-secondary-dark'>
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className='flex flex-col sm:ml-0 ml-5'>
              <label className='text-primary-middledark font-bold'>
                Estoque
              </label>
              <span className='text-secondary-dark'>
                {product.stock}
              </span>
            </div>
            <div className='flex flex-col '>
              <label className='text-primary-middledark text-sm font-bold'>
                Unidades Vendidas
              </label>
              <span className='text-secondary-dark'>
                {product.salesCount}
              </span>
            </div>
            <div className='flex flex-col '>
              <label className='text-primary-middledark font-bold'>
                Publicado
              </label>
              <span className='text-secondary-dark'>
                {publishedAt}
              </span>
            </div>
            <div className='flex flex-col '>
              <label className='text-primary-middledark font-bold'>
                Atualizado
              </label>
              <span className='text-secondary-dark'>
                {updatedAt}
              </span>
            </div>
            <div className='flex flex-col '>
              <label className='text-primary-middledark font-bold'>
                Avaliação
              </label>
              <span className='text-secondary-dark'>
                4,5
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductInfo