"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LRC from "@/public/LericoriaPadraoFogo2.png";
import { IoMenu } from "react-icons/io5";
import Menu from "@/src/components/ui/Menu";
import { useLockScrollY } from "@/src/hooks/useLockScrollY";
import { useHideHeaderOnScrollDown } from "@/src/hooks/useHideHeaderOnScrollDown";
import { useUserStore } from "@/src/hooks/store/useUserStore";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const user = useUserStore((state) => state.user);
  const [menu, showMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const navigate = useRouter();

  useLockScrollY(menu);
  const { showHeader } = useHideHeaderOnScrollDown();

  useEffect(() => {
    setMounted(true);
    if (user && user.isActive === false) {
      navigate.push('/dashboard');
    }

    const timer = setTimeout(() => setShowOverlay(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="relative min-h-screen">
      {showOverlay && (
        <div
          className={`
            fixed inset-0 z-999 flex items-center justify-center bg-black
            transition-opacity duration-500 ease-in-out
            ${mounted ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      )}

      <div 
        className={`
          transition-opacity duration-700 ease-in-out
          ${mounted ? "opacity-100" : "opacity-0"}
        `}
      >
        {user?.isActive ? (
          <div className="flex flex-col min-h-dvh dark:bg-black">
            <Menu menu={menu} showMenu={showMenu} />
            <header
              className={`
                fixed top-0 inset-x-0 z-50
                transition-transform duration-300 ease-in-out
                ${showHeader ? "translate-y-0" : "-translate-y-full"}
              `}
            >
              <nav className="relative z-60 flex justify-between items-center py-2 px-3 border-b-[1.5px] shadow-md border-primary bg-linear-to-l from-primary to-primary-dark dark:bg-linear-to-l dark:from-gray-800 dark:to-gray-900">
                <Image src={LRC} alt="Lericoria" width={45} height={67} />
                <IoMenu
                  size={50}
                  onClick={() => showMenu(!menu)}
                  className="text-secondary hover:scale-[1.1] hover:text-secondary-light transition duration-150 cursor-pointer"
                />
              </nav>
            </header>

            <main className="flex-1 mx-auto w-full max-w-270 pt-18 p-4">
              {children}
            </main>

            <footer>
              <h4 className="bg-linear-to-b dark:bg-linear-to-b dark:border-t dark:border-secondary dark:from-gray-800 dark:to-gray-900 text-center py-7 text-secondary-light from-secondary-dark to-secondary-middledark">
                &copy; Leony Leandro Barros,<br /> Todos os Direitos Reservados
              </h4>
            </footer>
          </div>
        ) : (
          <main className="bg-black h-screen flex justify-center items-center">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}