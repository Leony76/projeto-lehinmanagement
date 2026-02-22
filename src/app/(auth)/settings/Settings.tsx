"use client";

import { toggleDarkTheme } from "@/src/actions/userActions";
import PageTitle from "@/src/components/ui/PageTitle"
import SectionTitle from "@/src/components/ui/SectionTitle"
import SettingsSectionContainer from "@/src/components/ui/SettingsSectionContainer";
import ToggleButton from "@/src/components/ui/ToggleButton"
import ToggleOptionContainer from "@/src/components/ui/ToggleOptionContainer";
import { useToast } from "@/src/contexts/ToastContext";
import { useThemeStore } from "@/src/hooks/store/useDarkTheme";
import { FaRegMoon } from "react-icons/fa6"

const Settings = () => {

  const { showToast } = useToast();

  const isDark = useThemeStore((state) => state.isDark);
  const setDark = useThemeStore((state) => state.setDark);

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

  return (
    <div>
      <PageTitle 
        title="Configurações"
        style="my-3 mb-4"
      />

      <SettingsSectionContainer sectionName="Sistema" >
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
    </div>
  )
}

export default Settings