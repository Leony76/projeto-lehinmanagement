'use client'

import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet'

import { useRef, useState } from "react"
import { AddProductFormData, addProductSchema } from '@/src/schemas/addProductSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useToast } from '@/src/contexts/ToastContext'
import Error from '../ui/Error'
import { updateProduct } from '@/src/actions/productActions';
import { ProductDTO } from '@/src/types/productDTO'
import { editProductFormStyle as style } from '@/src/styles/Product/editProductForm.style'

const EditProductForm = ({
  productToBeEdited,
  closeModal
}: {
  productToBeEdited: ProductDTO;
  closeModal: () => void;
}) => {

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: productToBeEdited.name,
      category: productToBeEdited.category,
      description: productToBeEdited.description ?? "",
      price: productToBeEdited.price,
      stock: productToBeEdited.stock,
    }
  })

  const onSubmit: SubmitHandler<AddProductFormData> = async (data) => {

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

      const payload = {
        ...data,
        id: productToBeEdited.id,
        price: Number(data.price),
        stock: Number(data.stock),
        ...(imageUrl ? { imageUrl } : { imageUrl: productToBeEdited.imageUrl }),
      };

      await updateProduct(payload)

      closeModal();
   
      showToast(`Produto editado com sucesso`, 'success');
    } catch (err:unknown) {
      showToast("Ocorreu um erro: " + err, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
    className={style.mainContainer}
    onSubmit={handleSubmit(onSubmit)}
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
      <div className='sm:hidden'>
        <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`${style.changeImageContainer} ${imageError 
          ? style.misc.errorInputGlow  
          : ''
        }`}
        >
          {preview ? (
            <img
              src={preview}
              alt={productToBeEdited.name}
              className={style.image}
            />
          ) : (
             <img
              src={productToBeEdited.imageUrl}
              alt={productToBeEdited.name}
              className={style.image}
            />
          )}
        </button>
        {imageError && <Error error={imageError}/>}
      </div>
      <div className={style.formInputsContainer}>
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
          style={{container: 'sm:mt-1'}}
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

        <div className='flex gap-3'>
          <Input
            label="Preço"
            placeholder="Preço"
            miscConfigs={{step: 'any'}}
            style={{
              input: style.price_stock.input,
              container: style.price_stock.container 
            }}
            type="number"
            {...register("price")}
            error={errors.price?.message}
          />

          <Input
            label="Estoque"
            placeholder="Estoque"
            type="number"
            style={{
              input: style.price_stock.input,
              container: style.price_stock.container
            }}
            {...register("stock")}
            error={errors.stock?.message}
          />
        </div>
        
        <Button
          style={style.editButton}
          label="Editar"
          type="submit"
          loading={loading}
          loadingLabel='Editando'
        />
      </div>
      <div className={style.imageContainerForMobile}>
        <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`${style.changeImageContainer} ${imageError 
          ? style.misc.errorInputGlow 
          : ''
        }`}
        >
          {preview ? (
            <img
              src={preview}
              alt={productToBeEdited.name}
              className={style.image}
            />
          ) : (
             <img
              src={productToBeEdited.imageUrl}
              alt={productToBeEdited.name}
              className={style.image}
            />
          )}
        </button>
        {imageError && <Error error={imageError}/>}
      </div>
    </form>
  )
}

export default EditProductForm
