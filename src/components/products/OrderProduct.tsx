"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { productCardSetup } from '@/src/constants/cardConfigs';
import { buttonColorsScheme, textColors } from '@/src/constants/systemColorsPallet';
import MoreActions from '../modal/MoreActions';
import { startTransition, useMemo, useState } from 'react';
import { CATEGORY_LABEL_MAP, OrderFilterValue } from '@/src/constants/generalConfigs';
import { ProductWithOrdersDTO } from '@/src/types/ProductWithOrdersDTO';
import { formatCurrency } from '@/src/utils/formatCurrency';
import Modal from '../modal/Modal';
import TextArea from '../form/TextArea';
import Error from '../ui/Error';
import { useToast } from '@/src/contexts/ToastContext';
import { acceptRejectProductOrder, removeOrderFromUserOrders, sendMessageAboutCustomerOrderSituation, updatedProductStock } from '@/src/actions/productActions';
import { motion } from 'framer-motion';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import { editOrderRejectionJustify as editRejectionJustify } from '@/src/actions/productActions';
import Input from '../form/Input';
import OrderSituationTopTag from '../ui/OrderSituationTopTag';
import OrderRequestDate from '../ui/OrderRequestDate';
import OrderRequestBy from '../ui/OrderRequestBy';
import OrderRequestQuantity from '../ui/OrderRequestQuantity';
import StockIfAccpeted from '../ui/StockIfAccpeted';
import OrderCommission from '../ui/OrderCommission';
import MoreActionsChevronButton from '../ui/MoreActionsChevronButton';
import OrderSituationBottomTag from '../ui/OrderSituationBottomTag';
import { getProductOrdersStats } from '@/src/utils/filters/productOrdersStats';
import Select from '../form/Select';
import Search from '../form/Search';
import { filterOrders } from '@/src/utils/filters/filteredOrdersFromEachProduct';

type Props = {
  product: ProductWithOrdersDTO;
}

const OrderProduct = ({product}:Props) => {

  const { showToast } = useToast()

  const userRole = useUserStore((stats) => stats.user?.role);

  const ordersStats = useMemo(
    () => getProductOrdersStats(product),
    [product.orders]
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const selectedOrder = product.orders.find(
    o => o.orderId === selectedOrderId
  );

  const [moreActionsOrderId, setMoreActionsOrderId] = useState<number | null>(null);
  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const stockIfOrderAccepted = (product.stock - (selectedOrder?.orderedAmount ?? 0)); 
  const category = CATEGORY_LABEL_MAP[product.category];

  const router = useRouter();

  const [acceptanceOrderConfirm, showAcceptanceOrderConfirm] = useState<boolean>(false);
  const [rejectionJustifyConfirm, showRejectionJustifyConfirm] = useState<boolean>(false);
  const [orderRejectionJustify, showOrderRejectionJustify] = useState<boolean>(false);
  const [editOrderRejectionJustify, showEditOrderRejectionJustify] = useState<boolean>(false);
  const [productOuttaStockMessage, showProductOuttaStockMessage] = useState<boolean>(false);
  const [newOrderRejectionJustifyCorfirm, showNewOrderRejectionJustifyCorfirm] = useState<boolean>(false);
  const [resetProductStock, showResetProductStock] = useState<boolean>(false);
  const [ordersFromProduct, showOrdersFromProduct] = useState<boolean>(false);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [removeOrder, showRemoveOrder] = useState<boolean>(false);


  const [loading, setLoading] = useState<{
    rejecting: boolean;
    sending: boolean;
    accepting: boolean;
    removing: boolean;
    editing: boolean;
    reseting: boolean;
  }>({
    rejecting: false,
    accepting: false,
    sending: false,
    removing: false,
    editing: false,
    reseting: false,
  });

  const [error, setError] = useState<string>('');
  const [newOrderRejectionJustify, setNewOrderRejectionJustify] = useState<string | null>(selectedOrder?.orderRejectionJustify ?? '')
  const [rejectionJustify, setRejectionJustify] = useState<string>('');
  const [messageAboutCustomerOrderSituation, setMessageAboutCustomerOrderSituation] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderFilterValue | null>(null);
  const [newProductStock, setNewProductStock] = useState<number>(0);

  const filteredOrders = useMemo(() => 
    filterOrders(
      product.orders,
      orderSearch,
      orderFilter
    ),[product.orders, orderSearch, orderFilter]
  );

  const selectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setMoreActionsOrderId(prev =>
      prev === orderId ? null : orderId
    );
  };

  const handleAcceptOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.accepting) return;
    setLoading(prev => ({...prev, accepting: true}));

    try {
      await acceptRejectProductOrder(
        'APPROVED',
        selectedOrder.orderId,
        product.id,
        selectedOrder.orderedAmount,
      );

      showToast('Pedido aprovado com sucesso');
      showAcceptanceOrderConfirm(false);
    } catch(err:unknown) {
      showToast('Erro inesperado:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, accepting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

  const handleRejectOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (!rejectionJustify) {
      setError('A justificativa de rejeição é obrigatória');
      setLoading(prev => ({...prev, rejecting: false}));
      return;
    } 
    
    if (loading.rejecting)return;
    setLoading(prev => ({...prev, rejecting: true}));

    try {
      await acceptRejectProductOrder(
        'REJECTED',
        selectedOrder.orderId,
        product.id,
        selectedOrder.orderedAmount,
        rejectionJustify
      );

      showToast('Pedido rejeitado com sucesso');
      showRejectionJustifyConfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, rejecting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

  const handleRemoveOrder = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.removing || !userRole) return;
    setLoading(prev => ({...prev, removing: true}));

    try {
      await removeOrderFromUserOrders(
        selectedOrder.orderId,
        selectedOrder.orderStatus,
        userRole,
      );

      startTransition(() => {
        router.refresh(); 
      });

      showToast('Pedido removido com sucesso', 'success');
      showRemoveOrder(false);
    
    } catch (err: unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, removing: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  };

  const handleEditOrderRejectionJustify = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.editing) return;
    setLoading(prev => ({...prev, editing: true}));

    try {
      await editRejectionJustify(
        newOrderRejectionJustify ?? '',
        selectedOrder.orderId,
      );

      showToast('Justificativa de rejeição do pedido editada com sucesso', 'success');
      showNewOrderRejectionJustifyCorfirm(false);
    } catch (err:unknown) {
      showToast('Houve um erro:' + err, 'error');
    } finally {
      setLoading(prev => ({...prev, editing: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

  const handleSendMessageAboutCustomerOrderSituation = async() => {
    if (!selectedOrder) {
      showToast('Pedido inválido ou não selecionado', 'error');
      return;
    }

    if (loading.sending) return;
    setLoading(prev => ({...prev, sending: true}));

    try {
      await sendMessageAboutCustomerOrderSituation(
        selectedOrder.orderId,
        selectedOrder.orderStatus,
        messageAboutCustomerOrderSituation,
      );

      showToast('Mensagem mandada com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      showProductOuttaStockMessage(false);
      setLoading(prev => ({...prev, sending: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

  const handleUpdateProductStock = async() => {
    if (loading.reseting) return;
    setLoading(prev => ({...prev, reseting: true}));

    try { 
      await updatedProductStock(
        product.id,
        newProductStock,
      );

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Houve um erro: ' + err, 'error');
    } finally {
      showResetProductStock(false);
      setLoading(prev => ({...prev, reseting: false}));
      setMoreActionsOrderId(null);
      showOrdersFromProduct(true);
    }
  }

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
          onClick={() => setMoreActionsOrderId(null)}
        />
      </div>
      <div className={productCardSetup.infosContainer}>
        <div onClick={() => setMoreActionsOrderId(null)}>
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
            <div className='flex flex-col'>
              <span className='text-gray flex gap-1'>
                <span className='text-green'>Aprovados:</span> 
                {ordersStats.approved}
              </span>
              <span className='text-gray flex gap-1'>
                <span className='text-yellow-dark'>Pendentes:</span> 
                {ordersStats.pending}
              </span>
              <span className='text-gray flex gap-1'>
                <span className='text-red'>Cancelados:</span> 
                {ordersStats.canceled}
              </span>
              <span className='text-gray flex gap-1'>
                <span className='text-red'>Rejeitados:</span> 
                {ordersStats.rejected}
              </span>
              <span className='text-gray flex gap-1'>
                <span  className='text-red'>Não pagos:</span> 
                {ordersStats.notPaid}
              </span>
              <span className='text-gray text-xl flex gap-1 w-fit mt-1 border-gray'>
                <span className='text-ui-stock'>Total:</span> 
                {ordersStats.total}
              </span>
            </div>
          </div>        
          <Button
            type='button'
            label='Ver pedidos'
            colorScheme='primary'
            style='w-full text-xl mt-2'
            onClick={() => showOrdersFromProduct(true)}
          />        
        </div>       
      </div>
      
      {/* ================================================== */}
      {/* ================== ⇊ MODALS ⇊ =================== */}
      {/* ================================================== */}

      <Modal 
      isOpen={acceptanceOrderConfirm} 
      modalTitle={'Confirmar ação'}
      onCloseModalActions={() => {
        showAcceptanceOrderConfirm(false);
      }}
      >
        <p className={`${textColors.secondaryMiddleDark}`}>
          Tem certeza que aprova o pedido do cliente <span className='text-cyan'>{selectedOrder?.orderCustomerName}</span> de <span className='text-ui-stock'>{selectedOrder?.orderedAmount}</span> {selectedOrder?.orderedAmount ?? 1 > 1 
            ? 'unidades' 
            : 'unidade'
          } desse produto pela comissão de <span className='text-ui-money'>{formatCurrency(selectedOrder?.orderComission ?? 0)}</span> ?
        </p>
        <span className='text-yellow-dark'>
          (!) Essa ação é irreversível
        </span>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            onClick={handleAcceptOrder}
            loading={loading.accepting}
            loadingLabel='Processando'
            spinnerColor='text-green'
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => {
              showAcceptanceOrderConfirm(loading.accepting ? true : false);
              showOrdersFromProduct(true);
              setMoreActionsOrderId(null);
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={rejectionJustifyConfirm} 
      modalTitle={'Confirmar ação'}
      onCloseModalActions={() => {
        showRejectionJustifyConfirm(false);
        setError('');
      }}
      >
        <p className={`${textColors.secondaryMiddleDark}`}>
          Tem certeza que rejeita o pedido do cliente <span className='text-cyan'>{selectedOrder?.orderCustomerName}</span> de <span className='text-ui-stock'>{selectedOrder?.orderedAmount}</span> {selectedOrder?.orderedAmount ?? 1 > 1 
            ? 'unidades' 
            : 'unidade'
          } desse produto pela comissão de <span className='text-ui-money'>{formatCurrency(selectedOrder?.orderComission ?? 0)}</span> ?
        </p>
        <TextArea 
          style={{input: `mb-[-2px] h-30 ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          maxLength={1000}
          placeholder={'Justificativa'}
          label='Justificativa da rejeição'
          onChange={(e) => {
            setRejectionJustify(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
        <span className='text-yellow-dark'>
          (!) Essa ação pode ser revertida depois
        </span>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            loading={loading.rejecting}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={handleRejectOrder}
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => {
              showRejectionJustifyConfirm(false);
              showOrdersFromProduct(true);
              setMoreActionsOrderId(null);
              setError('');
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={removeOrder} 
      modalTitle={'Remover pedido do cliente'} 
      onCloseModalActions={() => {
        showRemoveOrder(false);
        showOrdersFromProduct(true);
      }}> 
        <p className='text-secondary-middledark'>
          Tem certeza que deseja remover esse pedido do cliente <span className='text-cyan'>{selectedOrder?.orderCustomerName}</span> do seu histórico de pedidos?
        </p>
        <p className='text-yellow-dark'>
          (!) Essa ação é irreversível
        </p>
        <div className='flex gap-4'>
          <Button 
            style={`flex-1 ${buttonColorsScheme.green}`} 
            type={'submit'}
            label='Sim'
            loading={loading.removing}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={handleRemoveOrder}
          />
          <Button 
            style={`flex-1 ${buttonColorsScheme.red}`}
            type={'submit'}
            label='Não'     
            onClick={() => {
              showRemoveOrder(false);
              setMoreActionsOrderId(null);
              showOrdersFromProduct(true);
            }}    
          />
        </div>
      </Modal>

      <Modal 
      isOpen={orderRejectionJustify} 
      modalTitle={'Sua justificativa de rejeição'} 
      onCloseModalActions={() => {
        showOrderRejectionJustify(false);
        showEditOrderRejectionJustify(false);
        setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
        setError('');
      }}
      >
      {editOrderRejectionJustify ? (
        <>
        <TextArea 
          placeholder={'Justificativa'}
          style={{input: 'mb-[-3px]'}}
          label='Justificativa'
          colorScheme='primary'
          value={newOrderRejectionJustify ?? ''}
          onChange={(e) => {
            setNewOrderRejectionJustify(e.target.value);
            setError('');
          }}
          onBlur={() => {
            if (newOrderRejectionJustify?.trim() === '') {
              setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
            }
          }}
        />
        {error && <Error error={error}/>}
        </>
      ) : (
        <div>
          <label className='text-secondary-dark'>Justificativa:</label>
          <p className='text-primary-middledark bg-primary-ultralight/20 p-1 pl-2 rounded-md'>{selectedOrder?.orderRejectionJustify}</p>
        </div>
      )}
       
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
            label='Editar'
            loading={loading.rejecting}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={() => {
              if (editOrderRejectionJustify) {
                if (newOrderRejectionJustify === selectedOrder?.orderRejectionJustify) {
                  setError('Nenhum caractere foi alterado para ser editado');
                  return;
                } else {
                  showNewOrderRejectionJustifyCorfirm(true);
                  showOrderRejectionJustify(false);
                }
              } else {
                showEditOrderRejectionJustify(true);              
              }
            }}
          />
          <Button
            style={`px-5 ${editOrderRejectionJustify ? buttonColorsScheme.red + 'flex-1' : 'flex-3'} text-xl`}
            onClick={() => {
              if (editOrderRejectionJustify) {
                showEditOrderRejectionJustify(false);
                setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
                setError('');
              } else {
                showOrderRejectionJustify(false);
                setNewOrderRejectionJustify(selectedOrder?.orderRejectionJustify ?? '');
                showOrdersFromProduct(true);
              }
            }}
            label={editOrderRejectionJustify ? 'Cancelar' : 'Voltar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={productOuttaStockMessage} 
      modalTitle={'Justificar ao cliente'} 
      onCloseModalActions={() => {
        showProductOuttaStockMessage(false);
        setError('');
      }}
      >
        <p className='text-secondary-dark'>
          Deixe para o cliente uma justificativa a cerca da situação atual de seu pedido.
        </p>
        <TextArea 
          placeholder={'Justificativa'}
          style={{input: `mb-[-3px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          label='Justificativa'
          colorScheme='primary'
          value={messageAboutCustomerOrderSituation}
          onChange={(e) => {
            setMessageAboutCustomerOrderSituation(e.target.value);
            setError('');
          }}
        />
        {error && <Error error={error}/>}
   
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.yellow}`} 
            label='Mandar'
            loading={loading.sending}
            spinnerColor='text-yellow-dark'
            loadingLabel='Processando'
            onClick={() => {
              if (!messageAboutCustomerOrderSituation) {
                setError('Não se pode mandar uma mensagem vazia');
                return;
              } else {
                handleSendMessageAboutCustomerOrderSituation();
              }
            }}
          />
          <Button
            style={`px-5 flex-1 text-xl`}
            onClick={() => {
              showProductOuttaStockMessage(false);
              showOrdersFromProduct(true);
              setError('');
            }}
            label={'Cancelar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={resetProductStock} 
      modalTitle={'Repor estoque'} 
      onCloseModalActions={() => {
        showResetProductStock(false);
        setError('');
      }}
      >
        <p className='text-secondary-dark'>
          Selecione a quantidade a ser reposta do estoque do produto pedido.
        </p>
        <Input 
          placeholder={'Quantidade'} 
          type={'number'}
          style={{input: `mb-[-5px] ${error ? 'shadow-[0px_0px_5px_red]' : ''}`}}
          onChange={(e) => {
            setNewProductStock(Number(e.target.value));
            setError('');
          }}
        />
        {error && <Error error={error}/>}
   
        <div className='flex gap-2 mt-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl`} 
            label='Repor'
            colorScheme='primary'
            loading={loading.reseting}
            loadingLabel='Processando'
            onClick={() => {
              if (newProductStock <= 0) {
                setError('Não se pode repor com um valor menor ou igual a zero');
                return;
              } else {
                handleUpdateProductStock();
              }
            }}
          />
          <Button
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`}
            onClick={() => {
              showResetProductStock(false);
            }}
            label={'Cancelar'}
            type='button'
          />
        </div>
      </Modal>

      <Modal 
      isOpen={newOrderRejectionJustifyCorfirm} 
      modalTitle={'Confirmar ação'} 
      onCloseModalActions={() => {
        showNewOrderRejectionJustifyCorfirm(false);
        showOrderRejectionJustify(true);
      }}>
        <p className='text-secondary-middledark'> 
          Tem certeza que deseja alterar sua justificativa de rejeição atual desse pedido ?
        </p>
        <div className='flex gap-2'>
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
            label='Sim'
            loading={loading.editing}
            spinnerColor='text-green'
            loadingLabel='Processando'
            onClick={handleEditOrderRejectionJustify}
          />
          <Button 
            type='button'
            style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
            label='Não'
            onClick={() => {
              showNewOrderRejectionJustifyCorfirm(false);
              setMoreActionsOrderId(null);
              showOrdersFromProduct(true);
              showOrderRejectionJustify(true);
            }}
          />
        </div>
      </Modal>

      <Modal 
      isOpen={ordersFromProduct} 
      modalTitle={'Pedidos do produto'} 
      hasXClose
      onCloseModalActions={() => {
        showOrdersFromProduct(false);
      }}
      >
        <div className='flex h-full max-h-[80vh]'>
          <div className='flex flex-col rounded-b-2xl gap-3 pr-2 flex-1 overflow-y-auto w-full
          hover:scrollbar-thumb-secondary-light
          scrollbar-thumb-secondary-middledark 
            scrollbar-track-transparent
            hover:scrollbar-track-transparent
            scrollbar-active-track-transparent
            scrollbar-active-thumb-primary-light
            scrollbar-thin
          '>
            <div className='relative aspect-square'>
              <Image
                src={product.imageUrl}
                fill
                alt={product.name}
                className='rounded-xl border border-primary-middledark object-cover cursor-zoom-in hover:opacity-80 transition duration-200'
                onClick={() => {
                  setExpandImage(true);
                  showOrdersFromProduct(false);
              }}
              />
            </div>
            <div className='flex bg-primary-ultralight/25 p-2 border border-primary-middledark rounded-2xl flex-col gap-1.5 flex-2'>
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
                <span className='h-30 overflow-y-auto text-secondary-dark flex-col  
                hover:scrollbar-thumb-primary-light
                scrollbar-thumb-primary-middledark 
                  scrollbar-track-transparent
                  hover:scrollbar-track-transparent
                  scrollbar-active-track-transparent
                  scrollbar-active-thumb-primary-light
                  scrollbar-thin
                  '>
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
          <div className='flex flex-col gap-1 overflow-y-auto flex-2 pr-2
          hover:scrollbar-thumb-primary-light
          scrollbar-thumb-primary-middledark 
            scrollbar-track-transparent
            hover:scrollbar-track-transparent
            scrollbar-active-track-transparent
            scrollbar-active-thumb-primary-light
            scrollbar-thin
          '>
          <div className="flex items-center gap-3 pl-2 mb-2 mt-3">
            <Search
              style={{ input: 'py-1 w-full flex-1' }}
              colorScheme="primary"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              onClearSearch={() => setOrderSearch('')}
            />
            <Select
              style={{ input: 'flex-1 w-full', container: 'flex-1' }}
              selectSetup="ORDER_FILTER"
              colorScheme="primary"
              label="Filtro"
              value={orderFilter ?? ''}
              onChange={(e) => setOrderFilter(e.target.value as OrderFilterValue)}
            />
          </div>
          {filteredOrders.map((order) => (
            <>
            <div className='flex bg-secondary-light/25 p-2 ml-2 rounded-2xl border border-secondary-middledark'>
              <div>
                <h3 className='text-primary-middledark italic'>
                  Pedido #{order.orderId}
                </h3>
                <OrderRequestDate
                  orderDate={new Date(order.orderCreatedAt).toLocaleDateString("pt-BR")}
                />
                <OrderRequestBy
                  customerName={order.orderCustomerName ?? '[desconhecido]'}
                />
                <div>
                  <OrderRequestQuantity
                    orderQuantity={order.orderedAmount}
                  />
                  {(order.orderStatus !== 'CANCELED'
                    && order.orderStatus !== 'APPROVED'
                    && order.orderStatus !== 'REJECTED')
                    && (
                    <StockIfAccpeted
                      stockIfOrderAccepted={stockIfOrderAccepted}
                    />
                  )}
                </div>
                <OrderCommission
                  orderCommission={order.orderComission}
                />
              </div>
              <div className='flex-1 relative'>
                {order.orderPaymentStatus === 'PENDING' && order.orderStatus !== 'CANCELED' ? (
                  <OrderSituationTopTag situation='Pagamento pendente'/>
                ) : order.orderStatus === 'CANCELED' ? (
                  <OrderSituationTopTag situation='Cancelado pelo cliente'/>
                ) : order.orderStatus !== 'PENDING' ? (
                  <OrderSituationTopTag situation='Analisado'/>
                ) : (
                  <OrderSituationTopTag situation='Não analisado'/>
                )}
                <div className='flex absolute bottom-0 right-0 gap-2'>
                  {order.orderStatus === 'APPROVED' ? (
                    <div className='flex gap-5'>
                      <OrderSituationBottomTag
                        situation={'Aprovado'}
                      />
                      <MoreActionsChevronButton
                        onClick={() => selectOrder(order.orderId)}
                        moreActions={moreActionsOrderId === order.orderId}
                      />
                    </div>
                  ) : (order.orderStatus === 'CANCELED') ? (
                    <>
                    <OrderSituationBottomTag
                      situation={'Cancelado'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => selectOrder(order.orderId)}
                      moreActions={moreActionsOrderId === order.orderId}
                    />
                    </>
                  ) : (order.orderStatus === 'REJECTED') ? ( 
                    <>
                    <OrderSituationBottomTag
                      situation={'Rejeitado'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => selectOrder(order.orderId)}
                      moreActions={moreActionsOrderId === order.orderId}
                    />
                    </>
                  ) :  order.orderPaymentStatus === 'APPROVED' 
                    && order.orderStatus === 'PENDING' 
                    && !order.orderDeletedByCustomer 
                    && stockIfOrderAccepted >= 0 
                    ? (
                    <>
                    <Button
                      type='button'
                      style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`}
                      label='Aceitar'
                      onClick={() => {
                        showAcceptanceOrderConfirm(true);
                        showOrdersFromProduct(false);
                        selectOrder(order.orderId);
                      }}
                    />
                    <Button
                      type='button'
                      style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`}
                      label='Rejeitar'
                      onClick={() => {
                        showRejectionJustifyConfirm(true);
                        showOrdersFromProduct(false);
                        selectOrder(order.orderId);
                      }}
                    />
                    </>
                  ) : order.orderPaymentStatus === 'APPROVED' 
                    && order.orderStatus === 'PENDING' 
                    && !order.orderDeletedByCustomer 
                    && stockIfOrderAccepted < 0  
                    ? (
                    <>
                    <OrderSituationBottomTag
                      situation={'Estoque insuficiente'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => selectOrder(order.orderId)}
                      moreActions={moreActionsOrderId === order.orderId}
                    />
                    </>
                  ) : (order.orderPaymentStatus !== 'APPROVED') && (
                    <>
                    <OrderSituationBottomTag
                      situation={'Pendente'}
                    />
                    <MoreActionsChevronButton
                      onClick={() => selectOrder(order.orderId)}
                      moreActions={moreActionsOrderId === order.orderId}
                    />
                    </>
                  )}
                </div>
              </div>
            </div>
            <MoreActions
            direction="right"
            style={{ container: 'mt-[-5px]' }}
            moreActions={moreActionsOrderId === order.orderId}
            close={() => setMoreActionsOrderId(null)}
            >
            {order.orderStatus !== 'CANCELED' && order.orderStatus === 'PENDING' ? (
              <>
              {stockIfOrderAccepted < 0 && (
                <>
                <Button 
                  type='button'
                  label="Repor estoque" 
                  style={`px-5 ${buttonColorsScheme.secondary}`}
                  onClick={() => showResetProductStock(true)}
                />
                <Button 
                  type='button'
                  label="Justificar ao cliente" 
                  style={`px-5 ${buttonColorsScheme.yellow}`}
                  onClick={() => showProductOuttaStockMessage(true)}
                />
                </>
              )}
              <Button 
                type='button'
                label="Rejeitar pedido" 
                style={`px-5 ${buttonColorsScheme.red}`}
                onClick={() => {
                  showRejectionJustifyConfirm(true);
                  showOrdersFromProduct(false);
                }}
              />
              </>
            ) : ( order.orderStatus === 'REJECTED') ? (
              <>
              <Button 
                type='button'
                label="Remover do histórico" 
                style={`px-5 ${buttonColorsScheme.red}`}
                onClick={() => {
                  showRemoveOrder(true);
                  showOrdersFromProduct(false);
                }}
              />
              <Button 
                type='button'
                label="Ver sua justificativa" 
                style={`px-5 ${buttonColorsScheme.yellow}`}
                onClick={() => {
                  showOrderRejectionJustify(true);
                  showOrdersFromProduct(false);
                }}
              />
              {order.orderPaymentStatus === 'APPROVED' && (
                <Button 
                  type='button'
                  label="Aprovar pedido" 
                  style={`px-5 ${buttonColorsScheme.green}`}
                  onClick={() => showAcceptanceOrderConfirm(true)}
                />
              )}
              </>
            ) : (
              <Button 
                type='button'
                label="Remover do histórico" 
                style={`px-5 ${buttonColorsScheme.red}`}
                onClick={() => {
                  showRemoveOrder(true);
                  showOrdersFromProduct(false);
                }}
              />
            )}
            </MoreActions>
            </>
          ))}
          </div>
        </div>
      </Modal>

      <Modal 
      isOpen={expandImage} 
      modalTitle={''} 
      onCloseModalActions={() => {
        setExpandImage(false);
        showOrdersFromProduct(true);
      }}>
        <div className='relative aspect-square h-[90vh]'>
          <Image 
            src={product.imageUrl} 
            alt={product.name}            
            fill
            className='object-contain aspect-square border-x-4 border-double cursor-zoom-out border-primary'
            onClick={() => {
              setExpandImage(false);
              showOrdersFromProduct(true);
            }}
          />
        </div>
      </Modal>
    </motion.div>
  )
}

export default OrderProduct;

