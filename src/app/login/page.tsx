"use client"

import Link from 'next/link';
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';
import { useState } from 'react';
import { authClient } from '@/src/lib/auth-client';
import { authErrorsPtBr } from '@/src/lib/auth-errors';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from '@/src/schemas/loginSchema'; 
import { useRouter } from 'next/navigation';
import Error from '@/src/components/ui/Error';

const Login = () => {

  const router = useRouter();
  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  })

  const onSubmit = async (data: LoginFormData) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      
      callbackURL: "/dashboard"
    },{
      onRequest: () => {
        setError(null);
        setLoading(true);
      }, 
      onSuccess: () => {
        router.push("/dashboard");
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
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Entrar</h1>

          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='primary'
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            style={{container: 'mt-1'}}
            label={'Senha'}
            placeholder={'Senha'}
            type={'password'}
            colorScheme='primary'
            {...register("password")}
            error={errors.password?.message}
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