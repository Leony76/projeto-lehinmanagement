'use client'

import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'

import { useEffect } from 'react';
import { AddProductFormData, addProductSchema } from '@/src/schemas/addProductSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import Error from '../ui/Error'
import { ProductDTO } from '@/src/types/productDTO'
import { editProductFormStyle as style } from '@/src/styles/Product/editProductForm.style'
import Modal from '../modal/Modal'
import { ProductPageModals } from '@/src/types/modal'
import { CategoryValue } from '@/src/constants/generalConfigs'

type Props = {
  productToBeEdited: ProductDTO | null,
  onCloseActions: () => void;
  isOpen: boolean;
  actions: {
    setActiveModal: React.Dispatch<React.SetStateAction<ProductPageModals | null>>;
    handleEditProduct: SubmitHandler<{
      name: string;
      category: CategoryValue;
      price: number;
      stock: number;
      id?: number | undefined;
      imageUrl?: string | undefined;
      description?: string | undefined;
    }>
  }
  imageProps: {
    imageFile: File | null,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
    preview: string | null,
    imageError: string | null,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setImageError:  React.Dispatch<React.SetStateAction<string | null>>,
  }
}

const EditProductForm = ({
  productToBeEdited,
  onCloseActions,
  actions,
  imageProps,
  isOpen,
}:Props) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: productToBeEdited?.name || "",
      category: productToBeEdited?.category,
      description: productToBeEdited?.description || "",
      price: productToBeEdited?.price,
      stock: productToBeEdited?.stock,
    }
  })

  useEffect(() => {
    if (productToBeEdited) {
      reset({
        name: productToBeEdited.name,
        category: productToBeEdited.category,
        description: productToBeEdited.description ?? "",
        price: productToBeEdited.price,
        stock: productToBeEdited.stock,
      });
    }
  }, [productToBeEdited, reset]);

  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={'Editar produto'}
    onCloseModalActions={onCloseActions}
    hasXClose
    style={{container: '!max-w-215'}}
    > 
      <form
      className={style.mainContainer}
      onSubmit={handleSubmit(actions.handleEditProduct)}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageProps.fileInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            imageProps.setImageFile(file);
            imageProps.setPreview(URL.createObjectURL(file));
            imageProps.setImageError(null);
          }}
        />
        <div className='sm:hidden'>
          <button
          type="button"
          onClick={() => imageProps.fileInputRef.current?.click()}
          className={`${style.changeImageContainer} ${imageProps.imageError 
            ? style.misc.errorInputGlow  
            : ''
          }`}
          >
            {imageProps.preview ? (
              <img
                src={imageProps.preview}
                alt={productToBeEdited?.name}
                className={style.image}
              />
            ) : (
              <img
                src={productToBeEdited?.imageUrl}
                alt={productToBeEdited?.name}
                className={style.image}
              />
            )}
          </button>
          {imageProps.imageError && <Error error={imageProps.imageError}/>}
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
            label="Prosseguir"
            type="button"
            onClick={() => {
              actions.setActiveModal('EDIT_JUSTIFY');             
            }}
          />
        </div>
        <div className={style.imageContainerForMobile}>
          <button
          type="button"
          onClick={() => imageProps.fileInputRef.current?.click()}
          className={`${style.changeImageContainer} ${imageProps.imageError 
            ? style.misc.errorInputGlow 
            : ''
          }`}
          >
            {imageProps.preview ? (
              <img
                src={imageProps.preview}
                alt={productToBeEdited?.name}
                className={style.image}
              />
            ) : (
              <img
                src={productToBeEdited?.imageUrl}
                alt={productToBeEdited?.name}
                className={style.image}
              />
            )}
          </button>
          {imageProps.imageError && <Error error={imageProps.imageError}/>}
        </div>
      </form>
    </Modal>
  )
}

export default EditProductForm
