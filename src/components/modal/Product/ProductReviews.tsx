import Image from 'next/image';
import Modal from '../Modal'
import { ProductReviewsDTO } from '@/src/types/productReviewsDTO';
import NoContentFoundMessage from '../../ui/NoContentFoundMessage';
import Rating from '../../ui/Rating';
import { ROLE_LABEL } from '@/src/constants/generalConfigs';
import { timeAgo } from '@/src/utils/timeAgo';
import { useState } from 'react';
import { primaryColorScrollBar, secondaryColorScrollBar } from '@/src/styles/scrollBar.style';
import ProductReview from '../../ui/ProductReview';

type Props = {
  modal: {
    isOpen: boolean;
    onCloseActions: () => void;
  };
  items: ProductReviewsDTO[] | undefined;
}

const ProductReviews = ({
  modal,
  items,
}:Props) => {

  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={'Avaliações do público'} 
    onCloseModalActions={modal.onCloseActions}
    hasXClose
    >
      <div className={`space-y-3 mt-2 max-h-[70vh] pr-2 overflow-y-auto ${secondaryColorScrollBar}`}>
        {items && items.length > 0 ? (
          items.map((item) => (
            <ProductReview
              key={item.comment.id}
              item={item}
            />
          ))
        ) : (
          <NoContentFoundMessage
            text={'Ninguém avaliou ainda'}
          />
        )}
      </div>
    </Modal>
  )
}

export default ProductReviews