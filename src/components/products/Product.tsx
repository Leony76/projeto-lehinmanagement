'use client';

import Image from 'next/image'
import { IoStar } from 'react-icons/io5';
import Button from '../form/Button';
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { ProductDTO } from '@/src/types/form/product';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useUserStore } from '@/src/store/useUserStore';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';
import { removeProduct } from '@/src/actions/product';
import { SetStateAction, useState } from 'react';
import Modal from '../modal/Modal';
import { useToast } from '@/src/contexts/ToastContext';
import EditProductForm from '../form/EditProductForm';

type Props = {
  product: ProductDTO;
  setProducts: React.Dispatch<React.SetStateAction<ProductDTO[]>>;
  showOrderProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: React.Dispatch<React.SetStateAction<ProductDTO | null>>;
}

const Product = ({
  product,
  setProducts,
  showOrderProductModal,
  selectedProduct
}:Props) => {

  const { showToast } = useToast();

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [confirmRemoveProduct, showConfirmRemoveProduct] = useState<boolean>(false);
  const [editProduct, showEditProduct] = useState<boolean>(false);

  const user = useUserStore((stats) => stats.user);

  console.log(user?.role)

  const canOrder = (product.sellerId !== user?.id) && (user?.role !== 'ADMIN');

  return (
    <div className={productCardSetup.mainContainer}>
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
            <span className='xl:block md:hidden block'>Avaliação:</span>
            <IoStar/>{4}
          </div>
          <div className={productCardSetup.seller.container}>
            <span className={productCardSetup.seller.label}>
              Vendedor(a):
            </span> 
            {product.sellerName === user?.name
              ? getNameAndSurname(product.sellerName) + ' (Você)'
              : getNameAndSurname(product.sellerName)
            }
          </div>
        </div>
        <div className={productCardSetup.priceStockContainer}>
          <span className={productCardSetup.stock}><span className={productCardSetup.stockLabel}>Em estoque:</span> {product.stock}</span>
          <span className={productCardSetup.price}>{formatCurrency(product.price)}</span>
        </div>
      {(canOrder) ? (
        <Button
          style='text-xl' 
          label={"Fazer pedido"}
          colorScheme={'primary'}
          onClick={() => {
            showOrderProductModal(true)
            selectedProduct(product)
          }}
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
      openedModal={showConfirmRemoveProduct}
      >
        <p className={textColors.secondaryDark}>Tem certeza que deseja tirar esse produto de venda ?</p>
        <p className={textColors.secondaryMiddleDark}>Caso o queira à venda novamente depois, basta o pôr na aba 'Produtos removidos'.</p>
        <p className='text-sm text-yellow-dark'>*Clientes que tivem pedidos pendentes do mesmo serão automaticamente reembolsados caso tiverem já tenham pago pelo pedido.</p>
        <div className='flex gap-2'>
          <Button 
            type={'button'}
            label='Sim'
            style={`flex-1 ${buttonColorsScheme.green}`}
            onClick={() => {
              showConfirmRemoveProduct(false);
              removeProduct(product.id);
              showToast('Produto removido com sucesso', 'success')
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
      isOpen={editProduct} 
      modalTitle={'Editar produto'}
      openedModal={showEditProduct}
      hasXClose
      style={{container: '!max-w-215'}}
      > 
        <EditProductForm
          productToBeEdited={product}
          setProducts={setProducts}
          closeModal={() => showEditProduct(false)}
        />
      </Modal>
    </div>
  )
}

export default Product

