import prisma from "@/libraries/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.lotofacilNumeros.findMany({ orderBy: { cont: "desc" } });
  return NextResponse.json(data);
}
