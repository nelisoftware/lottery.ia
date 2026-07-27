'use server';

import { auth } from "@/libraries/auth/auth";
import { Route } from "@/libraries/routes";
import prisma from "@/libraries/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function approveUser(userId: string) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("Apenas administradores podem aprovar usuários.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { approved: true },
  });

  revalidatePath(Route.link.users);
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("Apenas administradores podem excluir usuários.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.email && user.email === session.user.email) {
    throw new Error("Não é possível excluir o próprio usuário.");
  }

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath(Route.link.users);
}
