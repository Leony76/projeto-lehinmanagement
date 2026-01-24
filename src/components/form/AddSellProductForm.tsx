'use client'

import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet'
import { FaImage } from 'react-icons/fa'

import { AddProductFormData, addProductSchema } from '@/src/schemas/addProductSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const SellProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  })

  const onSubmit = (data: AddProductFormData) => {
    console.log('FORM DATA:', data)
  }

  return (
    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        className={`flex w-full flex-col justify-center items-center text-sm text-center mt-5 border aspect-square rounded-3xl ${buttonColorsScheme.primary} text-primary-middledark`}
      >
        <FaImage className="text-7xl" />
        <div className="w-[80%]">
          <h4>Pressione aqui para pôr a imagem do produto</h4>
          <h5>Dê preferência a uma imagem quadrada se possível</h5>
        </div>
      </button>

      <div className="flex flex-col gap-2 mt-4">
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
          type="number"
          {...register("price")}
          error={errors.price?.message}
        />

        <Button
          style="mt-3 text-xl"
          colorScheme="primary"
          label="Pôr à venda"
          type="submit"
        />
      </div>
    </form>
  )
}

export default SellProductForm
