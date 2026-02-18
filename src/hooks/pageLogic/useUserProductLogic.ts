import { rateCommentProduct, removeProduct } from "@/src/actions/productActions";
import { UserProductOrdersFilterValue, CATEGORY_LABEL_MAP } from "@/src/constants/generalConfigs";
import { useToast } from "@/src/contexts/ToastContext";
import { UserProductPageModals } from "@/src/types/modal";
import { useState, useEffect } from "react";
import { useLockScrollY } from "../useLockScrollY";
import { UserProductDTO } from "@/src/types/userProductDTO";

type Props = {
  userProduct: UserProductDTO;
}

export const useUserProductLogic = ({userProduct}:Props) => {
  const { showToast } = useToast();

  const [activeModal, setActiveModal] = useState<UserProductPageModals | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<UserProductOrdersFilterValue | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  const [productComment, setProductComment] = useState<string>('');

  const [rating, setRating] = useState<number>(userProduct.productRating);

  const datePutToSale = new Date(userProduct.createdAt).toLocaleDateString("pt-BR");

  const category =  CATEGORY_LABEL_MAP[userProduct.category] ?? 'Categoria não definida';

  useLockScrollY(Boolean(activeModal));

  const handleCommentRatingProduct = async() => {
    if (!rating) return;

    try {
      await rateCommentProduct(
        userProduct.id,
        rating,
        productComment,
      );

      if (rating !== userProduct.productRating) {
        showToast('Produto avaliado', 'info');
      } if (productComment) {
        showToast('Seu comentário sobre o produto foi ao ar', 'info');
        setProductComment('');
      }
    } catch (err:unknown) { 
      showToast('Houve um erro: ' + err, 'error');
    } 
  }

  const handleRemoveUserProduct = async() => {
    if (loading) return;
    setLoading(true);

    try {
      await removeProduct(
        userProduct.id,
        ''
      );

      showToast('Produto removido com sucesso', 'success');
    } catch (err:unknown) {
      showToast('Erro: ' + err, 'error');
    } finally {
      setActiveModal(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleCommentRatingProduct();
  },[rating]);

  return {
    error,
    rating,
    loading,
    category,
    activeModal,
    orderSearch,
    orderFilter,
    datePutToSale,
    productComment,
    handleCommentRatingProduct,
    handleRemoveUserProduct,
    setProductComment,
    setOrderSearch,
    setActiveModal,
    setOrderFilter,
    setLoading,
    setRating,
    setError,
  }
}