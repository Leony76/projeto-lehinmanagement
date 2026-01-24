'use client'

import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet'
import { FaImage } from 'react-icons/fa'

import { useEffect, useRef, useState } from "react"
import { AddProductFormData, addProductSchema } from '@/src/schemas/addProductSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/src/contexts/ToastContext'
import { useUserStore } from '@/src/store/useUserStore'
import Error from '../ui/Error'
import { useAddProductFormStore } from '@/src/store/useAddProductFormStore'

const SellProductForm = () => {
  const user = useUserStore((stats) => stats.user);

  const FORM_STORAGE_KEY = user
    ? `sell-product-form:${user.id}`
    : null;

  const shouldPersistRef = useRef(true);
  const didHydrateRef = useRef(false);

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
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      } 

      const response = await fetch('/api/products', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (response) {
        showToast(`Produto ${user?.role === 'ADMIN' 
          ? 'adicionado' 
          : 'posto à venda'
        } com sucesso`, 'success');

        shouldPersistRef.current = false;

        FORM_STORAGE_KEY && localStorage.removeItem(FORM_STORAGE_KEY);

        reset({
          name: "",
          category: undefined,
          price: "",
          stock: "",
          description: "",
        });

        setImageFile(null);
        setPreview(null);
        setImageError(null);

        if (fileInputRef.current) fileInputRef.current.value = "";

        requestAnimationFrame(() => {
          shouldPersistRef.current = true;
        });
      } else {
        showToast("Erro ao casdastrar o produto", 'error');
      }
    } catch (err:unknown) {
      showToast("Ocorreu um erro: " + err, 'error');
    } finally {
      setLoading(false);
    }
  }

  useAddProductFormStore({watch, reset, FORM_STORAGE_KEY, shouldPersistRef});

  return (
    <form
    className="mb-4"
    onSubmit={handleSubmit(
      (data) => {
        if (!imageFile) {
          setImageError("A imagem do produto é obrigatória");
          return;
        }

        setImageError(null);
        onSubmit(data);
      },
      () => {
        if (!imageFile) {
          setImageError("A imagem do produto é obrigatória");
        }
      }
    )}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setImageFile(file);
          setPreview(URL.createObjectURL(file));
          setImageError(null);
        }}
      />
      <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className={`relative flex w-full flex-col justify-center items-center text-sm text-center mt-5 mb-1 border aspect-square rounded-3xl overflow-hidden ${buttonColorsScheme.primary} ${imageError ? 'shadow-[0px_0px_5px_red]' : ''}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview do produto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <FaImage className="text-7xl" />
            <div className="w-[80%]">
              <h4>Pressione aqui para pôr a imagem do produto</h4>
              <h5>Dê preferência a uma imagem quadrada se possível</h5>
            </div>
          </>
        )}
      </button>
      {imageError && <Error error={imageError}/>}
      <div className="flex flex-col gap-2 mt-2">
        <Input
          label="Nome"
          placeholder="Nome"
          type="text"
          {...register('name')}
          error={errors.name?.message}
        />

        <Select
          hasTopLabel
          selectSetup="CATEGORY"
          colorScheme="secondary"
          label="Categoria"
          {...register('category')}
          error={errors.category?.message}
        />

        <TextArea
          style={{ input: 'h-26' }}
          label="Descrição (opcional)"
          placeholder="Descrição"
          {...register('description')}
          error={errors.description?.message}
        />

        <Input
          label="Preço"
          placeholder="Preço"
          miscConfigs={{step: 'any'}}
          type="number"
          {...register("price")}
          error={errors.price?.message}
        />

        <Input
          label="Estoque"
          placeholder="Estoque"
          type="number"
          {...register("stock")}
          error={errors.stock?.message}
        />
        
        <Button
          style="mt-3 text-xl"
          colorScheme="primary"
          label="Pôr à venda"
          type="submit"
          loading={loading}
          loadingLabel='Processando'
        />
      </div>
    </form>
  )
}

export default SellProductForm
