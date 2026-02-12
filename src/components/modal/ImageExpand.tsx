import Image, { StaticImageData } from "next/image";
import Modal from "./Modal";

type Props = {
  modal: {
    isOpen: boolean;
    onCloseActions: () => void;
  };
  image: {
    imageUrl: string | StaticImageData;
    name: string;
  };
}

const ImageExpand = ({
  modal,
  image,
}:Props) => {
  return (
    <Modal 
    isOpen={modal.isOpen} 
    modalTitle={''} 
    onCloseModalActions={modal.onCloseActions}>
      <div className='relative aspect-square h-[90vh]'>
        <Image 
          src={image.imageUrl} 
          alt={image.name}            
          fill
          className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
          onClick={modal.onCloseActions}
        />
      </div>
    </Modal>
  )
}

export default ImageExpand