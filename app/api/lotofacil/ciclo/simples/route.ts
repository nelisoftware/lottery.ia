import prisma from "@/libraries/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.lotofacilCiclo.findMany({ orderBy: {
    concurso: 'desc'
  }});  
  return NextResponse.json(data);
}