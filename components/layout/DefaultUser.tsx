
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";


export default function DefaultUser() {
  const [themeDark, setThemeDark] = React.useState<boolean>(false);

  const { data: session } = useSession();

  const onClickModeTheme = React.useCallback(() => {
    document.documentElement.classList.toggle('dark');
    setThemeDark(!themeDark);

    localStorage.theme = !themeDark ? 'dark' : 'light';
  }, [themeDark]);


  const onClickLogout = React.useCallback(async () => {
    await signOut({ callbackUrl: Route.link.login });
  }, []);



return (
  <>
    <div className="flex divide-x divide-slate-700 divide-solid">
      <div className="hidden md:flex flex-col m-1 w-56 items-end justify-center">
        <span className="text-sm text-slate-600 dark:text-slate-200">
          {session?.user?.name ?? session?.user?.email ?? ''}
        </span>
      </div>

      <Image
        className="m-1 p-1 w-12 h-12 rounded-full"
        src={session?.user?.image ?? '/user.jpg'}
        alt=""
        priority
        width={48} height={48}
      />

      <div className="flex flex-col  justify-center gap-1 px-3">
        <button
          onClick={onClickModeTheme}
          className="text-slate-600 dark:text-slate-400 hover:text-hoverColor dark:hover:text-hoverColor"
        >
          {themeDark ? (
            <Icons.tabler.Light xlinkTitle="Altenar para tema Claro" size={18} />
          ) : (
            <Icons.tabler.Night xlinkTitle="Altenar para tema escuro" size={18} />
          )}
        </button>
        <button
          onClick={onClickLogout}
          className=" text-slate-600 dark:text-slate-400 hover:text-hoverColor dark:hover:text-hoverColor"
        >
          <Icons.tabler.Logout xlinkTitle="Sair do sistema" size={18} />
        </button>
      </div>
    </div>
  </>
);

}