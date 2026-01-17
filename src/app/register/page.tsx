import Link from 'next/link';
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors, inputColorScheme, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';

const Register = () => {
  return (
    <main className='flex flex-col justify-center min-h-dvh bg-linear-to-tr from-secondary-light via-white to-primary-ultralight'>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col justify-center  items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%'>
          <Image  src={LRC}  alt={'Lericoria'} height={67} width={76}/>
          <h2 className={titleColors.primary}>Lehinmanagment'</h2>
        </div>
        <div className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Cadastro</h1>
          <Input
            label={'Nome'}
            placeholder={'Nome'}
            type={'text'}
            colorScheme='secondary'
          />
          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='secondary'
          />
          <div className='mt-1'></div>
          <Input
            label={'Senha'}
            placeholder={'Senha'}
            type={'password'}
            colorScheme='secondary'
          />
          <Input
            label={'Repetir senha'}
            placeholder={'Repetir senha'}
            type={'password'}
            colorScheme='secondary'
          />
          <div className='mt-4'></div>
          <Button label={'Cadastrar'} colorScheme='primary'/>
          <Link className={`${textColors.primary} mt-2 text-xs m-auto`} href={'/login'}>Já possui cadastro? <span className={`${textColors.secondaryMiddleDark} hover:underline`}>Entre!</span></Link>
        </div>
      </div>
    </main>
  )
}

export default Register