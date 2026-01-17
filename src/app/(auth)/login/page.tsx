import Link from 'next/link';
import LRC from '../../../../public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors, inputColorScheme, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';

const Login = () => {
  return (
    <main className='flex flex-col justify-center min-h-dvh bg-linear-to-bl from-secondary-light via-white to-primary-ultralight'>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col justify-center  items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%'>
          <Image  src={LRC}  alt={'Lericoria'} height={67} width={76}/>
          <h2 className={titleColors.primary}>Lehinmanagment'</h2>
        </div>
        <div className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Entrar</h1>
          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='Fire'
          />
          <div className='mt-1'></div>
          <Input
            label={'Senha'}
            placeholder={'Senha'}
            type={'password'}
            colorScheme='Fire'
          />
          <div className='mt-4'></div>
          <Button label={'Entrar'}/>
          <Link className={`${textColors.secondaryMiddleDark} mt-2 text-xs m-auto`} href={'/register'}>Ainda não tem conta? <span className={`${textColors.primary} hover:underline`}>Cadastre-se!</span></Link>
        </div>
      </div>
    </main>
  )
}

export default Login