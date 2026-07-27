import prisma from "@/libraries/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.lotofacil.findFirst({ orderBy: {
      numero: 'desc'
    }});  

    if (!data) return NextResponse.json([]);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "erro ao procurar os ultimos concursos" },
      { status: 500 }
    );
  }
}