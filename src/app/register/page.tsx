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
import { useUserStore } from '@/src/hooks/store/useUserStore';
import { registerStyle as style } from '@/src/styles/register.style';

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
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
        setError(message);
        setLoading(false);
      }
    });
  };

  return (
    <main className={style.mainContainer}>
      <div className={style.innerContainer}>
        <div className={style.logo_siteContainer}>
          <Image 
            src={LRC} 
            alt={'Lericoria'} 
            height={67}
            width={76} 
           />
          <h2 className={titleColors.primary}>
            Lehinmanagment'
          </h2>
        </div>

        <form 
        onSubmit={handleSubmit(onSubmit)} 
        className={style.formContainer}
        >
          <h1 className={style.title}>Cadastro</h1>

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

          {error && <Error error={error} />}

          <Button
            type='submit'
            style='mt-4'
            loading={loading}
            loadingLabel='Cadastrando'
            label={'Cadastrar'}
            colorScheme='primary'
          />

          <span className={style.loginContainer}>
            Já possui cadastro?
            <Link className={style.login} href={'/login'}>
              Entre!
            </Link>
          </span>
        </form>
      </div>
    </main>
  );
}

export default Register;