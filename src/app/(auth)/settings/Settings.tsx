"use client";

import { toggleDarkTheme, updateUserData } from "@/src/actions/userActions";
import LabelValue from "@/src/components/ui/LabelValue";
import PageTitle from "@/src/components/ui/PageTitle"
import PlaceHolder from '@/public/Profile_avatar_placeholder_large.png'
import SettingsSectionContainer from "@/src/components/ui/SettingsSectionContainer";
import ToggleOptionContainer from "@/src/components/ui/ToggleOptionContainer";
import { useToast } from "@/src/contexts/ToastContext";
import { useThemeStore } from "@/src/hooks/store/useDarkTheme";
import Image from "next/image";
import { FaRegMoon } from "react-icons/fa6"
import { SettingsPageModals } from "@/src/types/modal";
import { useEffect, useState } from "react";
import ImageExpand from "@/src/components/modal/ImageExpand";
import Button from "@/src/components/form/Button";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import Input from "@/src/components/form/Input";
import { UserInfosEditFormData, userInfosEditSchema } from "@/src/schemas/editUserInfosSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/src/lib/auth-client";
import Modal from "@/src/components/modal/Modal";
import Error from "@/src/components/ui/Error";

const Settings = () => {

  const { showToast } = useToast();

  const session = authClient.useSession();
  const user = session.data?.user;

  const [displayUser, setDisplayUser] = useState({
    name: "",
    email: "",
    image: ""
  });

  const userAvatar = user?.image;

  const [loading, setLoading] = useState<boolean>(false);
  const [passwordStep, setPasswordStep] = useState<'VERIFY' | 'CHANGE' | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const [activeModal, setActiveModal] = useState<SettingsPageModals | null>(null);
  const [editInfos, setEditInfos] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

  const isDark = useThemeStore((state) => state.isDark);
  const setDark = useThemeStore((state) => state.setDark);


  const { 
    register, 
    handleSubmit, 
    setValue, 
    reset,
    formState: { errors } 
  } = useForm<UserInfosEditFormData>({
    resolver: zodResolver(userInfosEditSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { 
        shouldValidate: true, 
        shouldDirty: true,
        shouldTouch: true 
      }); 

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleTheme = async() => {

    const toggleTheme = !isDark;
    setDark(toggleTheme);

    try {
      await toggleDarkTheme(toggleTheme);
    } catch (err:unknown) {
      setDark(isDark);
      showToast("Erro ao trocar o tema do sistema", "error");
    } 
  }


  const handleVerifyPassword = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: currentPassword, 
        revokeOtherSessions: false,
      });

      if (error) throw new window.Error("Senha atual incorreta");

      setPasswordStep('CHANGE');
    } catch (err:unknown) {
      showToast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (loading) return;
    setLoading(true);

    if (newPassword !== newPasswordRepeat) {
      setError('A senhas não coincidem');
      setLoading(false);
      return;
    } else if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caractéres');
      setLoading(false);
      return;
    }

    setError('');

    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        revokeOtherSessions: true,
      });

      if (error) throw new window.Error(error.message);

      showToast("A Senha foi alterada", "info");

      passwordModalCloseActions();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewUserInfos = async(data: UserInfosEditFormData) => {
    
    const result = userInfosEditSchema.safeParse(data);

    if (loading) return;
    setLoading(true);

    try {
      if (!result.success) throw new window.Error(result.error.issues[0].message);

      let finalImageUrl = userAvatar;

      const imageFile = data.image;
      const isNewImage = imageFile && (imageFile instanceof File || (imageFile as any).size > 0);

      if (isNewImage) {
        const formData = new FormData();
        formData.append("file", data.image);

        const res = await fetch("/api/image-upload", { 
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new window.Error("Falha no upload da imagem");
        
        const uploadData = await res.json();
        finalImageUrl = uploadData.url; 
      }

      await updateUserData({
        ...data,
        image: finalImageUrl
      });

      setDisplayUser({
        name: data.name,
        email: data.email,
        image: finalImageUrl as string
      });

      setValue("name", data.name);
      setValue("email", data.email);

      await authClient.getSession();

      showToast('Novos dados foram salvos', 'info');
      setEditInfos(false);
      setPreviewUrl(null);
    } catch (err:unknown) {
      showToast(`${err}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  const passwordModalCloseActions = () => {
    setActiveModal(null);
    setPasswordStep(null);
    setCurrentPassword("");
    setError('');
    setNewPassword("");
    setNewPasswordRepeat("");
  }

  useEffect(() => {
    if (session.data?.user) {
      setDisplayUser({
        name: session.data.user.name,
        email: session.data.user.email,
        image: session.data.user.image || "",
      });
    }
  }, [session.data?.user]);

  useEffect(() => {
    if (user && !loading && !editInfos) { 
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset, loading, editInfos]);

  return (
    <>
    <div>
      <PageTitle 
        title="Configurações"
        style="my-3 mb-4"
      />

      <div className="grid grid-cols-1 gap-4">
        <SettingsSectionContainer 
        sectionName="Sistema"
        style="order-1"
        >
          <ToggleOptionContainer
            icon={FaRegMoon}
            iconSize={25}
            label={'Tema escuro'}
            onChange={{
              toggleOption: () => handleToggleTheme(),
              optionValue: isDark,
            }}
          />      
        </SettingsSectionContainer>

        <SettingsSectionContainer 
        sectionName="Perfil" 
        style="order-2"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1">
            <input
              type="file"
              id="avatar-input"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!editInfos}
            />

            <div 
            className={`relative sm:order-2 mx-auto order-1 transition-all duration-200 h-fit w-fit border-2 rounded-full p-2 my-2 border-primary 
              ${editInfos 
                ? 'cursor-pointer hover:brightness-90'
                : 'cursor-zoom-in hover:scale-[1.025] hover:brightness-[1.1] hover:shadow-[0px_0px_15px_rgba(255,165,0,0.5)]' // Efeito original
              }`}
            onClick={() => {
              if (editInfos) {
                document.getElementById('avatar-input')?.click();
              } else {
                setActiveModal('IMAGE_EXPAND');
              }
            }}
            > 
              <Image
                src={previewUrl || displayUser.image || PlaceHolder}
                alt={"avatar"}
                height={270}
                width={270}
                className="rounded-full aspect-square object-cover pointer-events-none" // Adicione pointer-events-none aqui
              />

              {editInfos && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Trocar Foto
                  </span>
                </div>
              )}
            </div>
        
            <div className="m-2 flex flex-col space-y-2 order-2 sm:order-1">
              {!editInfos ? (
                <div className="space-y-3.5">
                  <LabelValue 
                    label={"Nome"} 
                    value={displayUser.name || '[Desconhecido]'}
                  />
                  <LabelValue 
                    label={"E-mail"} 
                    value={displayUser.email || '[Desconhecido]'}
                  />
                  <LabelValue 
                    label={"Senha"} 
                    value={'*********'}
                  />
                </div>
              ) : (
                <form 
                className="space-y-2"
                onSubmit={handleSubmit(handleSaveNewUserInfos)}
                >
                  <Input 
                    {...register('name')}
                    label="Nome"
                    placeholder={"Nome"} 
                    type={"text"}     
                    error={errors.name?.message}           
                  />
                  <Input 
                    {...register('email')}
                    label="E-mail"
                    placeholder={"E-mail"} 
                    type={"email"}        
                    error={errors.email?.message}        
                  />
                  
                  <div className="mt-4 flex justify-between">
                    <Button
                      type="button"
                      label="Alterar senha"
                      style={`w-fit px-5 ${buttonColorsScheme.yellow}`}
                      onClick={() => {
                        setActiveModal('PASSWORD');
                        setPasswordStep('VERIFY');
                      }}
                    />

                    <Button
                      type="submit"
                      loading={loading}
                      loadingLabel="Salvando"
                      spinnerColor="green"
                      label="Salvar"
                      style={`w-fit px-5 ${buttonColorsScheme.green}`}
                    />
                  </div>
                </form>
              )}

              <Button
                type="button"
                label={editInfos 
                  ? "Cancelar"
                  : "Editar informações"
                }
                style={`px-6 w-fit mt-auto ${editInfos
                  ? buttonColorsScheme.red
                  : buttonColorsScheme.yellow
                }`}
                onClick={() => setEditInfos(prev => !prev)}
              />
            </div>
          </div>
        </SettingsSectionContainer>
      </div>
    </div>

    {/* ⇊ MODALS ⇊ */}

    {/* PASSWORD VERIFY */}

    <Modal 
    isOpen={activeModal === 'PASSWORD'} 
    onCloseModalActions={() => {
      passwordModalCloseActions();
    }}
    hasXClose
    modalTitle={passwordStep === 'VERIFY'
      ? 'Verificar senha'
      : 'Alterar senha'
    } 
    >
      {passwordStep === 'VERIFY' ? (
        <>
        <p className="text-secondary-middledark">
          Insira sua senha atual para continuar
        </p>
        <Input 
          type="password" 
          colorScheme="primary"
          placeholder="Senha atual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Button 
          label="Verificar"
          loadingLabel="Processando"
          loading={loading}
          style={`w-full ${currentPassword.length === 0
            ? 'pointer-events-none opacity-70'
            : ''
          }`}
          onClick={handleVerifyPassword} 
          type={"button"}        
        />
        </>
      ) : (
        <>
        <p className="text-secondary-middledark">
          Insira a nova senha:
        </p>

        <Input 
          type="password" 
          placeholder="Nova senha"
          label="Nova senha"
          value={newPassword}
          onChange={(e) => {
            if (newPassword.length >= 6) setError('');
            setNewPassword(e.target.value);
          }}
        />

        <Input 
          label="Repetir nova senha"
          type="password" 
          placeholder="Nova senha"
          value={newPasswordRepeat}
          onChange={(e) => setNewPasswordRepeat(e.target.value)}
        />

        {error && <Error error={error}/>}

        <Button 
          label="Redefinir Senha"
          loading={loading}
          style={`w-full mt-2 ${buttonColorsScheme.green} ${newPassword.length === 0 || newPasswordRepeat.length === 0
            ? 'pointer-events-none opacity-70'
            : ''
          }`}
          loadingLabel="Processando"
          onClick={handleUpdatePassword} 
          type={"button"}        
        />
        </>
      )}
    </Modal>

    {/* IMAGE EXPAND */}

    <ImageExpand 
      modal={{
        isOpen: activeModal === 'IMAGE_EXPAND',
        onCloseActions: () => setActiveModal(null),
      }} image={{
        imageUrl: userAvatar || PlaceHolder,
        name: 'placeholder'
      }}
    />
    </>
  )
}

export default Settings