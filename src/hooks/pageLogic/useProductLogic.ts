import { removeProduct } from "@/src/actions/productActions";
import { CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { useUserStore } from "@/src/hooks/store/useUserStore";
import { useLockScrollY } from "@/src/hooks/useLockScrollY";
import { ProductPageModals } from "@/src/types/modal";
import { ProductDTO } from "@/src/types/productDTO";
import { useState } from "react";

type Props = {
  product: ProductDTO;
}

export const useProductLogic = ({product}:Props) => {

  const { showToast } = useToast();

  const datePutToSale = new Date(product.createdAt).toLocaleDateString("pt-BR");
  const category = CATEGORY_LABEL_MAP[product.category];

  const [activeModal, setActiveModal] = useState<ProductPageModals | null>(null);

  const [removeJustify, setRemoveJustify] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
    handleRemoveProduct,
    setRemoveJustify,
    setActiveModal,
    setLoading,
    setError,
  }
}