import { removeProduct, updateProduct } from "@/src/actions/productActions";
import { sendMessageToSupport } from "@/src/actions/userActions";
import { CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { useUserStore } from "@/src/hooks/store/useUserStore";
import { useLockScrollY } from "@/src/hooks/useLockScrollY";
import { AddProductFormData } from "@/src/schemas/addProductSchema";
import { ProductPageModals } from "@/src/types/modal";
import { ProductDTO } from "@/src/types/productDTO";
import { UserAndSupportConversationDTO } from "@/src/types/UserAndSupportConversationDTO";
import { UserSituation, SupportMessageType, SupportMessageSentBy } from "@prisma/client";
import { useRef, useState } from "react";

type Props = {
  product: ProductDTO;
}

export const useProductLogic = ({product}:Props) => {

  const { showToast } = useToast();

  const [formData, setFormData] = useState<AddProductFormData | null>(null); 
  const [selectedConversation, setSelectedConversation] = useState<UserAndSupportConversationDTO | null>(null);

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [productToBeEdited, setProductToBeEdited] = useState<ProductDTO | null>(null);

  const [activeModal, setActiveModal] = useState<ProductPageModals | null>(null);

  const [removeJustify, setRemoveJustify] = useState<string>('');
  const [editJustify, setEditJustify] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [supportMessage, setSupportMessage] = useState<string>('');
  
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  

  const user = useUserStore((stats) => stats.user);

  const available = product.stock - product.reservedStock;
  const canOrder = (product.sellerId !== user?.id) && (user?.role !== 'ADMIN');

  const handleRemoveProduct = async() => {
    if (loading!) return;
    setLoading(true); 

    try {
      
      if (user?.role === 'ADMIN') {
        await removeProduct(product.id, removeJustify);
      } else {
        await removeProduct(product.id);
      }
      
      setRemoveJustify('');
      showToast('Produto removido com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao remover produto', 'error');
    } finally {
      setActiveModal(null);
      setLoading(false);
    }
  };

  const handleSendMessageToSupport = async() => {
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
        product.id,    
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

      if (user?.role === 'ADMIN') {
        await updateProduct(payload, editJustify);
      } else {
        await updateProduct(payload);
      }
   
      showToast(`Produto editado com sucesso`, 'success');
    } catch (err:unknown) {
      showToast("Ocorreu um erro: " + err, 'error');
    } finally {
      setLoading(false);
      setActiveModal(null);
      setFormData(null);
    }
  }

  useLockScrollY(Boolean(activeModal)); 

  return {
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
    removeJustify,
    supportMessage,
    selectedConversation,
    setSelectedConversation,
    handleSendMessageToSupport,
    setSupportMessage,
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
  }
}