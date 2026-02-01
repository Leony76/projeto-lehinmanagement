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
import { useState } from 'react';
import Modal from '../modal/Modal';
import { useToast } from '@/src/contexts/ToastContext';
import EditProductForm from '../form/EditProductForm';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import OrderProduct from '../modal/OrderProduct';
import { lockScrollY } from '@/src/utils/lockScrollY';
import { FaInfo } from 'react-icons/fa6';
import { motion } from 'framer-motion';

type Props = {
  product: ProductDTO;
}

const Product = ({
  product,
}:Props) => {

  const { showToast } = useToast();

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [confirmRemoveProduct, showConfirmRemoveProduct] = useState<boolean>(false);
  const [removeProductJustify, showRemoveProductJustify] = useState<boolean>(false);
  const [productInfo, showProductInfo] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [confirmModal, showConfirmModal] = useState(false);

  const [orderProductMenu, showOrderProductMenu] = useState(false);

  const [removeJustify, setRemoveJustify] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [editProduct, showEditProduct] = useState<boolean>(false);

  const user = useUserStore((stats) => stats.user);

  const canOrder = (product.sellerId !== user?.id) && (user?.role !== 'ADMIN');

  const handleRemoveProduct = async() => {
    if (!removeJustify) {
      setError('A justificativa de remoção é obrigatória');
      return;
    }

    try {
      showRemoveProductJustify(false);
      
      await removeProduct(product.id, removeJustify);

      setRemoveJustify('');
      showToast('Produto removido com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao remover produto', 'error');
    }
  };

  lockScrollY(orderProductMenu || confirmModal);

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={`relative ${productCardSetup.mainContainer}`}
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
          className={productCardSetup.image}
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
              onClick={() => showProductInfo(true)}
            />
          </div>
        </div>
      {(canOrder && product.stock > 0) ? (
        <Button
          style='text-xl' 
          label={"Fazer pedido"}
          colorScheme={'primary'}
          onClick={() => {
            showOrderProductMenu(true)
          }}
          type='button'
        />
      ) : (canOrder && product.stock === 0) ? (
        <Button
          style={`text-xl pointer-events-none ${buttonColorsScheme.red}`} 
          label={"Fora do estoque"}
          colorScheme={'primary'}
          type='button'
        />
      ) : (
        <div className='flex gap-2'>
          <Button 
            type={'button'}
            label='Editar'
            style={`flex-1 ${buttonColorsScheme.yellow}`}
            onClick={() => showEditProduct(true)}
          />
          <Button 
            type={'button'}
            label='Remover'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => showConfirmRemoveProduct(true)}
          />
        </div>
      )}
      </div>

      {/* ⇊ MODALS ⇊ */}

      <Modal 
      isOpen={confirmRemoveProduct} 
      modalTitle={'Confirmar remoção'}
      onCloseModalActions={() => {
        showConfirmRemoveProduct(false);
      }}
      >
        <p className={textColors.secondaryDark}>Tem certeza que deseja tirar esse produto de venda ?</p>
        {user?.role !== 'ADMIN' && <p className={textColors.secondaryMiddleDark}>Caso o queira à venda novamente depois, basta o pôr na aba 'Produtos removidos'.</p>}
        <p className='text-sm text-yellow-dark'>*Clientes que tivem pedidos pendentes do mesmo serão automaticamente reembolsados caso tiverem já tenham pago pelo pedido.</p>
        <div className='flex gap-2'>
          <Button 
            type={'button'}
            label='Sim'
            style={`flex-1 ${buttonColorsScheme.green}`}
            onClick={() => {
              showRemoveProductJustify(true);
              showConfirmRemoveProduct(false);
            }}
            />
          <Button 
            type={'button'}
            label='Não'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => showConfirmRemoveProduct(false)}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={removeProductJustify} 
      modalTitle={'Justificativa de remoção'}
      onCloseModalActions={() => {
        showRemoveProductJustify(false);
        showConfirmRemoveProduct(true);
      }}
      >
        <p className={textColors.secondaryDark}>Cite a justificativa para a remoção desse produto ofertado por {product.sellerName}</p>
        <TextArea 
          style={{input: `h-20 mb-[-3px] ${error ? 'shadow-[0px_0px_8px_red]' : ''}`}}
          placeholder='Justificativa...'
          onChange={(e) => {
            setRemoveJustify(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
        <div className='flex gap-2 mt-2'>
          <Button 
            type={'button'}
            label='Confirmar'
            style={`flex-1 ${buttonColorsScheme.green}`}
            onClick={handleRemoveProduct}
          />
          <Button 
            type={'button'}
            label='Cancelar'
            style={`flex-1 ${buttonColorsScheme.red}`}
            onClick={() => showRemoveProductJustify(false)}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={editProduct} 
      modalTitle={'Editar produto'}
      onCloseModalActions={() => {
        showEditProduct(false);
      }}
      hasXClose
      style={{container: '!max-w-215'}}
      > 
        <EditProductForm
          productToBeEdited={product}
          closeModal={() => showEditProduct(false)}
        />
      </Modal>

      <Modal 
      isOpen={productInfo} 
      modalTitle={'Informações'}
      hasXClose 
      onCloseModalActions={() => {
        showProductInfo(false);
      }}
      >
        <div className='flex sm:flex-row h-full sm:max-h-full max-h-[70vh] overflow-y-auto h flex-col gap-5 mt-2'>
          <div className='flex-1 relative aspect-square'>
            <Image 
              src={product.imageUrl} 
              alt={product.name}            
              fill
              className='rounded-2xl object-cover aspect-square cursor-zoom-in'
              onClick={() => {
                setExpandImage(true);
                showProductInfo(false);
              }}
            />
          </div>
          <div className='flex bg-primary-ultralight/25 p-2 rounded-2xl flex-col gap-1.5 flex-2'>
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
                {category}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-primary-middledark font-bold'>
                Descrição
              </label>
              <span className='h-30 overflow-y-auto  
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
            <div className='flex gap-10'>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Preço unitário
                </label>
                <span className='text-secondary-dark'>
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className='flex flex-col '>
                <label className='text-primary-middledark font-bold'>
                  Estoque
                </label>
                <span className='text-secondary-dark'>
                  {product.stock}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
      isOpen={expandImage} 
      modalTitle={''} 
      onCloseModalActions={() => {
        setExpandImage(false);
        showProductInfo(true);
      }}>
        <div className='relative aspect-square h-[90vh]'>
          <Image 
            src={product.imageUrl} 
            alt={product.name}            
            fill
            className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
            onClick={() => {
              setExpandImage(false);
              showProductInfo(true);
            }}
          />
        </div>
      </Modal>

      <OrderProduct
        isOpen={orderProductMenu}
        selectedProduct={product}
        showOrderProductMenu={showOrderProductMenu}
        showConfirmModal={showConfirmModal}
        confirmModal={confirmModal}
      />
    </motion.div>
  )
}

export default Product

