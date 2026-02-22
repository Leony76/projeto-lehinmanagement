import { deleteProduct, rateCommentProduct, reactivateRemovedProduct, removeProduct, updateProduct } from "@/src/actions/productActions";
import { UserProductOrdersFilterValue, CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { UserProductPageModals } from "@/src/types/modal";
import { useState, useEffect, useRef } from "react";
import { useLockScrollY } from "../useLockScrollY";
import { BoughtProduct, FiltrableUserProduct } from "@/src/types/userProductDTO";
import { AddProductFormData } from "@/src/schemas/addProductSchema";
import { ProductDTO } from "@/src/types/productDTO";
import { useUserStore } from "../store/useUserStore";
import { sendMessageToSupport } from "@/src/actions/userActions";
import { UserSituation, SupportMessageType, SupportMessageSentBy } from "@prisma/client";
import { UserAndSupportConversationDTO } from "@/src/types/UserAndSupportConversationDTO";

type Props = {
  userProduct: FiltrableUserProduct;
}

export const useUserProductLogic = ({ userProduct }:Props) => {

  const user = useUserStore((s) => s.user);
  
  const { showToast } = useToast();

  const isFirstRender = useRef(true);

  const isPublished = 'product' in userProduct;
  const productData = isPublished 
    ? userProduct.product 
    : userProduct
  ;

  const [formData, setFormData] = useState<AddProductFormData | null>(null); 
  const [productToBeEdited, setProductToBeEdited] = useState<ProductDTO['product'] | null>(null);
  

  const [activeModal, setActiveModal] = useState<UserProductPageModals | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<UserProductOrdersFilterValue | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState<string>('');

  const userProductForSale = (productData as ProductDTO['product']);

  const initialRating = 'productRating' in userProduct 
    ? userProduct.productRating 
    : (userProduct.product.averageRating ?? 0);

  const dateString = 'publishedAt' in productData 
    ? productData.publishedAt 
    : (userProduct as any).createdAt;

  const [error, setError] = useState<string>('');

  const [productComment, setProductComment] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);  
  const [selectedConversation, setSelectedConversation] = useState<UserAndSupportConversationDTO | null>(null);
  

  const [rating, setRating] = useState<number>(Number(initialRating));

  const datePutToSale = new Date(dateString).toLocaleDateString("pt-BR");

  const category =  CATEGORY_LABEL_MAP[productData.category] ?? 'Categoria não definida';

  useLockScrollY(Boolean(activeModal));

  const handleCommentRatingProduct = async() => {
    if (!rating) return;

    try {
      await rateCommentProduct(
        productData.id,
        rating,
        productComment,
      );

      if (!isPublished) {
        const boughtProduct = userProduct as BoughtProduct;
        
        if (rating !== boughtProduct.productRating) {
          showToast('Produto avaliado', 'info');
        }
      }

      if (productComment) {
        showToast('Seu comentário sobre o produto foi ao ar', 'info');
        setProductComment('');
      }
    } catch (err:unknown) { 
      showToast('Houve um erro: ' + err, 'error');
    } 
  }

  const handleRemoveUserProductFromInventory = async() => {
    if (loading) return;
    setLoading(true);

    try {
      await removeProduct(
        productData.id,
        '',
        'FROM_INVENTORY',
      );

      showToast('Produto removido com sucesso', 'success');
    } catch (err: unknown) {
      showToast('Erro: ' + err, 'error');
    } finally {
      setActiveModal(null);
      setLoading(false);
    }
  }

  const handleRemoveUserProductForSale = async() => {
    if (loading) return;
    setLoading(true);

    try {
      await removeProduct(
        productData.id, 
        '',
        'FOR_SALE',
      );

      showToast('Produto removido com sucesso', 'success');
    } catch (err: unknown) {
      showToast('Erro: ' + err, 'error');
    } finally {
      setActiveModal(null);
      setLoading(false);
    }
  }

  const handleEditProduct = async (): Promise<void> => {
  
    if (loading) return;

    const dataToSave = formData;

    setLoading(true);

    try {
      if (!productToBeEdited) throw new Error('Nenhum produto selecionado para edição')

      let imageUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } 

      const payload = {
        id: productToBeEdited.id,
        name: dataToSave?.name ,
        category: dataToSave?.category,
        description: dataToSave?.description,
        price: Number(dataToSave?.price),
        stock: Number(dataToSave?.stock),
        imageUrl: imageUrl || productToBeEdited.imageUrl,
      };

      await updateProduct(payload);
    
      showToast(`Produto editado com sucesso`, 'success');
    } catch (err:unknown) {
      showToast("Ocorreu um erro: " + err, 'error');
    } finally {
      setLoading(false);
      setActiveModal(null);
      setFormData(null);
    }

  }

  const handleSendMessageToSupport = async(): Promise<void> => {
    if (loading) return;
    setLoading(true);

    const userData = {
      id: user?.id ?? '',
      situation: user?.isActive
        ? "ACTIVATED" 
        : "DEACTIVATED" as UserSituation
    };

    const data = {
      message: supportMessage,
      type: 'APPEAL' as SupportMessageType,
      sentBy: 'USER' as SupportMessageSentBy,
    }

    try {
      await sendMessageToSupport(
        userData,
        data,    
        productData.id,    
      );

      showToast('Seu apelo foi enviado ao suporte', 'info');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal(null);
      setSupportMessage('');
    }
  }

  const handleDeleteProduct = async(): Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      if (userProductForSale.status === 'ACTIVE') throw new Error('Não se pode excluir um produto sem primeiro estar removido');

      await deleteProduct(userProductForSale.id);

      showToast('Produto deletado com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
      setActiveModal(null);
    }
  }

  const handleReactivateProduct = async(productId:number): Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      await reactivateRemovedProduct(productId);

      showToast('Produto reposto com sucesso', 'success');
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally { 
      setLoading(false);
      setActiveModal(null);
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handleCommentRatingProduct();
  }, [rating]);

  return {
    user,
    error,
    rating,
    loading,
    category,
    activeModal,
    orderSearch,
    orderFilter,
    datePutToSale,
    productComment,
    isPublished,
    productData,
    productToBeEdited,
    preview,
    formData,
    imageFile,
    fileInputRef,
    imageError,
    userProductForSale,
    supportMessage,
    selectedConversation,
    handleDeleteProduct,
    handleReactivateProduct,
    setSelectedConversation,
    setSupportMessage,
    setImageFile,
    setImageError,
    setFormData,
    setPreview,
    setProductToBeEdited,
    handleEditProduct,
    handleCommentRatingProduct,
    handleSendMessageToSupport,
    handleRemoveUserProductFromInventory,
    handleRemoveUserProductForSale,
    setProductComment,
    setOrderSearch,
    setActiveModal,
    setOrderFilter,
    setLoading,
    setRating,
    setError,
  }
}


