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
import TextArea from '../form/TextArea';
import Error from '../ui/Error';

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
    removeJustify,
    datePutToSale,
    editJustify,
    productToBeEdited,
    imageFile,
    setImageFile,
    fileInputRef,
    preview,
    setPreview,
    imageError,
    handleEditProduct,
    setImageError,
    setEditJustify,
    setProductToBeEdited,
    handleRemoveProduct,
    setRemoveJustify,
    setActiveModal,
    setLoading,
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

      
      <Modal 
      isOpen={activeModal === 'EDIT_JUSTIFY'} 
      modalTitle={'Justificativa de edição'} 
      onCloseModalActions={() => {
        setActiveModal('EDIT_PRODUCT');         
      }}>
        <p className='text-secondary-dark'>
          Escreva uma breve justificativa do porquê dessa edição para o vendedor.
        </p>
        <TextArea 
          style={{container: 'mb-[-8px]', input: error ? 'shadow-[0px_0px_8px_red]' : ''}}
          placeholder={'Justificativa'}
          onChange={(e) => {
            setEditJustify(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
        <div className='flex gap-3 mt-2'>
          <Button 
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            type={'button'}
            label='Editar'
            loadingLabel='Processando'
            loading={loading}
            onClick={() => {
              if (!editJustify) {
                setError('A justificativa da edição não pode ser vazia');
                return;
              }
              handleEditProduct();
            }}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'button'}
            label='Voltar'
            onClick={() => {
              setActiveModal('EDIT_PRODUCT');
              setError('');
              setEditJustify('');
            }}
          />
        </div>
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

