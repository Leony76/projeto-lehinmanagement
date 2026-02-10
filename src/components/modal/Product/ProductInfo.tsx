import { formatCurrency } from '@/src/utils/formatCurrency'
import React from 'react'
import Modal from '../Modal'
import Image from 'next/image'
import { productCardInfoStyles as styles } from '@/src/styles/Product/productCardInfo.style'

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
          <div className={styles.genericLabelValue.container}>
            <label className={styles.genericLabelValue.label}>
              Nome
            </label>
            <span className={styles.genericLabelValue.value}>
              {product.name}
            </span>
          </div>
          <div className={styles.genericLabelValue.container}>
            <label className={styles.genericLabelValue.label}>
              Categoria
            </label>
            <span className={styles.genericLabelValue.value}>
              {product.category}
            </span>
          </div>
          <div className={styles.genericLabelValue.container}>
            <label className={styles.genericLabelValue.label}>
              Descrição
            </label>
            <span className={styles.descriptionValue}>
              {product.description}
            </span>
          </div>
          <div className={styles.infosLowerContainer}>
            <div className={styles.genericLabelValue.container}>
              <label className={styles.genericLabelValue.label}>
                Preço unitário
              </label>
              <span className={styles.genericLabelValue.value}>
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className={styles.stockContainer}>
              <label className={styles.genericLabelValue.label}>
                Estoque
              </label>
              <span className={styles.genericLabelValue.value}>
                {product.stock}
              </span>
            </div>
            <div className={styles.soldUnits.container}>
              <label className={styles.soldUnits.label}>
                Unidades Vendidas
              </label>
              <span className={styles.genericLabelValue.value}>
                {product.salesCount}
              </span>
            </div>
            <div className={styles.genericLabelValue.container}>
              <label className={styles.genericLabelValue.label}>
                Publicado
              </label>
              <span className={styles.genericLabelValue.value}>
                {publishedAt}
              </span>
            </div>
            <div className={styles.genericLabelValue.container}>
              <label className={styles.genericLabelValue.label}>
                Atualizado
              </label>
              <span className={styles.genericLabelValue.value}>
                {updatedAt}
              </span>
            </div>
            <div className={styles.genericLabelValue.container}>
              <label className={styles.genericLabelValue.label}>
                Avaliação
              </label>
              <span className={styles.genericLabelValue.value}>
                {product.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductInfo