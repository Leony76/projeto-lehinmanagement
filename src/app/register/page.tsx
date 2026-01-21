"use client"

import Link from 'next/link';
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';
import { useFormReducer } from '@/src/hooks/useFormReducer';
import { RegisterFormState } from '@/src/types/form/auth';
import { useState } from 'react';
import { signUp } from '@/src/lib/auth-client';
import { authErrorsPtBr } from '@/src/lib/auth-errors';
import Error from '@/src/components/ui/Error';
import { useRouter } from 'next/navigation';

const Register = () => {
  
  const router = useRouter();

  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(false);

  const { form, handleChange } = useFormReducer<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!form.name && !form.email && !form.password && !form.confirmPassword) {
      setError('Preencha os campos'); return
    }
    
    if (!form.name) {setError('O campo de nome é obrigatório'); return}
    if (!form.email) {setError('O campo de email é obrigatório'); return}
    if (!form.password) {setError('O campo de senha é obrigatório'); return}
    if (!form.confirmPassword) {setError('O campo de confirmar senha é obrigatório'); return}
    
    if (form.password !== form.confirmPassword) {setError("As senhas não coincidem"); return}

    if (form.password.length < 6) {setError('A senha deve ter no mínimo 6 caractéres'); return}

    setLoading(true);
    await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
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
    <main className='flex flex-col justify-center min-h-dvh bg-linear-to-tr from-secondary-light via-white to-primary-ultralight'>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col justify-center  items-center transition-all duration-776 hover:scale-[1.1] hover:bg-radial from-primary/50 to-70%'>
          <Image  src={LRC}  alt={'Lericoria'} height={67} width={76}/>
          <h2 className={titleColors.primary}>Lehinmanagment'</h2>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col max-w-62.5 w-full'>
          <h1 className={`${titleColors.secondary} text-3xl text-center`}>Cadastro</h1>
          <Input
            label={'Nome'}
            placeholder={'Nome'}
            type={'text'}
            colorScheme='secondary'
            name={'name'}
            value={form.name}
            onChange={handleChange('name')}
          />
          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='secondary'
            name={'email'}
            value={form.email}
            onChange={handleChange('email')}
          />
          <div className='mt-1'></div>
          <Input
            label={'Senha'}
            placeholder={'Senha'}
            type={'password'}
            colorScheme='secondary'
            name={'password'}
            value={form.password}
            onChange={handleChange('password')}
          />
          <Input
            label={'Repetir senha'}
            placeholder={'Repetir senha'}
            type={'password'}
            colorScheme='secondary'
            name={'confirmPassword'}
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
          />

          {error && <Error error={error}/>}

          <Button style='mt-4' loading={loading} loadingLabel='Cadastrando' label={'Cadastrar'} colorScheme='primary'/>
          <Link className={`${textColors.primary} mt-2 text-xs m-auto`} href={'/login'}>Já possui cadastro? <span className={`${textColors.secondaryMiddleDark} hover:underline`}>Entre!</span></Link>
        </form>
      </div>
    </main>
  )
}

export default Register