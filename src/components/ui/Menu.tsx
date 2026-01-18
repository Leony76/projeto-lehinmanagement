import { buttonColorsScheme, titleColors } from '@/src/constants/systemColorsPallet';
import Link from 'next/link';
import React from 'react'

type Props = {
  menu: boolean;
  showMenu: (value:boolean) => void;
}

const Menu = ({menu, showMenu}:Props) => {
  return (
    <>
    <div
      onClick={() => showMenu(false)}
      className={`
        fixed inset-0 z-40 bg-black/50
        transition-opacity duration-300
        ${menu ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    />
    <aside
      className={`
        fixed top-0 right-0 z-50
        h-dvh w-40
        border-l-2 border-primary rounded-bl-[75px]
        bg-linear-to-r from-primary-middledark to-primary-dark
        shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${menu ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="p-4 h-full flex flex-col">
        <h2 className={`${titleColors.secondaryDark} text-center text-3xl mt-16 mb-4`}>
          Menu
        </h2>
        <nav className="flex flex-col flex-1">
          <ul className="space-y-1">
            <li className={buttonColorsScheme.menuLi}><Link onClick={() => showMenu(false)} href="/dashboard">Dashboard</Link></li>
            <li className={buttonColorsScheme.menuLi}><Link onClick={() => showMenu(false)} href="/products">Produtos</Link></li>
            <li className={buttonColorsScheme.menuLi}><Link onClick={() => showMenu(false)} href="/products">Pedidos</Link></li>
            <li className={`${buttonColorsScheme.menuLi} text-[15px]`}><Link onClick={() => showMenu(false)} href="/products/my-products">Meus Produtos</Link></li>
            <li className={`${buttonColorsScheme.menuLi} text-[16px]`}><Link onClick={() => showMenu(false)} href="/products/my-products">Vender Produto</Link></li>
            <li className={buttonColorsScheme.menuLi}><Link onClick={() => showMenu(false)} href="/orders/my-orders">Meus Pedidos</Link></li>
          </ul>
          <ul className="mt-auto text-center mb-5">
            <li className={`${buttonColorsScheme.menuLi} text-secondary!`}>Leony Leandro</li>
            <li className={`${buttonColorsScheme.menuLi} text-red-300 text-lg text-shadow-2xs hover:!text-red-100 active:!text-red-600`}>
              <Link onClick={() => showMenu(false)} href="/dashboard">
                Sair
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    </>
  )
}

export default Menu