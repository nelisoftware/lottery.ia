import prisma from "@/libraries/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.lotofacilNumeroSaindo.findMany({
    orderBy: [{ cont: "desc" }, { numero: "asc" }],
    where: { cont: { gt: 0 } },
  });

  return NextResponse.json(data);
}
