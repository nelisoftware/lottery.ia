import { Prisma } from "@prisma/client";

export type LotofacilCaixa = {
  dataApuracao: string;
  acumulado: boolean;
  numero: number;
  listaDezenas: string[];
  listaRateioPremio: ListaRateioPremio[];
};

type ListaRateioPremio = {
  descricaoFaixa: string;
  faixa: number;
  numeroDeGanhadores: number;
  valorPremio: number;
};

export type CreateLotofacil = Omit<Prisma.LotofacilUncheckedCreateInput, "createdAt" | "updatedAt" | "id">;
export type CreateLotofacilLinha = Omit<Prisma.LotofacilLinhasUncheckedCreateInput, "id">;

