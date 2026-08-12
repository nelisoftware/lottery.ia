'use client';

import { poppins } from '@/styles/fonts';
import { usePathname } from 'next/navigation';
import React from "react";
import DefaultLogo from "./DefaultLogo";
import { DefaultMenu } from "./DefaultMenu";
import DefaultUser from "./DefaultUser";
import { Icons } from '@/libraries/icons';


export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const onClickMenuMobile = React.useCallback(() => {
    if (!menuRef.current) return;
    menuRef.current?.classList.toggle('hidden');

  }, [menuRef]);

  // Fecha o menu mobile automaticamente após navegar para uma nova rota.
  React.useEffect(() => {
    menuRef.current?.classList.add('hidden');
  }, [pathname]);


  React.useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className={`${poppins.className}`}>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex items-center overflow-hidden h-14 w-full pl-1">
          <div className='flex items-center '>
            <button
              className="flex md:hidden text-slate-600 dark:text-slate-200 hover:text-slate-950 hover:bg-hoverColor  dark:hover:bg-slate-700 text-xl font-semibold rounded-sm p-1 "
              onClick={onClickMenuMobile}>
              <Icons.tabler.Menu stroke={1} />
            </button>
          </div>
          <div className='hidden sm:flex'>
            <DefaultLogo />
          </div>
          <div className='grow' />
          <DefaultUser />
        </div>
        <div className="h-full flex overflow-hidden">
          <div ref={menuRef} className="hidden flex w-sideBar md:flex h-full overflow-hidden flex-col ">
            <div className="grow overflow-y-auto overflow-x-hidden">
              <DefaultMenu />
            </div>
          </div>
          <div className="flex-1 overflow-auto text-slate-700 dark:text-slate-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}