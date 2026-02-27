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
import { authClient } from '@/src/lib/auth-client';
import { useToast } from '@/src/contexts/ToastContext';

const ForgotPasswordPage = () => {

  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { showToast } = useToast();

  const handleForgotPassword = async (email: string) => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/login/reset-password",
      });

      if (error) {
        showToast(error.message || 'Houve um erro', "error");
      } else {
        showToast("E-mail enviado!", "info");
        setEmailSent(true);
      }
    } catch (err:unknown) {
      showToast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };
  
  if (emailSent) {
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
              Recuperar senha
            </h1>

            <p className='text-primary text-sm my-2'>
              Foi enviado para o e-mail provido um link para a recuperação de sua senha. Caso não tenha recebido, aperte em 'Reenviar' para que seja mandado novamente.
            </p>

            <Button
              loading={loading}
              loadingLabel='Reenviando'
              colorScheme='secondary'
              style='mt-3'
              label={'Reenviar'}
              type='button'
              onClick={() => handleForgotPassword(registeredEmail)}
            />

            <span className={style.signupContainer}>
              Lembrou da senha? 
              <Link className={style.signup} href={'/login'}>
                Entre!
              </Link>
            </span>
          </div>
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
        <div className={style.formContainer}>
          <h1 className={style.title}>
            Recuperar senha
          </h1>

          <p className='text-primary text-sm my-2'>
            Insira seu e-mail cadastrado no sistema para que possamos lhe enviar um e-mail para poder redefinir sua senha atual.
          </p>

          <Input
            label={'E-mail'}
            placeholder={'E-mail'}
            type={'email'}
            colorScheme='primary'
            onChange={(e) => setRegisteredEmail(e.target.value)}
          />

          {error && <Error error={error}/>}

          <Button
            loading={loading}
            loadingLabel='Enviando'
            colorScheme='secondary'
            style='mt-3'
            label={'Enviar'}
            type='button'
            onClick={() => {
              if (registeredEmail.length < 7) {
                setError('O e-mail existente de haver no mínimo 7 caractéres');
                return;
              }
              setError('');
              handleForgotPassword(registeredEmail);
            }}
          />

          <span className={style.signupContainer}>
            Lembrou da senha? 
            <Link className={style.signup} href={'/login'}>
              Entre!
            </Link>
          </span>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage