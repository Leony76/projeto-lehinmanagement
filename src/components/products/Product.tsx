'use client';

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/styles/Product/productCard.style';
import { ProductDTO } from '@/src/types/productDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import Modal from '../modal/Modal';
import EditProductForm from '../form/EditProductForm';
import OrderProduct from '../modal/OrderProduct';
import { FaInfo } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import ProductInfo from '../modal/Product/ProductInfo';
import ImageExpand from '../modal/ImageExpand';
import RemoveProductJustify from '../modal/Product/RemoveProductJustify';
import ConfirmRemove from '../modal/Product/ConfirmRemove';
import { productCardStyles as styles } from '@/src/styles/Product/productCard.style';
import { useProductLogic } from '@/src/hooks/pageLogic/useProductLogic';

type Props = {
  product: ProductDTO;
}

const Product = ({
  product,
}:Props) => { 

  const {
    user,
    error,
    loading,
    canOrder,
    category,
    available,
    activeModal,
    datePutToSale,
    handleRemoveProduct,
    setRemoveJustify,
    setActiveModal,
    setError,
  } = useProductLogic({ product });

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={styles.mainContentContainer}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
      <div className={styles.imageContainer}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.productInfosContainer}>
        <h3 className={styles.name}>
          {product.name}
        </h3>
        <div className={styles.category_date_ratingContainer}>
          <div className={styles.category_date}>
            <span>{category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{datePutToSale}</span>
          </div>
          <div className={styles.rating}>
            {!product.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
            }
            {product.productAverageRating ?? 'Não avaliado'}
          </div>
        {(product.sellerRole !== 'ADMIN') ? (       
          <div className={styles.sellerContainer}>
            <span className={styles.label}>
              Vendedor(a):
            </span> 
            {product.sellerName === user?.name
              ? getNameAndSurname(product.sellerName) + ' (Você)'
              : getNameAndSurname(product.sellerName)
            }
          </div>
        ) : (
          <div className={styles.label}> 
            Ofertado pelo sistema
          </div>
        )}
        </div>
        <div className={styles.price_stockContainer}>
          {product.stock > 0 ? (
            <span className={styles.stock.withStock}>
              <span className={productCardSetup.stockLabel}>
                Em estoque:
              </span> 
              {product.stock}
            </span>
          ) : (
            <span className={styles.stock.withoutStock}>
              Sem estoque
            </span> 
          )}
          <div className={styles.price_productInfoContainer}>
            <span className={styles.price}>
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
        loading={loading}
        modal={{
          isOpen: activeModal === 'CONFIRM_REMOVE_PRODUCT',
          onCloseActions: () => setActiveModal(null),
        }}
        user={{ role: user?.role }}
        onClick={{
          yes: () => {
            if (user?.role === 'ADMIN') {
              setActiveModal('REMOVE_PRODUCT_JUSTIFY');
              return;
            }
            handleRemoveProduct();
          },
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
          updatedAt: product.updatedAt ?? 'Sem atualização',
          salesCount: product.productSalesCount ?? 0,
          rating: product.productAverageRating ?? 'Não avaliado',
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
        image={{
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

