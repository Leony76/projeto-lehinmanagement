'use client'

import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'
import { FaImage } from 'react-icons/fa'
import Error from '../ui/Error'
import { editProductFormStyle as style } from '@/src/styles/Product/editProductForm.style'
import { useAddSellProductLogic } from '@/src/hooks/pageLogic/useAddSellProductLogic'
import { Controller } from 'react-hook-form';

const AddSellProductForm = () => {
  
  const {
    preview,
    loading,
    control,
    imageFile,
    imageError,
    errors,
    fileInputRef,
    setImageError,
    setImageFile,
    handleSubmit,
    setPreview,
    register,
    onSubmit,
  } = useAddSellProductLogic();

  return (
    <form
    className={style.addSellProductMainContainer}
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
      <div className='sm:hidden'>
        <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`${style.changeImageContainer} ${imageError 
          ? 'shadow-[0px_0px_5px_red]' 
          : ''
        }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview do produto"
              className={style.image}
            />
          ) : (
            <>
              <FaImage className="text-7xl" />
              <div className="w-[80%]">
                <h4>Pressione aqui para pôr a imagem do produto.</h4>
                <h5>Dê preferência a uma imagem quadrada se possível.</h5>
              </div>
            </>
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

        <Controller
        name="category"
        control={control} 
        render={({ field }) => (
          <Select
            {...field}
            hasTopLabel
            selectSetup="CATEGORY"
            colorScheme="secondary"
            label="Categoria"
            style={{container: 'sm:mt-1'}}
            error={errors.category?.message}
          />
          )}
        />

        <TextArea
          maxLength={500}
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
              container: style.price_stock.container,
            }}
            {...register("stock")}
            error={errors.stock?.message}
          />
        </div>
        
        <Button
          style="mt-3 text-xl"
          colorScheme="primary"
          label="Pôr à venda"
          type="submit"
          loading={loading}
          loadingLabel='Processando'
        />
      </div>
      <div className={style.imageContainerForMobile}>
        <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`${style.changeImageContainer} ${imageError ? 'shadow-[0px_0px_5px_red]' : ''}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview do produto"
              className={style.image}
            />
          ) : (
            <>
              <FaImage className="text-7xl" />
              <div className="w-[80%]">
                <h4>Pressione aqui para pôr a imagem do produto.</h4>
                <h5>Dê preferência a uma imagem quadrada se possível.</h5>
              </div>
            </>
          )}
        </button>
        {imageError && <Error error={imageError}/>}
      </div>
    </form>
  )
}

export default AddSellProductForm
