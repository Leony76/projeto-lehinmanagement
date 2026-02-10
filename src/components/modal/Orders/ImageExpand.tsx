import Modal from "../Modal";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onCloseActions: () => void;
  onImageClick: () => void;
  product: {
    name: string;
    imageUrl: string;
  }
}

const ImageExpand = ({
  isOpen,
  onCloseActions,
  onImageClick,
  product,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={''} 
    onCloseModalActions={onCloseActions}>
      <div className='relative aspect-square h-[90vh]'>
        <Image 
          src={product.imageUrl} 
          alt={product.name}            
          fill
          className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
          onClick={onImageClick}
        />
      </div>
    </Modal>
  )
}

export default ImageExpand