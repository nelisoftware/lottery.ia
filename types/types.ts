import { Prisma } from "@prisma/client";

export type LotofacilCaixa = {
  concurso: number;
  data: string;
  dezenas: string[];
  premiacoes: Premiacao[];
};

type Premiacao = {
  descricao: string;
  faixa: number;
  ganhadores: number;
  valorPremio: number;
};

export type CreateLotofacil = Omit<Prisma.LotofacilUncheckedCreateInput, "createdAt" | "updatedAt" | "id">;
export type CreateLotofacilLinha = Omit<Prisma.LotofacilLinhasUncheckedCreateInput, "id">;

