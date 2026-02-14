'use client';

import { motion } from 'framer-motion';
import { FaInfo } from 'react-icons/fa6';
import { ProductDTO } from '@/src/types/productDTO';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import { useProductLogic } from '@/src/hooks/pageLogic/useProductLogic';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { productCardSetup } from '@/src/styles/Product/productCard.style';

import { productCardStyles as styles } from '@/src/styles/Product/productCard.style';

import RemoveProductJustify from '../modal/Product/RemoveProductJustify';
import EditProductJustify from '../modal/Product/EditProductJustify';
import ConfirmRemove from '../modal/Product/ConfirmRemove';
import ProductInfo from '../modal/Product/ProductInfo';
import EditProductForm from '../form/EditProductForm';
import OrderProduct from '../modal/OrderProduct';
import ImageExpand from '../modal/ImageExpand';
import Button from '../form/Button';
import Image from 'next/image'

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
    preview,
    canOrder,
    category,
    available,
    imageFile,
    imageError,
    activeModal,
    editJustify,
    fileInputRef,
    datePutToSale,
    productToBeEdited,
    setProductToBeEdited,
    handleRemoveProduct,
    handleEditProduct,
    setRemoveJustify,
    setEditJustify,
    setActiveModal,
    setImageError,
    setImageFile,
    setFormData, 
    setPreview,
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
          <div className={'text-cyan'}> 
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
            onClick={() => {
              setActiveModal('EDIT_PRODUCT');
              setProductToBeEdited(product);
            }}
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
        misc={{ error, loading }}
      />
    
      <EditProductForm
        isOpen={activeModal === 'EDIT_PRODUCT'}
        productToBeEdited={productToBeEdited}
        onCloseActions={() => {
          setActiveModal(null)
          setProductToBeEdited(null);
          setPreview(null);
        }}
        actions={{
          handleEditProduct,
          setActiveModal,
          setFormData,
        }}
        imageProps={{
          imageFile,
          fileInputRef,
          preview,
          imageError,
          setImageFile,
          setPreview,
          setImageError,
        }}
      />

      <EditProductJustify
        modal={{
          isOpen: activeModal === 'EDIT_JUSTIFY',
          onCloseActions: () => setActiveModal('EDIT_PRODUCT'),
        }}
        edit={{
          onChange: { textArea: (e) => {
            setEditJustify(e.target.value);
            setError('');
          }},
          onClick: {
            toBack: () => {
              setActiveModal('EDIT_PRODUCT');
              setError('');
              setEditJustify('');
            },
            toEdit: () => {
              if (!editJustify) {
                setError('A justificativa da edição não pode ser vazia');
                return;
              }
              handleEditProduct();
            }
          }
        }}
        misc={{ error, loading }}
      />

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

