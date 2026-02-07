"use client";

import PageTitle from "@/src/components/ui/PageTitle"
import SectionTitle from "@/src/components/ui/SectionTitle"
import ToggleButton from "@/src/components/ui/ToggleButton"
import { useThemeStore } from "@/src/store/useDarkTheme";
import { useState } from "react";
import { FaRegMoon } from "react-icons/fa6"

const Settings = () => {

  const isDark = useThemeStore((state) => state.isDark);
  const setDark = useThemeStore((state) => state.setDark);

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
            onChange={setDark}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings