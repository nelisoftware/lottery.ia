import { Prisma } from "@prisma/client";

export type LotofacilCaixa = {
  concurso: number;
  data: string;
  dezenas: string[];
  premiacoes: Premiacao[];
};

// formato retornado pela API oficial da Caixa (servicebus2.caixa.gov.br)
export type LotofacilCaixaOficial = {
  numero: number;
  dataApuracao: string;
  listaDezenas: string[];
  listaRateioPremio: { numeroDeGanhadores: number }[];
};

type Premiacao = {
  descricao: string;
  faixa: number;
  ganhadores: number;
  valorPremio: number;
};

export type CreateLotofacil = Omit<Prisma.LotofacilUncheckedCreateInput, "createdAt" | "updatedAt" | "id">;
export type CreateLotofacilLinha = Omit<Prisma.LotofacilLinhasUncheckedCreateInput, "id">;

