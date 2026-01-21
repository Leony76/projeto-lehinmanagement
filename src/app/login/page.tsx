"use client"

import Link from 'next/link';
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';
import { useFormReducer } from '@/src/hooks/useFormReducer';
import { LoginFormState } from '@/src/types/form/auth';
import { useState } from 'react';
import { authClient } from '@/src/lib/auth-client';
import { authErrorsPtBr } from '@/src/lib/auth-errors';
import Error from '@/src/components/ui/Error';

const Login = () => {

  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(false);
  const { form, handleChange } = useFormReducer<LoginFormState>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
  
    if (!form.email && !form.password) {setError('Preencha os campos'); return}
    if (!form.email) {setError('O campo de email é obrigatório'); return}
    if (!form.password) {setError('O campo de senha é obrigatório'); return}
    
    await authClient.signIn.email({
      email: form.email,
      password: form.password,
      
      callbackURL: "/dashboard"
    },{
      onRequest: () => {
        setError(null);
        setLoading(true);
      }, 
      onError: (ctx) => {
        const errorCode = ctx.error.code as keyof typeof authErrorsPtBr;
        const message = authErrorsPtBr[errorCode] || ctx.error.message || "Ocorreu um erro inesperado.";
        setError(message);
        setLoading(false);
      }
    });
  }

  return (
    <main className='flex flex-col justify-center min-h-dvh bg-linear-to-bl from-secondary-light via-white to-primary-ultralight'>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col justify-center  items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%'>
          <Image  src={LRC}  alt={'Lericoria'} height={67} width={76}/>
          <h2 className={titleColors.primary}>Lehinmanagment'</h2>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Entrar</h1>
          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='primary'
            name={'email'}
            value={form.email}
            onChange={handleChange('email')}
          />
          <div className='mt-1'></div>
          <Input
            label={'Senha'}
            placeholder={'Senha'}
            type={'password'}
            colorScheme='primary'
            name={'password'}
            value={form.password}
            onChange={handleChange('password')}
          />

          {error && <Error error={error}/>}
          
          <Button
            loading={loading}
            loadingLabel='Entrando'
            style='mt-4'
            label={'Entrar'}
          />
          <Link 
            className={`${textColors.secondaryMiddleDark} mt-2 text-xs m-auto`} 
            href={'/register'}>
              Ainda não tem conta? 
              <span className={`${textColors.primary} ml-1 hover:underline`}> 
                Cadastre-se!
              </span>
          </Link>
        </form>
      </div>
    </main>
  )
}

export default Login