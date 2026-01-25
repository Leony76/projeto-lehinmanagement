"use client"

import { buttonColorsScheme, titleColors } from '@/src/constants/systemColorsPallet';
import MenuItem from './MenuItem';
import { useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth-client';
import { useUserStore } from '@/src/store/useUserStore';
import Spinner from './Spinner';
import { ROLE_LABEL } from '@/src/constants/generalConfigs';
import { getNameAndSurname } from '@/src/utils/getNameAndSurname';

type Props = {
  menu: boolean;
  showMenu: (value:boolean) => void;
}

const Menu = ({menu, showMenu}:Props) => {
  const user = useUserStore((status) => status.user);

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setTimeout(() => {
            useUserStore.getState().clearUser();
          },1000);
          router.push("/login");
        },
      },
    });
  };

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
          <ul className="text-[15px]">
            <MenuItem route='/dashboard' closeMenu={showMenu} label={'Dashboard'}/>
            <MenuItem route='/products' closeMenu={showMenu} label={'Produtos'}/>
            {user?.role === 'SELLER' && <MenuItem route='/orders' closeMenu={showMenu} label={'Pedidos'}/>}
            {(user?.role === 'CUSTOMER' || user?.role === 'SELLER') &&  <MenuItem route='/products/my-products' closeMenu={showMenu} label={'Meus Produtos'}/>}
          {user?.role === 'SELLER' ? (
            <MenuItem route='/products/sell-product' closeMenu={showMenu} label={'Vender Produto'}/>
          ) : user?.role === 'ADMIN' ? (
            <MenuItem style='text-[13px]' route='/products/sell-product' closeMenu={showMenu} label={'Adicionar Produto'}/>) : (<></>)}
          {user?.role !== 'ADMIN' && <MenuItem route='/orders/my-orders' closeMenu={showMenu} label={'Meus Pedidos'}/>}
          </ul>
          <ul className="mt-auto text-center mb-5">
            <li className={`${buttonColorsScheme.menuLi} text-secondary!`}>
              {user?.name 
                ? getNameAndSurname(user.name) 
                : <Spinner color='primary'/> + "Carregando..."
              }
            </li>
            <li className={`${buttonColorsScheme.menuLi} pt-0 text-sm hover:bg-transparent! hover:cursor-auto text-yellow!`}>
              {user?.role ? ROLE_LABEL[user.role] : '—'}
            </li>
            <li className={`${buttonColorsScheme.menuLi} p-0! flex flex-col text-red-300 text-lg text-shadow-2xs hover:text-red-100! active:text-red-600!`}>
              <button className='p-1 cursor-pointer' onClick={handleLogout}>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    </>
  )
}

export default Menu