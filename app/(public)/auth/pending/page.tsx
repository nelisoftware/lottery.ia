'use client';
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Button } from "nelisoftware-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthPendingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [checking, setChecking] = React.useState(false);

  async function handleCheckAgain() {
    setChecking(true);
    const session = await update();
    setChecking(false);
    if (session?.user?.approved) {
      router.push(Route.link.home);
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: Route.link.login });
  }

  const content = (
    <div className="flex flex-col items-center bg-background rounded-md shadow-lg shadow-slate-500/50 p-10 mx-20 gap-6 text-center">
      <Image
        src="/logo.svg"
        alt=""
        height={0}
        width={0}
        style={{ height: 'auto', width: '200px' }}
        priority
      />
      <p className="text-slate-600 dark:text-slate-200 max-w-xs">
        Sua conta aguarda aprovação de um administrador para acessar o sistema.
      </p>
      <div className="flex flex-col items-center gap-2 w-64">
        <Button buttonColor="secondary" className="w-full h-11" disabled={checking} onClick={handleCheckAgain}>
          <Icons.tabler.Refresh size={18} className={checking ? "animate-spin" : undefined} />
          Verificar novamente
        </Button>
        <Button buttonColor="danger" className="w-full h-11" onClick={handleSignOut}>
          <Icons.tabler.Logout size={18} />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col h-screen w-screen justify-between items-center bg-login ">
        <div />
        <div>
          {content}
        </div>
        <div className="flex flex-col items-center gap-2 ">
          <Image
            src="/company.svg"
            alt=""
            height={0}
            width={0}
            style={{ height: '60px', width: 'auto' }}
            priority={undefined}
          />
          <p className="text-white text-base h-8">
            &copy; 2007- {new Date().getFullYear()} - powered by nelisoftware
          </p>
        </div>
      </div></>
  );
}
