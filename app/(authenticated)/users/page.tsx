import DefaultContent from "@/components/layout/DefaultContent";
import { Icons } from "@/libraries/icons";
import { auth } from "@/libraries/auth/auth";
import prisma from "@/libraries/prisma/prisma";
import { Route } from "@/libraries/routes";
import { Button } from "nelisoftware-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { redirect } from "next/navigation";
import { approveUser } from "./actions";
import DeleteUserButton from "./DeleteUserButton";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect(Route.link.home);
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pending = users.filter((user) => !user.approved);
  const approved = users.filter((user) => user.approved);

  return (
    <DefaultContent title="Usuários" icon={<Icons.tabler.User size={24} />}>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="font-medium text-lg">Pendentes de aprovação</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum usuário aguardando aprovação.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pending.map((user) => (
                <div key={user.id} className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-md p-2">
                  <Image
                    src={user.image ?? "/user.jpg"}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="flex flex-col grow">
                    <span className="font-medium">{user.name ?? user.email}</span>
                    <span className="text-sm text-slate-500">{user.email}</span>
                  </div>
                  <span className="text-sm text-slate-500 hidden md:block">
                    {DateTime.fromJSDate(user.createdAt).toFormat("dd/LL/yyyy HH:mm")}
                  </span>
                  <form action={approveUser.bind(null, user.id)}>
                    <Button buttonColor="success" type="submit">
                      <Icons.tabler.Check size={18} />
                      Aprovar
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-medium text-lg">Aprovados</h2>
          <div className="flex flex-col gap-2">
            {approved.map((user) => (
              <div key={user.id} className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-md p-2">
                <Image
                  src={user.image ?? "/user.jpg"}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="flex flex-col grow">
                  <span className="font-medium">{user.name ?? user.email}</span>
                  <span className="text-sm text-slate-500">{user.email}</span>
                </div>
                {user.isAdmin && (
                  <span className="text-xs font-medium uppercase text-blue-500">Administrador</span>
                )}
                <DeleteUserButton userId={user.id} userLabel={user.name ?? user.email} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </DefaultContent>
  );
}
