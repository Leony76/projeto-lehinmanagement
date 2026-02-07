"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LRC from "@/public/LericoriaPadraoFogo2.png";
import { IoMenu } from "react-icons/io5";
import Menu from "@/src/components/ui/Menu";
import { useLockScrollY } from "@/src/utils/useLockScrollY";

type Props = {
 children: React.ReactNode;
}

export default function AuthLayout({
  children,
}:Props) {
  const [menu, showMenu] = useState(false);
  
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useLockScrollY(menu);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);


  return (
    <div className="flex flex-col min-h-dvh dark:bg-black">
      <Menu 
        menu={menu} 
        showMenu={showMenu}
      />
      <header
        className={`
          fixed top-0 inset-x-0 z-50
          transition-transform duration-300 ease-in-out
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <nav className="relative z-60 flex justify-between items-center py-2 px-3 border-b-[1.5px] shadow-md border-primary bg-linear-to-l from-primary to-primary-dark  dark:bg-linear-to-l dark:from-gray-800 dark:to-gray-900">
          <ul>
            <Image src={LRC} alt="Lericoria" width={45} height={67} />
          </ul>
          <ul>
            <IoMenu 
              size={50} 
              onClick={() => showMenu(!menu)}
              className="text-secondary
                hover:scale-[1.1] hover:text-secondary-light
                transition duration-150 cursor-pointer
              "
            />
          </ul>
        </nav>
      </header>
      <main className="flex-1 mx-auto w-full max-w-270 pt-18 p-4">
        {children}
      </main>
      <footer>
        <h4 className="bg-linear-to-b dark:bg-linear-to-b dark:border-t dark:border-secondary dark:from-gray-800 dark:to-gray-900 text-center py-7 text-secondary-light from-secondary-dark to-secondary-middledark">&copy; Leony Leandro Barros,<br/> Todos os Direitos Reservados</h4>
      </footer>
    </div>
  );
}
