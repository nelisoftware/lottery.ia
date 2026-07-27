import { Lotofacil } from "@prisma/client";
import { DateTime } from "luxon";
import { extrairBolas } from "./numeros";

export interface HistoricalAnalysisItem {
  concurso: number;
  date: string;
  hits: number;
  prizeLevel: number | null;
}

export function calcularAcertos(cartao: number[], sorteio: number[]): number {
  return cartao.filter((num) => sorteio.includes(num)).length;
}

export function conferirHistorico(cartao: number[], historico: Lotofacil[]): HistoricalAnalysisItem[] {
  return historico.map((result) => {
    const hits = calcularAcertos(cartao, extrairBolas(result));
    return {
      concurso: result.numero,
      date: DateTime.fromJSDate(new Date(result.dataApuracao)).toFormat("dd/MM/yyyy"),
      hits,
      prizeLevel: hits >= 11 ? hits : null,
    };
  });
}
