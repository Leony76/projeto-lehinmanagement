'use client';

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { ProductDTO } from '@/src/types/productDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useUserStore } from '@/src/store/useUserStore';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import { removeProduct } from '@/src/actions/productActions';
import { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import { useToast } from '@/src/contexts/ToastContext';
import EditProductForm from '../form/EditProductForm';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import OrderProduct from '../modal/OrderProduct';
import { useLockScrollY } from '@/src/utils/useLockScrollY';
import { FaInfo } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { ProductPageModals } from '@/src/types/modal';
import ProductInfo from '../modal/Product/ProductInfo';
import ImageExpand from '../modal/ImageExpand';
import RemoveProductJustify from '../modal/Product/RemoveProductJustify';
import ConfirmRemove from '../modal/Product/ConfirmRemove';

type Props = {
  product: ProductDTO;
}

const Product = ({
  product,
}:Props) => {

  const { showToast } = useToast();

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [activeModal, setActiveModal] = useState<ProductPageModals | null>(null);

  const [removeJustify, setRemoveJustify] = useState<string>('');
  const [error, setError] = useState<string>('');


  const user = useUserStore((stats) => stats.user);

  const available = product.stock - product.reservedStock;
  const canOrder = (product.sellerId !== user?.id) && (user?.role !== 'ADMIN');

  const handleRemoveProduct = async() => {
    if (!removeJustify) {
      setError('A justificativa de remoção é obrigatória');
      return;
    }

    try {
      
      await removeProduct(product.id, removeJustify);
      
      setRemoveJustify('');
      showToast('Produto removido com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao remover produto', 'error');
    } finally {
      setActiveModal(null);
    }
  };

  useLockScrollY(Boolean(activeModal));  

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={`relative ${productCardSetup.mainContainer} `}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={`${productCardSetup.image} dark:border-[1.5px] dark:shadow-[0px_0px_3px_cyan]`}
        />
      </div>
      <div className={productCardSetup.infosContainer}>
        <h3 className={productCardSetup.name}>{product.name}</h3>
        <div className={productCardSetup.categoryDateRatingContainer}>
          <div className={productCardSetup.categoryDate}>
            <span>{category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{datePutToSale}</span>
          </div>
          <div className={productCardSetup.rating}>
          {!product.productAverageRating 
            ? <IoStarOutline/>
            : <IoStar/> 
          }
            {product.productAverageRating ?? 'Não avaliado'}
          </div>
        {(product.sellerRole !== 'ADMIN') ? (       
          <div className={productCardSetup.seller.container}>
            <span className={productCardSetup.seller.label}>
              Vendedor(a):
            </span> 
            {product.sellerName === user?.name
              ? getNameAndSurname(product.sellerName) + ' (Você)'
              : getNameAndSurname(product.sellerName)
            }
          </div>
        ) : (
          <div className={productCardSetup.seller.container}> 
            Ofertado pelo sistema
          </div>
        )}
        </div>
        <div className={productCardSetup.priceStockContainer}>
        {product.stock > 0 ? (
          <span className={
            product.stock > 0 
            ? productCardSetup.stock + ' flex gap-1 items-center'
            : 'text-red flex gap-1 items-center'
          }>
            <span className={productCardSetup.stockLabel}>
              Em estoque:
            </span> 
            {product.stock}
          </span>
        ) : (
          <span className='text-red italic bg-linear-to-r from-red/20 pl-2 rounded-tl-xl to-transparent'>
            Sem estoque
          </span> 
        )}
          <div className='flex justify-between items-center'>
            <span className={productCardSetup.price}>
              {formatCurrency(product.price)}
            </span>
            <Button 
              type={'button'}
              icon={FaInfo}
              style='p-2 px-4'
              onClick={() => setActiveModal('PRODUCT_INFO')}
            />
          </div>
        </div>
      {canOrder ? (
        available > 0 ? (
          <Button
            label="Fazer pedido"
            colorScheme="primary"
            onClick={() => setActiveModal('ORDER_PRODUCT_MENU')}
            type="button"
          />
        ) : (
          <Button
            style={`pointer-events-none ${buttonColorsScheme.red}`}
            label="Indisponível"
            colorScheme="primary"
            type="button"
          />
        )
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            label="Editar"
            style={`flex-1 dark:bg-yellow-500 ${buttonColorsScheme.yellow}`}
            onClick={() => setActiveModal('EDIT_PRODUCT')}
          />
          <Button
            type="button"
            label="Remover"
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => setActiveModal('CONFIRM_REMOVE_PRODUCT')}
          />
        </div>
      )}
      </div>

      {/* ⇊ MODALS ⇊ */}

      <ConfirmRemove
        modal={{
          isOpen: activeModal === 'CONFIRM_REMOVE_PRODUCT',
          onCloseActions: () => setActiveModal(null),
        }}
        user={{ role: user?.role }}
        onClick={{
          yes: () => setActiveModal('REMOVE_PRODUCT_JUSTIFY'),
          no: () => setActiveModal(null),
        }}
      />

      <RemoveProductJustify
        modal={{ 
          isOpen: activeModal === 'REMOVE_PRODUCT_JUSTIFY',
          onCloseActions: () => setActiveModal(null),
        }}
        onChange={{ textarea: (e) => {
          setRemoveJustify(e.target.value);
          setError('');
        }}}
        onClick={{ 
          confirm: () => handleRemoveProduct(),
          cancel: () => setActiveModal(null),
        }}
        product={{ sellerName: product.sellerName ?? '[Desconhecido]' }}
        misc={{ error }}
      />


      <Modal 
      isOpen={activeModal === 'EDIT_PRODUCT'} 
      modalTitle={'Editar produto'}
      onCloseModalActions={() => setActiveModal(null)}
      hasXClose
      style={{container: '!max-w-215'}}
      > 
        <EditProductForm
          productToBeEdited={product}
          closeModal={() => setActiveModal(null)}
        />
      </Modal>

      <ProductInfo
         modal={{
          isActive: activeModal === 'PRODUCT_INFO',
          onCloseActions: () => setActiveModal(null),
        }}
        product={{
          imageUrl: product.imageUrl,
          name: product.name,
          category: category,
          description: product.description ?? '[Sem descrição]',
          price: product.price,
          stock: product.stock,
          publishedAt: product.createdAt,
          updatedAt: product.updatedAt,
          salesCount: product.productSalesCount ?? 0,
        }}
        actions={{
          onImageClick: () => setActiveModal('EXPAND_IMAGE'),
        }}
      />

      <ImageExpand
        modal={{
          isOpen: activeModal === 'EXPAND_IMAGE',
          onCloseActions: () => setActiveModal('PRODUCT_INFO'),
        }}
        product={{
          imageUrl: product.imageUrl,
          name: product.name,
        }}
      />

      <OrderProduct
        activeModal={activeModal}
        selectedProduct={product}
        setActiveModal={setActiveModal} 
      />
    </motion.div>
  )
}

export default Product

