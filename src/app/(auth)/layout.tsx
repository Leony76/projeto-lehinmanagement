import React from "react";
import Image from "next/image";
import LRC from "@/public/LericoriaPadraoFogo2.png";
import { IoMenu } from "react-icons/io5";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <header>
        <nav className="flex justify-between items-center py-2 px-3 border-b-[1.5px] shadow-md border-primary  bg-linear-to-l from-primary to-primary-dark ">
          <ul>
            <Image src={LRC} alt="Lericoria" width={45} height={67} />
          </ul>
          <ul>
            <IoMenu size={50} className="text-secondary"/>
          </ul>
        </nav>
      </header>
      <main className="flex-1 mx-auto w-full max-w-270 p-2">
        {children}
      </main>
      <footer>
        <h4 className="bg-linear-to-b text-center py-2 text-secondary-light from-secondary-dark to-secondary-middledark">&copy; Leony Leandro Barros,<br/> Todos os Direitos Reservados</h4>
      </footer>
    </div>
  );
}
