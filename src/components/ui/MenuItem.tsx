import React from 'react'
import { usePathname } from "next/navigation";
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Link from 'next/link';

type Props = {
  closeMenu: (value:boolean) => void;
  label: string;
  route: string;
}

const MenuItem = ({closeMenu, label, route}:Props) => {

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <li className={`flex flex-col ${isActive(route) ? "text-white! p-2" : ''}`}>
      {isActive(route) 
        ? label
        : <Link className={`${isActive(route) ? "" : buttonColorsScheme.menuLi}`} onClick={() => closeMenu(false)} href={route}>
            {label}
          </Link>
      }
    </li>
  )
}

export default MenuItem