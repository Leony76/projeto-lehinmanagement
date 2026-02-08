"use client";

import { toggleDarkTheme } from "@/src/actions/userActions";
import PageTitle from "@/src/components/ui/PageTitle"
import SectionTitle from "@/src/components/ui/SectionTitle"
import ToggleButton from "@/src/components/ui/ToggleButton"
import { useToast } from "@/src/contexts/ToastContext";
import { useThemeStore } from "@/src/store/useDarkTheme";
import { FaRegMoon } from "react-icons/fa6"

type Props = {
  settings: {
    systemTheme: boolean;
  };
}

const Settings = ({settings}:Props) => {

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
      <div className="bg-primary-light/7 p-2 space-y-2 rounded-4xl border border-primary-middledark">
        <SectionTitle 
          title="Sistema"
        />
        <div className="flex justify-between bg-secondary-light/50 rounded-4xl p-4 border border-secondary-middledark">
          <span className="flex text-lg text-primary-middledark items-center gap-1">
            <FaRegMoon size={25}/>
            Tema escuro
          </span>
          <ToggleButton 
            value={isDark}
            onChange={handleToggleTheme}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings