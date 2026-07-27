'use client';
import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { Button } from "nelisoftware-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function AuthPage() {

  async function handleSignIn() {
    await signIn('google', { callbackUrl: Route.link.home });
  }

  const form = (
    <div className="flex flex-col items-center bg-background rounded-md shadow-lg shadow-slate-500/50 p-10 mx-20 gap-6">
      <Image
        src="/logo.svg"
        alt=""
        height={0}
        width={0}
        style={{ height: 'auto', width: '200px' }}
        priority
      />
      <Button buttonColor="secondary" className="w-64 h-11" onClick={handleSignIn}>
        <Icons.tabler.Google size={18} />
        Entrar com Google
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col h-screen w-screen justify-between items-center bg-login ">
        <div />
        <div>
          {form}
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
