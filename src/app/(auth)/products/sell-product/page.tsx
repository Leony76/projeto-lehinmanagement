import Button from '@/src/components/form/Button'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import TextArea from '@/src/components/form/TextArea'
import PageTitle from '@/src/components/ui/PageTitle'
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet'
import { FaImage } from 'react-icons/fa'

const page = () => {
  return (
    <div>
      <PageTitle style='mt-2' title={'Vender Produto'}/>
      <div className='mb-4'>
        <button className={`flex w-full flex-col justify-center items-center text-sm text-center mt-5 border aspect-square rounded-3xl ${buttonColorsScheme.primary} text-primary-middledark`}>
          <FaImage className='text-7xl'/>
          <div className='w-[80%]'>
            <h4>Pressione aqui para por a imagem do produto</h4>
            <h5>Dê preferêcia a uma imagem quadrada se possível</h5>
          </div>
        </button>
        <div className='flex flex-col gap-1'>
          <Input label={'Nome'} placeholder={'Nome'} type={'text'}/>
          <Select hasTopLabel selectSetup={'CATEGORY'} colorScheme={'secondary'} label={'Categoria'}/>
          <TextArea label={'Descrição (opcional)'} placeholder={'Descrição'}/>
          <Input label={'Preço'} placeholder={'Preço'} type={'number'}/>
          <Button style='mt-3 text-xl' colorScheme='primary' label='Pôr a venda'/>
        </div>
      </div>
    </div>
  )
}

export default page