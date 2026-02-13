import { removeProduct, updateProduct } from "@/src/actions/productActions";
import { CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { useUserStore } from "@/src/hooks/store/useUserStore";
import { useLockScrollY } from "@/src/hooks/useLockScrollY";
import { AddProductFormData } from "@/src/schemas/addProductSchema";
import { ProductPageModals } from "@/src/types/modal";
import { ProductDTO } from "@/src/types/productDTO";
import { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

type Props = {
  product: ProductDTO;
}

export const useProductLogic = ({product}:Props) => {

  const { showToast } = useToast();

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
  
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  

  const user = useUserStore((stats) => stats.user);

  const available = product.stock - product.reservedStock;
  const canOrder = (product.sellerId !== user?.id) && (user?.role !== 'ADMIN');

  const handleRemoveProduct = async() => {
    if (loading!) return;
    setLoading(true);

    if (user?.role === 'ADMIN' && !removeJustify) {
      setError('A justificativa de remoção é obrigatória');
      return;
    }

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

  const handleEditProduct = async():Promise<void> => {

    if (loading) return;
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
        ...productToBeEdited,
        id: productToBeEdited.id,
        price: Number(productToBeEdited.price),
        stock: Number(productToBeEdited.stock),
        ...(imageUrl ? { imageUrl } : { imageUrl: productToBeEdited.imageUrl }),
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
    }
  }

  useLockScrollY(Boolean(activeModal)); 

  return {
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
    setProductToBeEdited,
    setEditJustify,
    handleRemoveProduct,
    setRemoveJustify,
    setActiveModal,
    setLoading,
    setError,
  }
}