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
import { authClient, signUp } from '@/src/lib/auth-client';
import { authErrorsPtBr } from '@/src/lib/auth-errors';
import { titleColors, textColors, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { useUserStore } from '@/src/hooks/store/useUserStore';
import { registerStyle as style } from '@/src/styles/register.style';
import { ROLE_LABEL } from '@/src/constants/generalConfigs';
import { FaGoogle } from 'react-icons/fa6';

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [registerAs, setRegisterAs] = useState<'CUSTOMER' | 'SELLER' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      additionalData: {
        role: registerAs || 'CUSTOMER',
      }
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: registerAs,
    } as any, {
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

  if (registerAs === null) {
    return (
      <main className={style.mainContainer}>
        <div className='flex flex-col gap-1'>
          <div className={style.logo_siteContainer + ' w-fit self-center'}>
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

          <div className='w-full flex justify-center bg-linear-to-r py-2 from-transparent via-secondary-light to-transparent'>
            <div className='w-fit space-y-1'>
              <p className='text-primary'>
                Como deseja se cadastrar ?
              </p>

              <div className='flex gap-2'>
                <Button 
                  type={'submit'}
                  label='Cliente'
                  style={`flex-1 ${buttonColorsScheme.yellow}`}
                  onClick={() => setRegisterAs('CUSTOMER')}
                />
                <Button 
                  type={'submit'}
                  label='Vendedor'
                  style={`flex-1 ${buttonColorsScheme.yellow}`}
                  onClick={() => setRegisterAs('SELLER')}
                />
              </div>
            </div>
          </div>
          <span className={style.loginContainer + ' self-center w-fit'}>
            Já possui cadastro?
            <Link className={style.login} href={'/login'}>
              Entre!
            </Link>
          </span>
        </div>
      </main>
    )
  }

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
          <h1 className={style.title}>
            Cadastro
          </h1>

          <h2 className="flex items-center gap-2 text-yellow before:h-px before:flex-1 before:bg-yellow after:h-px after:flex-1 after:bg-yellow">
            {ROLE_LABEL[registerAs]}
          </h2>

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
            placeholder="Mínimo 8 caracteres"
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

          <div className='flex flex-col'>
            <Button
              type='submit'
              style='mt-4'
              loading={loading}
              loadingLabel='Cadastrando'
              label={'Cadastrar'}
              colorScheme='primary'
            />

            <span className='flex self-center items-center w-[76%] gap-2 text-gray before:h-px before:flex-1 before:bg-gray after:h-px after:flex-1 after:bg-gray'>
              ou
            </span>

            <button
              type="button"
              className="w-full text-left flex items-center justify-center gap-1 py-1 rounded-3xl mb-4 border-2 border-zinc-300 bg-white text-red hover:bg-zinc-50"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className='text-red'/>
              Continuar com Google
            </button>
          </div>

          <span className={style.loginContainer}>
            Já possui cadastro?
            <Link className={style.login} href={'/login'}>
              Entre!
            </Link>
          </span>

          <Button
            type='button'
            label='Trocar permissão'
            style={`w-fit px-5 py-0.5 text-sm self-center mt-2 ${buttonColorsScheme.yellow}`}
            onClick={() => setRegisterAs(registerAs === 'CUSTOMER'
              ? 'SELLER'
              : 'CUSTOMER'
            )}
          />
        </form>
      </div>
    </main>
  );
}

export default Register;