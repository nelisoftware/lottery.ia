import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function handleError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Dados já existentes' }, { status: 409 });
    }

    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Dados não encontrado' }, { status: 404 });
    }
  }

  throw e;
}