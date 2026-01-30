'use client';

import Image from 'next/image'
import { IoStar } from 'react-icons/io5';
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
  const [removeProductJustify, showRemoveProductJustify] = useState<boolean>(false);

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

      setProducts((prev) => prev.filter((p) => p.id !== product.id));

      setRemoveJustify('');
      showToast('Produto removido com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao remover produto', 'error');
    }
  };

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
          <span className={productCardSetup.price}>
            {formatCurrency(product.price)}
          </span>
        </div>
      {(canOrder && product.stock > 0) ? (
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
          setProducts={setProducts}
          closeModal={() => showEditProduct(false)}
        />
      </Modal>
    </div>
  )
}

export default Product

