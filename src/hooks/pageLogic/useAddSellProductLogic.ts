import { createProduct } from "@/src/actions/productActions";
import { useToast } from "@/src/contexts/ToastContext";
import { AddProductFormData, addProductSchema } from "@/src/schemas/addProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductFormStore } from "../store/useAddProductFormStore";
import { useUserStore } from "../store/useUserStore";

export const useAddSellProductLogic = () => {
  const user = useUserStore((stats) => stats.user);

  const FORM_STORAGE_KEY = user
    ? `sell-product-form:${user.id}`
    : null;

  const shouldPersistRef = useRef(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  })

  const onSubmit = async(data: AddProductFormData) => {

    if (loading)return;
    setLoading(true);

    try {
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

      await createProduct({
        ...data,
        imageUrl,
      });
    
      showToast(`Produto ${user?.role === 'ADMIN' 
        ? 'adicionado' 
        : 'posto à venda'
      } com sucesso`, 'success');

      shouldPersistRef.current = false;

      FORM_STORAGE_KEY && localStorage.removeItem(FORM_STORAGE_KEY);

      reset({
        name: "",
        category: undefined,
        price: 0,
        stock: 0,
        description: "",
      });

      setImageFile(null);
      setPreview(null);
      setImageError(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      requestAnimationFrame(() => {
        shouldPersistRef.current = true;
      });
    } catch (err:unknown) {
      showToast("Ocorreu um erro: " + err, 'error');
    } finally {
      setLoading(false);
    }
  }

  useAddProductFormStore({
    FORM_STORAGE_KEY,
    shouldPersistRef,
    watch,
    reset,
  });

  return {
    errors,
    preview,
    loading,
    imageFile,
    imageError,
    fileInputRef,
    setImageError,
    setImageFile,
    handleSubmit,
    setPreview,
    register,
    onSubmit,
  }
}