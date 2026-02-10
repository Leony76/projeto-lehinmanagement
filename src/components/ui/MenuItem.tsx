import React from 'react'
import { usePathname } from "next/navigation";
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import Link from 'next/link';

type Props = {
  closeMenu: (value:boolean) => void;
  label: string;
  route: string;
  style?: string;
}

const MenuItem = ({closeMenu,
  label,
  route,
  style,
}:Props) => {

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <li className={`flex flex-col ${isActive(route) ? "text-white! p-2" : ''} ${style ?? ''}`}>
      {isActive(route) 
        ? label
        : <Link className={`${isActive(route) ? "" : buttonColorsScheme.menuLi} ${style ?? ''}`} onClick={() => closeMenu(false)} href={route}>
            {label}
          </Link>
      }
    </li>
  )
}

export default MenuItem