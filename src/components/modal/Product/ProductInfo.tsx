import { formatCurrency } from '@/src/utils/formatCurrency'
import React from 'react'
import Modal from '../Modal'
import Image from 'next/image'
import { productCardInfoStyles as styles } from '@/src/styles/Product/productCardInfo.style'
import LabelValue from '../../ui/LabelValue'

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
    rating: string | null;
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
      <div className={styles.mainContainer}>
        <div className={styles.imageContainer}>
          <Image 
            src={product.imageUrl} 
            alt={product.name}            
            fill
            className={styles.image}
            onClick={actions.onImageClick}
          />
        </div>
        <div className={styles.infosContainer}>      
          <LabelValue
            label='Nome'
            value={product.name}
          />
          
          <LabelValue
            label='Categoria'
            value={product.category}
          />

          <LabelValue
            label='Descrição'
            value={product.description}
            textarea
          />

          <div className={styles.infosLowerContainer}>
           
            <LabelValue
              label='Preço unitário'
              value={formatCurrency(product.price)}
            />
            
            <LabelValue
              label='Estoque'
              value={product.stock}
            />
            
            <LabelValue
              label='Unidades vendidas'
              value={product.salesCount}
            />

            <LabelValue
              label='Publicado'
              value={publishedAt}
            />
          
            <LabelValue
              label='Publicado'
              value={updatedAt}
            />
            
             <LabelValue
              label='Avaliação'
              value={product.rating ?? 'Não avaliado'}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductInfo