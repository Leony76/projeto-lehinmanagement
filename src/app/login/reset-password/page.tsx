"use client"

import Link from 'next/link';
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Image from 'next/image';
import Input from '@/src/components/form/Input';
import { titleColors, textColors } from '@/src/constants/systemColorsPallet';
import Button from '@/src/components/form/Button';
import { useState } from 'react';
import Error from '@/src/components/ui/Error';
import { loginStyle as style } from '@/src/styles/login.style';
import { useToast } from '@/src/contexts/ToastContext';
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";

const ResetPasswordPage = () => {

  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { showToast } = useToast();

  const handleResetPassword = async () => {
    if (loading) return;
    setLoading(true);

    if (newPassword !== newPasswordRepeat) {
      setError('As novas senhas não se coincidem');
      setLoading(false);
      return;
    }

    if (!token) return;

    const { error } = await authClient.resetPassword({
      newPassword: newPassword,
      token: token, 
    });

    setLoading(false);

    if (error) {
      showToast(error.message || 'Ocorreu um erro', "error");
    } else {
      showToast("Senha redefinida com sucesso!", "info");
      router.push("/login");
    }
  };
  
  if (!token) {
    return (
      <main className={style.mainContainer}>
        <div className={style.innerContainer}>
          <p className="text-red-500">Link de recuperação inválido ou expirado.</p>
          <Link href="/login" className="text-blue-500 underline">Voltar para o login</Link>
        </div>
      </main>
    );
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
        <div className={style.formContainer}>
          <h1 className={style.title}>
            Nova Senha
          </h1>

          <p className='text-primary text-sm my-2'>
            Insira sua nova senha.
          </p>

          <Input
            label={'Nova senha'}
            placeholder={'Sua nova senha'}
            type={'password'}
            colorScheme='primary'
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label={'Repitir nova senha'}
            placeholder={'Sua nova senha repetida'}
            type={'password'}
            colorScheme='primary'
            onChange={(e) => setNewPasswordRepeat(e.target.value)}
          />

          {error && <Error error={error}/>}

          <Button
            loading={loading}
            loadingLabel='Alterando'
            colorScheme='secondary'
            style='mt-3'
            label={'Alterar'}
            type='button'
            onClick={() => {
              if (newPassword.length < 6) {
                setError('A nova senha deve conter no mínimo 6 caracteres');
                return; 
              }
              setError(''); 
              handleResetPassword();
            }}
          />

          <span className={style.signupContainer}>
            Ainda não tem conta? 
            <Link className={style.signup} href={'/register'}>
              Cadastre-se!
            </Link>
          </span>
        </div>
      </div>
    </main>
  )
}

export default ResetPasswordPage