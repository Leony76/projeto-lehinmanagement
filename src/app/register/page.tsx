"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LRC from '@/public/LericoriaPadraoFogo2.png';
import Input from '@/src/components/form/Input';
import Button from '@/src/components/form/Button';
import Error from '@/src/components/ui/Error';

import { registerSchema, RegisterFormData } from '@/src/schemas/registerSchema';
import { signUp } from '@/src/lib/auth-client';
import { authErrorsPtBr } from '@/src/lib/auth-errors';
import { titleColors, textColors } from '@/src/constants/systemColorsPallet';
import { useUserStore } from '@/src/store/useUserStore';

const Register = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched" 
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setLoading(true);

    await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    }, {
      onSuccess: (ctx) => {
        if (ctx.data) {
          useUserStore.getState().setUser(ctx.data.user, ctx.data.session);
        }

        router.push(`/dashboard?success=signup&name=${encodeURIComponent(data.name)}`);
      },
      onError: (ctx) => {
        const errorCode = ctx.error.code as keyof typeof authErrorsPtBr;
        const message = authErrorsPtBr[errorCode] || ctx.error.message || "Erro inesperado";
        setApiError(message);
        setLoading(false);
      }
    });
  };

  return (
    <main className='flex flex-col justify-center min-h-dvh bg-linear-to-tr from-secondary-light via-white to-primary-ultralight'>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col justify-center items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%'>
          <Image src={LRC} alt={'Lericoria'} height={67} width={76} />
          <h2 className={titleColors.primary}>Lehinmanagment'</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Cadastro</h1>

          <Input
            label="Nome"
            placeholder="Seu nome"
            type="text"
            colorScheme="secondary"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="E-mail"
            placeholder="exemplo@email.com"
            type="email"
            colorScheme="secondary"
            style={{ container: 'mt-1' }}
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            type="password"
            colorScheme="secondary"
            style={{ container: 'mt-1' }}
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Repetir senha"
            placeholder="Confirme sua senha"
            type="password"
            colorScheme="secondary"
            style={{ container: 'mt-1 mb-2' }}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {apiError && <Error error={apiError} />}

          <Button
            style='mt-4'
            loading={loading}
            loadingLabel='Cadastrando'
            label={'Cadastrar'}
            colorScheme='primary'
          />

          <Link className={`${textColors.primary} mt-2 text-xs m-auto`} href={'/login'}>
            Já possui cadastro? <span className={`${textColors.secondaryMiddleDark} hover:underline`}>Entre!</span>
          </Link>
        </form>
      </div>
    </main>
  );
}

export default Register;